import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryDefinition, DestinyPlugSetDefinition, DestinyPlugWhitelistEntryDefinition } from "bungie-api-ts/destiny2";
import { dataSearchStringService } from "./dataSearchStringService";
import { ItemTierIndex, type IPerkOption, type IPerkSlotOptions, type IWeapon, type UsedDestinyManifestSlice } from "./types";
import { findItemInTable, hashMapToArray } from "./util";

export class DestinyManifestProcessor {
    public readonly itemCategories;
    public readonly originPerkCategory;
    public readonly weaponIntrinsicCategory;
    public readonly weaponPerkCategory;

    constructor(
        private readonly manifest: UsedDestinyManifestSlice
    ) {
        this.itemCategories = hashMapToArray(manifest.DestinyItemCategoryDefinition);
        this.originPerkCategory = this.itemCategories.find(category => category.displayProperties.name === dataSearchStringService.CategoryNames.WeaponOriginPerk);

        this.weaponIntrinsicCategory = findItemInTable(this.socketCategoryLookup, category => category.displayProperties.name === dataSearchStringService.CategoryNames.WeaponIntrinsicPerk);
        this.weaponPerkCategory = findItemInTable(this.socketCategoryLookup, category => category.displayProperties.name === dataSearchStringService.CategoryNames.WeaponPerkSocket);

        this.stripRedactedAndUnneeded();
    }

    private stripRedactedAndUnneeded = () => {
        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const allowedPlugCategoryIds = [
            dataSearchStringService.CategoryIDs.IntrinsicPlug,

            dataSearchStringService.CategoryIDs.BarrelsPlug,
            dataSearchStringService.CategoryIDs.BladesPlug,
            dataSearchStringService.CategoryIDs.BowstringsPlug,
            dataSearchStringService.CategoryIDs.HaftsPlug,
            dataSearchStringService.CategoryIDs.ScopesPlug,
            dataSearchStringService.CategoryIDs.TubesPlug,

            dataSearchStringService.CategoryIDs.ArrowsPlug,
            dataSearchStringService.CategoryIDs.BatteriesPlug,
            dataSearchStringService.CategoryIDs.GuardsPlug,
            dataSearchStringService.CategoryIDs.MagazinesPlug,
            dataSearchStringService.CategoryIDs.MagazinesGLPlug,

            dataSearchStringService.CategoryIDs.FramesPlug,
            dataSearchStringService.CategoryIDs.OriginsPlug,
            dataSearchStringService.CategoryIDs.TrackerPlug,
            dataSearchStringService.CategoryIDs.ExoticMasterworkPlug,
            dataSearchStringService.CategoryIDs.CatalystsPlug,
            dataSearchStringService.CategoryIDs.StocksPlug,

            dataSearchStringService.CategoryIDs.WeaponModDamage,
            dataSearchStringService.CategoryIDs.WeaponModGuns,
        ];
        const itemHashesToRemove: number[] = [];
        for (const key in this.manifest.DestinyInventoryItemDefinition) {
            const item = this.manifest.DestinyInventoryItemDefinition[key];
            
            const isWeapon = !!item.traitIds && item.traitIds.includes(dataSearchStringService.TraitIDs.Weapon)
                && !!item.screenshot // Some weapons don't have screenshots - probably for the crafting menu.
                && !!item.quality
                && !!item.quality.infusionCategoryHash; // Others don't have an infusion category, probably also crafting related.
            const isModOrPerk = item.plug && allowedPlugCategoryIds.includes(item.plug.plugCategoryIdentifier);
            const isMasterwork = item.plug && item.plug.plugCategoryIdentifier.includes(dataSearchStringService.CategoryIDs.WeaponMasterworkPlugComponent);

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
            if (item.traitIds.includes(dataSearchStringService.TraitIDs.Weapon) && !!item.screenshot) {
                weapons.push(item);
            }
        }
        // Sort the weapons newest to oldest (roughly).
        // TODO: find a better way to sort, or manually curate the order to show recent weapons.
        weapons.sort((a, b) => b.index - a.index);

        return weapons.map(this.getWeaponPerkInfo);
    }

