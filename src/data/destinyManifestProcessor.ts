import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyItemTierTypeDefinition, DestinyPlugItemCraftingRequirements, DestinyPlugSetDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatDisplayDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import { AllowedPlugCategoryIds, DefaultWeaponMainStat, ValidPerkPlugCategories, WeaponTraitIdMainStatMap, WeaponTypeRpmUnitsMap, WeaponTypeTraitToRegex } from "./constants";
import { DataSearchStrings } from "./dataSearchStringService";
import { ItemTierIndex, type IPerkOption, type IPerkSlotOptions, type IWeapon, type IWeaponTypeInfo, type UsedDestinyManifestSlice } from "./interfaces";
import { hashMapToArray } from "./util";

interface IResolvedPlugItem {
    craftingRequirements: DestinyPlugItemCraftingRequirements;
    currentlyCanRoll: boolean;
    item: DestinyInventoryItemDefinition;
}

interface IResolvedPlugSet {
    socketType: DestinySocketTypeDefinition | undefined;
    singleInitialItemHash: number;
    /** reusablePlugItems on the socket itself rather than from the Plug Set. */
    socketReusableItems: DestinyInventoryItemDefinition[];
    /** randomizedPlugSetHash -> Plug Set -> reusablePlugItems */
    randomizedItems: IResolvedPlugItem[];
    /** reusablePlugSetHash -> Plug Set -> reusablePlugItems */
    reusableItems: IResolvedPlugItem[];
}

export class DestinyManifestProcessor {
    private readonly _weapons: IWeapon[];
    private readonly _weaponTypes: IWeaponTypeInfo[];
    private readonly _itemCategories: DestinyItemCategoryDefinition[];

    constructor(private readonly manifest: UsedDestinyManifestSlice) {
        this.stripRedactedAndUnneeded();

        this._itemCategories = hashMapToArray(this.manifest.DestinyItemCategoryDefinition);
        this._weapons = this.processWeapons();
        this._weaponTypes = this.processArchetypes(this._weapons);
    }

