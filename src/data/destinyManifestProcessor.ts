import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugItemCraftingRequirements, DestinyPlugWhitelistEntryDefinition, DestinySocketTypeDefinition } from "bungie-api-ts/destiny2";
import { DataSearchStrings } from "./dataSearchStringService";
import { ItemTierIndex, type IPerkOption, type IPerkSlotOptions, type IWeapon, type UsedDestinyManifestSlice } from "./types";
import { hashMapToArray } from "./util";

interface IResolvedPlugItem {
    craftingRequirements: DestinyPlugItemCraftingRequirements;
    currentlyCanRoll: boolean;
    item: DestinyInventoryItemDefinition;
}

interface IResolvedPlugSet {
    index: number;
    socketType: DestinySocketTypeDefinition | undefined;
    singleInitialItemHash: number;
    randomizedItems: IResolvedPlugItem[];
    reusableItems: IResolvedPlugItem[];
}

export class DestinyManifestProcessor {
    constructor(
        private readonly manifest: UsedDestinyManifestSlice
    ) {
        this.stripRedactedAndUnneeded();
    }

    private stripRedactedAndUnneeded = () => {
        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const allowedPlugCategoryIds = [
            DataSearchStrings.CategoryIDs.IntrinsicPlug,

            DataSearchStrings.CategoryIDs.BarrelsPlug,
            DataSearchStrings.CategoryIDs.BladesPlug,
            DataSearchStrings.CategoryIDs.BowstringsPlug,
            DataSearchStrings.CategoryIDs.HaftsPlug,
            DataSearchStrings.CategoryIDs.ScopesPlug,
            DataSearchStrings.CategoryIDs.TubesPlug,

            DataSearchStrings.CategoryIDs.ArrowsPlug,
            DataSearchStrings.CategoryIDs.BatteriesPlug,
            DataSearchStrings.CategoryIDs.GuardsPlug,
            DataSearchStrings.CategoryIDs.MagazinesPlug,
            DataSearchStrings.CategoryIDs.MagazinesGLPlug,

            DataSearchStrings.CategoryIDs.FramesPlug,
            DataSearchStrings.CategoryIDs.OriginsPlug,
            DataSearchStrings.CategoryIDs.TrackerPlug,
            DataSearchStrings.CategoryIDs.ExoticMasterworkPlug,
            DataSearchStrings.CategoryIDs.CatalystsPlug,
            DataSearchStrings.CategoryIDs.StocksPlug,

            DataSearchStrings.CategoryIDs.WeaponModDamage,
            DataSearchStrings.CategoryIDs.WeaponModGuns,
        ];
        const itemHashesToRemove: number[] = [];
        for (const key in this.manifest.DestinyInventoryItemDefinition) {
            const item = this.manifest.DestinyInventoryItemDefinition[key];
            
            const isWeapon = !!item.traitIds && item.traitIds.includes(DataSearchStrings.TraitIDs.Weapon)
                && !!item.screenshot // Some weapons don't have screenshots - probably for the crafting menu.
                && !!item.quality
                && !!item.quality.infusionCategoryHash; // Others don't have an infusion category, probably also crafting related.
            const isModOrPerk = item.plug && allowedPlugCategoryIds.includes(item.plug.plugCategoryIdentifier);
            const isMasterwork = item.plug && item.plug.plugCategoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponMasterworkPlugComponent);

            if (!isWeapon && !isModOrPerk && !isMasterwork) {
                itemHashesToRemove.push(item.hash);
            }
        }
        for (const hash of itemHashesToRemove) {
            delete this.manifest.DestinyInventoryItemDefinition[hash];
        }