    private getWeaponPerkInfo = (weaponItem: DestinyInventoryItemDefinition): IWeapon => {
        const weaponSocketCategories = weaponItem.sockets?.socketCategories || [];
        const weaponSockets = weaponItem.sockets?.socketEntries || [];

        // Get each socket category
        const intrinsicSocketCategory = weaponSocketCategories.find(c => this.isIntrinsicPerkSocketCategory(c.socketCategoryHash));
        const weaponPerkSocketCategory = weaponSocketCategories.find(c => this.isWeaponPerkSocketCategory(c.socketCategoryHash));
        const weaponModSocketCategory = weaponSocketCategories.find(c => {
            const socketCategory = this.getSocketCategoryDefinition(c.socketCategoryHash);
            return socketCategory && socketCategory.displayProperties.name === dataSearchStringService.CategoryNames.WeaponModsSocket;
        });

        // Get lists of sockets - perks first
        const intrinsicPerkSocket = intrinsicSocketCategory && intrinsicSocketCategory.socketIndexes.length > 0
            ? weaponSockets[intrinsicSocketCategory.socketIndexes[0]]
            : undefined;
        const weaponPerkSockets = weaponPerkSocketCategory ? weaponPerkSocketCategory.socketIndexes.map(i => weaponSockets[i]) : [];
        const perkSocketsNoTracker = weaponPerkSockets.filter(s => {
            const type = this.getSocketTypeDefinition(s.socketTypeHash);
            return type && !type.plugWhitelist.some(this.isTrackerPlugCategory);
        });

        // Then, MW + Mods
        const weaponModSockets = weaponModSocketCategory ? weaponModSocketCategory.socketIndexes.map(i => weaponSockets[i]) : [];
        const masterworkSocket = weaponModSockets.find(s => {
            const type = this.getSocketTypeDefinition(s.socketTypeHash);
            return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes(dataSearchStringService.CategoryIDs.WeaponMasterworkPlug));
        });
        const modSocket = weaponModSockets.find(s => {
            const type = this.getSocketTypeDefinition(s.socketTypeHash);
            return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes(dataSearchStringService.CategoryIDs.WeaponMod));
        });

        const intrinsic = this.getIntrinsicFromSockets(intrinsicPerkSocket);
        const perkOptions = this.getPerkOptionsFromSockets(perkSocketsNoTracker);
        const curated = this.getCuratedFromPerkSockets(perkSocketsNoTracker, perkOptions);
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

    private getIntrinsicFromSockets = (intrinsicSocket: DestinyItemSocketEntryDefinition | undefined) => {
        if (!intrinsicSocket) return undefined;
        const intrinsicPlugSet = intrinsicSocket && intrinsicSocket.reusablePlugSetHash
            ? this.getPlugSetDefinition(intrinsicSocket.reusablePlugSetHash)
            : undefined;

        const intrinsicPerk = intrinsicPlugSet && intrinsicPlugSet.reusablePlugItems.length > 0
            ? this.getItemDefinition(intrinsicPlugSet.reusablePlugItems[0].plugItemHash)
            : undefined;
        return intrinsicPerk;
    }

    private getPerkOptionsFromSockets = (perkSockets: DestinyItemSocketEntryDefinition[]) => {
        // Either one or the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const perkPlugSets = perkSockets.map(ps => this.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
        const perkSlotOptions = perkPlugSets.map(this.getPerkOptionsFromPlugSet);
        return perkSlotOptions;
    }

    private getPerkOptionsFromPlugSet = (plugSet: DestinyPlugSetDefinition | undefined) => {
        const currentlyCanRollMap: { [plugItemHash: number]: boolean } = {};
        const requiredCraftedLevelMap: { [plugItemHash: number]: number | undefined } = {};
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};
        const perksInSlot: DestinyInventoryItemDefinition[] = [];

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of plugSet?.reusablePlugItems || []) {
            if (seenPlugItems[plugItem.plugItemHash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[plugItem.plugItemHash] = plugItem.currentlyCanRoll;
            if (plugItem.craftingRequirements) {
                requiredCraftedLevelMap[plugItem.plugItemHash] = plugItem.craftingRequirements.requiredLevel;
            }

            const definition = this.getItemDefinition(plugItem.plugItemHash);
            if (!definition) continue;
            perksInSlot.push(definition);
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

    private getCuratedFromPerkSockets = (perkSockets: DestinyItemSocketEntryDefinition[], randomRollPerkOptions: IPerkSlotOptions[]) => {
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
                } else if (s.randomizedPlugSetHash) {
                    // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                    const plugSet = this.getPlugSetDefinition(s.randomizedPlugSetHash);
                    const itemHash = !!plugSet && plugSet.reusablePlugItems.length > 0 ? plugSet.reusablePlugItems[0].plugItemHash : undefined;
                    return perkSlotOptions.options.find(o => o.perk.hash === itemHash);
                }
            })
            .map(i => i!)
            // Checking for undefined here to have better defined behavior, but it really should never be undefined.
            .map<IPerkSlotOptions>(o => { return { options: o ? [o] : [] }; });
    }

    private getMasterworkOptionsFromSockets = (masterworkSocket: DestinyItemSocketEntryDefinition | undefined) => {
        if (!masterworkSocket) return [];
        return masterworkSocket.reusablePlugItems
            .map(pi => this.getItemDefinition(pi.plugItemHash))
            .filter(mw => !!mw)
            .map(i => i!);
    }

    private getModOptionsFromSockets = (modSocket: DestinyItemSocketEntryDefinition | undefined) => {
        if (!modSocket || !modSocket.reusablePlugSetHash) return [];

        // TODO: it seems like the adept mods are placed in the modSocket.reusablePlugItems property
        const plugSet = this.getPlugSetDefinition(modSocket.reusablePlugSetHash);
        if (!plugSet) return [];
        return plugSet!.reusablePlugItems
            .map(pi => this.getItemDefinition(pi.plugItemHash))
            // The only mod that has this plug category ID is the empty mod slot which is useless here.
            .filter(pi => pi && pi.plug && pi.plug.plugCategoryIdentifier !== dataSearchStringService.CategoryIDs.WeaponMod)
            .map(pi => pi!)
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

    private getSocketCategoryDefinition = (hash: number) => {
        return this.manifest.DestinySocketCategoryDefinition[hash];
    }

    private isIntrinsicPerkSocketCategory = (perkItemHash: number) => {
        return this.weaponIntrinsicCategory && this.weaponIntrinsicCategory.hash === perkItemHash;
    }

    private isWeaponPerkSocketCategory = (perkItemHash: number) => {
        return this.weaponPerkCategory && this.weaponPerkCategory.hash === perkItemHash;
    }

    private isTrackerPlugCategory = (plug: DestinyPlugWhitelistEntryDefinition) => {
        return plug.categoryIdentifier === dataSearchStringService.CategoryIDs.TrackerPlug;
    }

    public get damageTypes() { return hashMapToArray(this.manifest.DestinyDamageTypeDefinition); }
    public get damageTypeLookup() { return this.manifest.DestinyDamageTypeDefinition; }
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