    private stripRedactedAndUnneeded = () => {
        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const itemHashesToRemove: number[] = [];
        for (const key in this.manifest.DestinyInventoryItemDefinition) {
            const item = this.manifest.DestinyInventoryItemDefinition[key];
            
            const isWeapon = !!item.traitIds && item.traitIds.includes(DataSearchStrings.TraitIDs.Weapon)
                && !!item.screenshot // Some weapons don't have screenshots - probably for the crafting menu.
                && !!item.quality
                && !!item.quality.infusionCategoryHash; // Others don't have an infusion category, probably also crafting related.
            const isModOrPerk = item.plug && AllowedPlugCategoryIds.value.includes(item.plug.plugCategoryIdentifier);
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

    private processWeapons = () => {
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

        const resolvedSocketItems = weaponSockets.map(s => {
            const socketType = this.getSocketTypeDefinition(s.socketTypeHash);
            const randomizedPlugSet = s.randomizedPlugSetHash ? this.getPlugSetDefinition(s.randomizedPlugSetHash) : undefined;
            const reusablePlugSet = s.reusablePlugSetHash ? this.getPlugSetDefinition(s.reusablePlugSetHash) : undefined;

            const socketReusableItems = s.reusablePlugItems
                .map(i => this.getItemDefinition(i.plugItemHash))
                .filter(i => !!i)
                .map(i => i!);
            const singleInitialItem = s.singleInitialItemHash;
            const randomizedPlugItems = randomizedPlugSet ? randomizedPlugSet.reusablePlugItems : [];
            const reusablePlugItems = reusablePlugSet ? reusablePlugSet.reusablePlugItems : [];

            const resolved: IResolvedPlugSet = {
                socketType: socketType,
                singleInitialItemHash: singleInitialItem,
                socketReusableItems: socketReusableItems,
                randomizedItems: this.resolvePlugItems(randomizedPlugItems),
                reusableItems: this.resolvePlugItems(reusablePlugItems),
            };
            return resolved;
        });

        // Get lists of sockets - perks first
        const intrinsicPerkSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => !!i.item.plug && i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.IntrinsicPlug);
        });
        const weaponPerkSockets = resolvedSocketItems.filter(r => {
            return r.randomizedItems
                .concat(r.reusableItems)
                .some(i => !!i.item.plug && ValidPerkPlugCategories.value.includes(i.item.plug.plugCategoryIdentifier));
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
        const masterworks = this.getMasterworkOptionsFromSockets(masterworkSocket, weaponItem);
        const allMods = this.getModOptionsFromSockets(modSocket);
        
        const isAdept = this.isWeaponAdept(weaponItem);
        let mods: DestinyInventoryItemDefinition[];
        if (!isAdept) {
            const adeptMods = this.getAdeptModOptionsFromSockets(modSocket);

            const adeptModsLookup: { [hash: number]: boolean } = {};
            for (const mod of adeptMods) {
                adeptModsLookup[mod.hash] = true;
            }
            mods = allMods.filter(m => !adeptModsLookup[m.hash]);
        } else {
            mods = allMods;
        }

        return {
            weapon: weaponItem,
            isAdept: isAdept,
            isSunset: !!weaponItem.iconWatermarkShelved,
            intrinsic: intrinsic,
            perks: perkOptions,
            curated: curated,
            masterworks: masterworks,
            mods: mods,
        };
    }

    private resolvePlugItems = (plugItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[]): IResolvedPlugItem[] => {
        const resolved: IResolvedPlugItem[] = [];
        for (const plugItem of plugItems) {
            const item = this.getItemDefinition(plugItem.plugItemHash);
            if (!item) continue;
            resolved.push({
                craftingRequirements: plugItem.craftingRequirements,
                currentlyCanRoll: plugItem.currentlyCanRoll,
                item: item
            });
        }
        return resolved;
    }

    private isWeaponAdept = (weapon: DestinyInventoryItemDefinition) => {
        const name = weapon.displayProperties.name;
        return name.includes(DataSearchStrings.Misc.Adept.value)
            || name.includes(DataSearchStrings.Misc.Harrowed.value)
            || name.includes(DataSearchStrings.Misc.Timelost.value);
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

    private getMasterworkOptionsFromSockets = (masterworkSocket: IResolvedPlugSet | undefined, weaponItem: DestinyInventoryItemDefinition) => {
        if (!masterworkSocket) return [];
        const masterworks = masterworkSocket.reusableItems.map(i => i.item);
        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash ? this.getStatGroupDefinition(weaponItem.stats.statGroupHash) : undefined;
        if (!statGroup) return masterworks;

        const scaledStatsLookup: { [statHash: number]: DestinyStatDisplayDefinition } = {};
        for (const stat of statGroup.scaledStats) {
            scaledStatsLookup[stat.statHash] = stat;
        }

        const isSword = weaponItem.traitIds.includes(DataSearchStrings.TraitIDs.Sword);
        return masterworks.filter(i => {
            const mainStat = i.investmentStats.find(s => !s.isConditionallyActive && s.value > 0);
            const isValidStat = !!mainStat && !!scaledStatsLookup[mainStat.statTypeHash];
            if (!isValidStat) return false;
            const isImpactMasterwork = !!i.plug && i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponMasterworkImpact;
            // Impact only applies to swords.
            // Swords can only have impact.
            return (isImpactMasterwork && isSword) || (!isImpactMasterwork && !isSword);
        });
    }

    private getModOptionsFromSockets = (modSocket: IResolvedPlugSet | undefined) => {
        if (!modSocket) return [];
        // TODO: it seems like the adept mods are placed in the modSocket.reusablePlugItems property
        return modSocket!.reusableItems
            .map(i => i.item)
            // The only mod that has this plug category ID is the empty mod slot which is useless here.
            .filter(i => i && i.plug && i.plug.plugCategoryIdentifier !== DataSearchStrings.CategoryIDs.WeaponModEmpty);
    }

    private getAdeptModOptionsFromSockets = (modSocket: IResolvedPlugSet | undefined) => {
        if (!modSocket) return [];
        return modSocket.socketReusableItems
            .filter(i =>
                i.displayProperties.name.includes(DataSearchStrings.Misc.Adept.value)
                && i.plug
                && (i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModDamage
                    || i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModGuns
                    || i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModMagazine))
    }

    private processArchetypes = (weapons: IWeapon[]) => {
        const activeWeapons = weapons.filter(w => !w.isSunset);

        const seenArchetypes: {
            [weaponCategoryRegex: string]: {
                [intrinsicName: string]: {
                    [rpm: number]: boolean,
                },
            },
        } = {};
        const weaponTypeInfoMap: { [weaponType: string]: IWeaponTypeInfo } = {};

        for (const weapon of activeWeapons) {
            if (!weapon.intrinsic || !weapon.weapon.inventory || !weapon.weapon.stats || !weapon.weapon.stats.stats) continue;
            const tierType = this.getItemTierDefinition(weapon.weapon.inventory.tierTypeHash);
            if (!tierType || tierType.index !== ItemTierIndex.Legendary) continue;
            
            // Exclude Drang/Mini-Tool unique intrinsics.
            const weaponNameLower = weapon.weapon.displayProperties.name.toLocaleLowerCase();
            if (weaponNameLower.includes(DataSearchStrings.Misc.DrangName.value.toLocaleLowerCase())
                || weaponNameLower.includes(DataSearchStrings.Misc.MidaMiniToolName.value.toLocaleLowerCase())) continue;

            // The important trait seems to consistently be the last one in the list so I'm leaving this
            const weaponType = weapon.weapon.traitIds[weapon.weapon.traitIds.length - 1];
            const archetypeName = weapon.intrinsic.displayProperties.name;

            const searchStatName = WeaponTraitIdMainStatMap.value[weaponType] || DefaultWeaponMainStat.value;
            const rpmStat = weapon.weapon.investmentStats.find(s => {
                const statType = this.getStatTypeDefinition(s.statTypeHash);
                return statType && statType.displayProperties.name === searchStatName;
            });
            if (!rpmStat) continue;
            const stat = weapon.weapon.stats.stats[rpmStat.statTypeHash];

            // This is gross, but meh it seems to work.
            const isTraceRifleType = weaponType === DataSearchStrings.TraitIDs.AutoRifle && stat.value >= 1000;
            const categoryRegex = isTraceRifleType ? DataSearchStrings.WeaponCategoryRegex.TraceRifle : WeaponTypeTraitToRegex.value[weaponType];
            const category = this._itemCategories.find(c => c.itemTypeRegex === categoryRegex);
            if (!category) continue;

            if (!seenArchetypes[categoryRegex]) {
                seenArchetypes[categoryRegex] = {};

                weaponTypeInfoMap[categoryRegex] = {
                    weaponTypeName: category.displayProperties.name,
                    traitId: weaponType,
                    weaponCategoryRegex: categoryRegex,
                    weaponCategoryHash: category.hash,
                    // Hide RPM for bows and swords - bows are inconsistent and swords don't have one that makes sense.
                    showRpm: weaponType !== DataSearchStrings.TraitIDs.Bow && weaponType !== DataSearchStrings.TraitIDs.Sword,
                    // Sidearms have duplicate adaptive frames but differing RPM, so make sure to actually compare with RPM.
                    compareUsingRpm: weaponType === DataSearchStrings.TraitIDs.Sidearm,
                    rpmUnits: WeaponTypeRpmUnitsMap.value[weaponType] || "RPM",
                    archetypes: [],
                };
            }
            if (!seenArchetypes[categoryRegex][archetypeName]) {
                seenArchetypes[categoryRegex][archetypeName] = {};
            }

            if (seenArchetypes[categoryRegex][archetypeName][stat.value]) continue;
            seenArchetypes[categoryRegex][archetypeName][stat.value] = true;

            weaponTypeInfoMap[categoryRegex].archetypes.push({
                weaponType: weaponType,
                name: archetypeName,
                rpm: stat.value,
                statHash: rpmStat.statTypeHash,
            });
        }
        console.log("found archetypes:", weaponTypeInfoMap, seenArchetypes);
        return hashMapToArray(weaponTypeInfoMap);
    }

    // Wrappers for typing reasons (explicitly requiring return values are checked for undefined)
    private getItemDefinition = (hash: number): DestinyInventoryItemDefinition | undefined => {
        return this.manifest.DestinyInventoryItemDefinition[hash];
    }

    private getItemTierDefinition = (hash: number): DestinyItemTierTypeDefinition | undefined => {
        return this.manifest.DestinyItemTierTypeDefinition[hash];
    }

    private getPlugSetDefinition = (hash: number): DestinyPlugSetDefinition | undefined => {
        return this.manifest.DestinyPlugSetDefinition[hash];
    }

    private getSocketTypeDefinition = (hash: number): DestinySocketTypeDefinition | undefined => {
        return this.manifest.DestinySocketTypeDefinition[hash];
    }

    private getStatTypeDefinition = (hash: number): DestinyStatDefinition | undefined => {
        return this.manifest.DestinyStatDefinition[hash];
    }

    private getStatGroupDefinition = (hash: number): DestinyStatGroupDefinition | undefined => {
        return this.manifest.DestinyStatGroupDefinition[hash];
    }

    // Output values
    public get weapons() { return this._weapons; }
    public get weaponTypes() { return this._weaponTypes; }

    public get damageTypes() { return hashMapToArray(this.manifest.DestinyDamageTypeDefinition); }
    public get damageTypeLookup() { return this.manifest.DestinyDamageTypeDefinition; }
    public get itemCategories() { return this._itemCategories; }
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