        // Remove redacted values
        for (const key in this.manifest) {
            const table = key as keyof UsedDestinyManifestSlice;
            const component = this.manifest[table];

            // Add the redacted items to a list as we can't modify a collection while iterating it.
            const itemHashesToRemove: number[] = [];
            for (const hash in component) {
                const item = component[hash];
                if (item.redacted) {
                    itemHashesToRemove.push(item.hash);
                }
            }

            // Remove redacted items
            for (const hash of itemHashesToRemove) {
                delete component[hash];
            }
        }
    }

    public get weapons() {
        const weapons: DestinyInventoryItemDefinition[] = [];

        for (const key in this.manifest.DestinyInventoryItemDefinition) {
            const item = this.manifest.DestinyInventoryItemDefinition[key];
            // No categories, ignore. No display name means it's probably not an item we care about.
            if (!item.traitIds || !item.displayProperties.name) continue;

            // Seem to be duplicates for some weapons that don't have a screenshot - this
            // is probably the item used for the crafting menu, so ignore it.
            if (item.traitIds.includes(DataSearchStrings.TraitIDs.Weapon) && !!item.screenshot) {
                weapons.push(item);
            }
        }
        // Sort the weapons newest to oldest (roughly).
        // TODO: find a better way to sort, or manually curate the order to show recent weapons.
        weapons.sort((a, b) => b.index - a.index);

        return weapons.map(this.getWeaponPerkInfo);
    }

    private getWeaponPerkInfo = (weaponItem: DestinyInventoryItemDefinition): IWeapon => {
        const weaponSockets = weaponItem.sockets?.socketEntries || [];

        const resolvedSocketItems = weaponSockets.map((s, index) => {
            const socketType = this.getSocketTypeDefinition(s.socketTypeHash);
            const randomizedPlugSet = s.randomizedPlugSetHash ? this.getPlugSetDefinition(s.randomizedPlugSetHash) : undefined;
            const reusablePlugSet = s.reusablePlugSetHash ? this.getPlugSetDefinition(s.reusablePlugSetHash) : undefined;

            const randomizedPlugItems = randomizedPlugSet ? randomizedPlugSet.reusablePlugItems : [];
            const reusablePlugItems = reusablePlugSet ? reusablePlugSet.reusablePlugItems : [];
            const singleInitialItem = s.singleInitialItemHash;

            const resolved: IResolvedPlugSet = {
                index: index,
                socketType: socketType,
                singleInitialItemHash: singleInitialItem,
                randomizedItems: this.resolvePlugItems(randomizedPlugItems),
                reusableItems: this.resolvePlugItems(reusablePlugItems),
            };
            return resolved;
        });

        // Get lists of sockets - perks first
        const intrinsicPerkSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => !!i.item.plug && i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.IntrinsicPlug);
        });
        const validPerkPlugCategories = [
            DataSearchStrings.CategoryIDs.BarrelsPlug,
            DataSearchStrings.CategoryIDs.BladesPlug,
            DataSearchStrings.CategoryIDs.BowstringsPlug,
            DataSearchStrings.CategoryIDs.HaftsPlug,
            DataSearchStrings.CategoryIDs.ScopesPlug,
            DataSearchStrings.CategoryIDs.TubesPlug,

            DataSearchStrings.CategoryIDs.ArrowsPlug,
            DataSearchStrings.CategoryIDs.BatteriesPlug,
            DataSearchStrings.CategoryIDs.GuardsPlug,
            DataSearchStrings.CategoryIDs.MagazinesPlug,
            DataSearchStrings.CategoryIDs.MagazinesGLPlug,

            DataSearchStrings.CategoryIDs.FramesPlug,
            DataSearchStrings.CategoryIDs.OriginsPlug,
            DataSearchStrings.CategoryIDs.ExoticMasterworkPlug,
            DataSearchStrings.CategoryIDs.CatalystsPlug,
            DataSearchStrings.CategoryIDs.StocksPlug,
        ];
        const weaponPerkSockets = resolvedSocketItems.filter(r => {
            return r.randomizedItems
                .concat(r.reusableItems)
                .some(i => !!i.item.plug && validPerkPlugCategories.includes(i.item.plug.plugCategoryIdentifier));
        });

        // Then, MW + Mods
        const masterworkSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => {
                return !!i.item.plug
                    && i.item.plug.plugCategoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponMasterworkPlugComponent);
            });
        });
        const modSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => {
                return !!i.item.plug
                    && (i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModDamage
                        || i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModGuns);
            });
        });

        const intrinsic = this.getIntrinsicFromSockets(intrinsicPerkSocket);
        const perkOptions = this.getPerkOptionsFromSockets(weaponPerkSockets);
        const curated = this.getCuratedFromPerkSockets(weaponPerkSockets, perkOptions);
        const masterworks = this.getMasterworkOptionsFromSockets(masterworkSocket);
        const mods = this.getModOptionsFromSockets(modSocket);

        return {
            weapon: weaponItem,
            intrinsic: intrinsic,
            perks: perkOptions,
            curated: curated,
            masterworks: masterworks,
            mods: mods,
        };
    }

    private resolvePlugItems = (plugItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[]) => {
        const resolved = plugItems.map(i => {
            return {
                craftingRequirements: i.craftingRequirements,
                currentlyCanRoll: i.currentlyCanRoll,
                item: this.getItemDefinition(i.plugItemHash),
            }
        }).filter(i => !!i.item);
        return resolved;
    }

    private getIntrinsicFromSockets = (intrinsicSocket: IResolvedPlugSet | undefined) => {
        if (!intrinsicSocket) return undefined;
        const intrinsicPerk = intrinsicSocket && intrinsicSocket.reusableItems.length > 0
            ? intrinsicSocket.reusableItems[0].item
            : undefined;
        return intrinsicPerk;
    }

    private getPerkOptionsFromSockets = (perkSockets: IResolvedPlugSet[]) => {
        // Either one or the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const plugItems = perkSockets.map(plugSet => plugSet.randomizedItems.concat(plugSet.reusableItems));
        const perkSlotOptions = plugItems.map(this.getPerkOptionsFromPlugSet);
        return perkSlotOptions;
    }

    private getPerkOptionsFromPlugSet = (plugItems: IResolvedPlugItem[]) => {
        const currentlyCanRollMap: { [plugItemHash: number]: boolean } = {};
        const requiredCraftedLevelMap: { [plugItemHash: number]: number | undefined } = {};
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};
        const perksInSlot: DestinyInventoryItemDefinition[] = [];

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of plugItems || []) {
            const item = plugItem.item;
            if (!item || seenPlugItems[item.hash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[item.hash] = plugItem.currentlyCanRoll;
            if (plugItem.craftingRequirements) {
                requiredCraftedLevelMap[item.hash] = plugItem.craftingRequirements.requiredLevel;
            }

            perksInSlot.push(item);
        }

        const normalPerks = perksInSlot.filter(p => {
            if (!p.inventory) return false;
            const itemTier = this.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Common;
        });
        const enhancedPerks = perksInSlot.filter(p => {
            if (!p.inventory) return false;
            const itemTier = this.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Uncommon;
        });

        const perkOptions: IPerkOption[] = [];
        for (const perk of normalPerks) {
            const enhancedPerk = enhancedPerks.find(p => p.displayProperties.name.includes(perk.displayProperties.name));

            const craftedLevel = requiredCraftedLevelMap[perk.hash];
            const enhancedCraftedLevel = enhancedPerk ? requiredCraftedLevelMap[enhancedPerk.hash] : undefined;
            const perkOption: IPerkOption = {
                perk: perk,
                enhancedPerk: enhancedPerk,
                // Some perks have no base crafted level (can be crafted at level 0), but do have an enhanced crafted level
                craftingInfo: craftedLevel || enhancedCraftedLevel ?
                    {
                        requiredLevel: craftedLevel,
                        requiredLevelEnhanced: enhancedCraftedLevel
                    }
                    : undefined,
                currentlyCanRoll: currentlyCanRollMap[perk.hash],
                useEnhanced: false,
            };
            perkOptions.push(perkOption);
        }

        const slotOptions: IPerkSlotOptions = {
            options: perkOptions,
        };
        return slotOptions;
    }

    private getCuratedFromPerkSockets = (perkSockets: IResolvedPlugSet[], randomRollPerkOptions: IPerkSlotOptions[]) => {
        return perkSockets
            .map((s, index) => {
                const perkSlotOptions = randomRollPerkOptions[index] || [];
                if (s.singleInitialItemHash) {
                    const perkOption = perkSlotOptions.options.find(o => o.perk.hash === s.singleInitialItemHash);
                    // Sometimes, a curated perk is a perk that the weapon cannot normally roll. Construct a new
                    // perk option object in this case, as there's nothing to match up with anyway.
                    if (perkOption) return perkOption;
                    const perkItem = this.getItemDefinition(s.singleInitialItemHash);
                    return { perk: perkItem, enhancedPerk: undefined, currentlyCanRoll: true, useEnhanced: false, } as IPerkOption;
                } else {
                    // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                    const itemHash = !!s && s.randomizedItems.length > 0 ? s.randomizedItems[0].item.hash : undefined;
                    return perkSlotOptions.options.find(o => o.perk.hash === itemHash);
                }
            })
            .map(i => i!)
            // Checking for undefined here to have better defined behavior, but it really should never be undefined.
            .map<IPerkSlotOptions>(o => { return { options: o ? [o] : [] }; });
    }

    private getMasterworkOptionsFromSockets = (masterworkSocket: IResolvedPlugSet | undefined) => {
        if (!masterworkSocket) return [];
        return masterworkSocket.reusableItems
            .map(i => i.item)
            .filter(i => !!i)
            .map(i => i!);
    }

    private getModOptionsFromSockets = (modSocket: IResolvedPlugSet | undefined) => {
        if (!modSocket) return [];
        // TODO: it seems like the adept mods are placed in the modSocket.reusablePlugItems property
        return modSocket!.reusableItems
            .map(i => i.item)
            // The only mod that has this plug category ID is the empty mod slot which is useless here.
            .filter(i => i && i.plug && i.plug.plugCategoryIdentifier !== DataSearchStrings.CategoryIDs.WeaponMod)
            .map(i => i!)
    }

    private getItemDefinition = (hash: number) => {
        return this.manifest.DestinyInventoryItemDefinition[hash];
    }

    private getItemTierDefinition = (hash: number) => {
        return this.manifest.DestinyItemTierTypeDefinition[hash];
    }

    private getPlugSetDefinition = (hash: number) => {
        return this.manifest.DestinyPlugSetDefinition[hash];
    }

    private getSocketTypeDefinition = (hash: number) => {
        return this.manifest.DestinySocketTypeDefinition[hash];
    }

    public get damageTypes() { return hashMapToArray(this.manifest.DestinyDamageTypeDefinition); }
    public get damageTypeLookup() { return this.manifest.DestinyDamageTypeDefinition; }
    public get itemCategories() { return hashMapToArray(this.manifest.DestinyItemCategoryDefinition); }
    public get itemCategoriesLookup() { return this.manifest.DestinyItemCategoryDefinition; }
    public get itemTierTypes() { return hashMapToArray(this.manifest.DestinyItemTierTypeDefinition); }
    public get itemTierTypesLookup() { return this.manifest.DestinyItemTierTypeDefinition; }
    public get seasons() {
        const list = hashMapToArray(this.manifest.DestinySeasonDefinition);
        list.sort((a, b) => b.seasonNumber - a.seasonNumber);
        return list;
    }
    public get seasonsLookup() { return this.manifest.DestinySeasonDefinition; }

    public get statsLookup() { return this.manifest.DestinyStatDefinition; }
    public get statGroupsLookup() { return this.manifest.DestinyStatGroupDefinition; }
    public get itemLookup() { return this.manifest.DestinyInventoryItemDefinition; }
    public get plugSetLookup() { return this.manifest.DestinyPlugSetDefinition; }
    public get socketCategoryLookup() { return this.manifest.DestinySocketCategoryDefinition; }
    public get socketTypeLookup() { return this.manifest.DestinySocketTypeDefinition; }
}
