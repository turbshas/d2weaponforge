import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugItemCraftingRequirements, DestinySocketTypeDefinition, DestinyStatDisplayDefinition } from "bungie-api-ts/destiny2";
import { ValidPerkPlugCategories } from "../constants";
import { DataSearchStrings } from "../services/dataSearchStringService";
import { ItemTierIndex, type ItemHash, type LookupMap } from "../interfaces";
import type { ManifestAccessor } from "./manifestAccessor";
import { Perk } from "./perk";
import { PerkColumn } from "./perkColumn";
import { PerkGrid } from "./perkGrid";
import { PerkOption } from "./perkOption";

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

export class ResolvedWeaponSockets {
    public readonly intrinsic: DestinyInventoryItemDefinition | undefined;
    public readonly perks: PerkGrid;
    public readonly curated: PerkGrid;
    public readonly masterworks: DestinyInventoryItemDefinition[];
    public readonly mods: DestinyInventoryItemDefinition[];
    public readonly adeptMods: DestinyInventoryItemDefinition[];

    constructor(
        weapon: DestinyInventoryItemDefinition,
        private readonly manifest: ManifestAccessor,
        ) {
        // TODO for perk lookup changes:
        //  - pass in perk, masterwork, mod lookups
        //  - instead of converting perks to IPerk, convert to hashes for normal/enhanced, wrap in IPerkOption with other props
        //  - try not passing on masterwork/mod hashes if possible? only if we don't need to query the info on them basically
        //  - convert mods and masterworks to hashes for later lookup
        const resolvedSocketItems = this.resolveWeaponSocketItems(weapon);
        this.intrinsic = this.getIntrinsicFromResolvedSockets(resolvedSocketItems);
        this.perks = this.getPerkOptionsFromResolvedSockets(resolvedSocketItems);
        this.curated = this.getCuratedFromResolvedSockets(resolvedSocketItems, this.perks);
        this.masterworks = this.getMasterworksFromResolvedSockets(resolvedSocketItems, weapon);

        this.adeptMods = this.getAdeptModsFromResolvedSockets(resolvedSocketItems);
        const allMods = this.getModsFromResolvedSockets(resolvedSocketItems);
        const adeptModsLookup: LookupMap<ItemHash, boolean> = {};
        for (const mod of this.adeptMods) {
            adeptModsLookup[mod.hash] = true;
        }
        this.mods = allMods.filter(m => !adeptModsLookup[m.hash]);
    }

    private resolveWeaponSocketItems = (weapon: DestinyInventoryItemDefinition) => {
        const weaponSockets = weapon.sockets?.socketEntries || [];

        const resolvedSocketItems = weaponSockets.map(s => {
            const socketType = this.manifest.getSocketTypeDefinition(s.socketTypeHash);
            const randomizedPlugSet = s.randomizedPlugSetHash ? this.manifest.getPlugSetDefinition(s.randomizedPlugSetHash) : undefined;
            const reusablePlugSet = s.reusablePlugSetHash ? this.manifest.getPlugSetDefinition(s.reusablePlugSetHash) : undefined;

            const socketReusableItems = s.reusablePlugItems
                .map(i => this.manifest.getItemDefinition(i.plugItemHash))
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

        return resolvedSocketItems;
    }

    private resolvePlugItems = (plugItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[]) => {
        const resolved: IResolvedPlugItem[] = [];
        for (const plugItem of plugItems) {
            const item = this.manifest.getItemDefinition(plugItem.plugItemHash);
            if (!item) continue;
            resolved.push({
                craftingRequirements: plugItem.craftingRequirements,
                currentlyCanRoll: plugItem.currentlyCanRoll,
                item: item
            });
        }
        return resolved;
    }

    private getIntrinsicFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[]) => {
        const intrinsicPerkSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => !!i.item.plug && i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.IntrinsicPlug);
        });
        if (!intrinsicPerkSocket) return undefined;
        const intrinsicPerk = intrinsicPerkSocket && intrinsicPerkSocket.reusableItems.length > 0
            ? intrinsicPerkSocket.reusableItems[0].item
            : undefined;
        return intrinsicPerk;
    }

    private getPerkOptionsFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[]) => {
        const weaponPerkSockets = resolvedSocketItems.filter(r => {
            return r.randomizedItems
                .concat(r.reusableItems)
                .some(i => !!i.item.plug && ValidPerkPlugCategories.value.includes(i.item.plug.plugCategoryIdentifier));
        });

        // Either one or the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const plugItems = weaponPerkSockets.map(plugSet => plugSet.randomizedItems.concat(plugSet.reusableItems));
        const perkColumns = plugItems.map(this.getPerkOptionsFromPlugSet);
        return new PerkGrid(perkColumns);
    }

    private getPerkOptionsFromPlugSet = (plugItems: IResolvedPlugItem[]) => {
        const currentlyCanRollMap: LookupMap<ItemHash, boolean> = {};
        const requiredCraftedLevelMap: LookupMap<ItemHash, number> = {};
        const seenPlugItems: LookupMap<ItemHash, boolean> = {};
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
            const itemTier = this.manifest.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Common;
        });
        const enhancedPerks = perksInSlot.filter(p => {
            if (!p.inventory) return false;
            const itemTier = this.manifest.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Uncommon;
        });

        const perkOptions: PerkOption[] = [];
        for (const perk of normalPerks) {
            const enhancedPerk = enhancedPerks.find(p => p.displayProperties.name.includes(perk.displayProperties.name));

            const craftedLevel = requiredCraftedLevelMap[perk.hash];
            const enhancedCraftedLevel = enhancedPerk ? requiredCraftedLevelMap[enhancedPerk.hash] : undefined;
            // Some perks have no base crafted level (can be crafted at level 0), but do have an enhanced crafted level
            const craftingInfo = craftedLevel || enhancedCraftedLevel ?
                    {
                        requiredLevel: craftedLevel,
                        requiredLevelEnhanced: enhancedCraftedLevel
                    }
                    : undefined;
            const perkOption = new PerkOption(
                new Perk(perk, this.manifest),
                enhancedPerk ? new Perk(enhancedPerk, this.manifest) : undefined,
                craftingInfo,
                !!currentlyCanRollMap[perk.hash],
                false);
            perkOptions.push(perkOption);
        }

        return new PerkColumn(perkOptions);
    }

    private getCuratedFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[], randomRollPerkOptions: PerkGrid) => {
        const weaponPerkSockets = resolvedSocketItems.filter(r => {
            return r.randomizedItems
                .concat(r.reusableItems)
                .some(i => !!i.item.plug && ValidPerkPlugCategories.value.includes(i.item.plug.plugCategoryIdentifier));
        });

        const curatedPerkColumns = weaponPerkSockets
            .map((s, index) => {
                const perkColumn = randomRollPerkOptions.perkColumns[index];
                if (s.singleInitialItemHash) {
                    const perkOption = perkColumn.perks.find(p => p.perk.hash === s.singleInitialItemHash);
                    // Sometimes, a curated perk is a perk that the weapon cannot normally roll. Construct a new
                    // perk option object in this case, as there's nothing to match up with anyway.
                    if (perkOption) return perkOption;
                    const perkItem = this.manifest.getItemDefinition(s.singleInitialItemHash);
                    if (!perkItem) return undefined;
                    return new PerkOption(
                        new Perk(perkItem, this.manifest),
                        undefined,
                        undefined,
                        true,
                        false
                    );
                } else {
                    // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                    const itemHash = !!s && s.randomizedItems.length > 0 ? s.randomizedItems[0].item.hash : undefined;
                    return perkColumn.perks.find(p => p.perk.hash === itemHash);
                }
            })
            // Checking for undefined here to have better defined behavior, but it really should never be undefined.
            .map(perkOption => new PerkColumn(perkOption ? [perkOption] : []));
        return new PerkGrid(curatedPerkColumns);
    }

    private getMasterworksFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[], weaponItem: DestinyInventoryItemDefinition) => {
        const masterworkSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => {
                return !!i.item.plug
                    && i.item.plug.plugCategoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponMasterworkPlugComponent);
            });
        });
        if (!masterworkSocket) return [];

        const masterworks = masterworkSocket.reusableItems.map(i => i.item);
        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash ? this.manifest.getStatGroupDefinition(weaponItem.stats.statGroupHash) : undefined;
        if (!statGroup) return masterworks;

        const scaledStatsLookup: LookupMap<ItemHash, DestinyStatDisplayDefinition> = {};
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

    private getModsFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[]) => {
        const modSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => {
                return !!i.item.plug
                    && (i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModDamage
                        || i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModGuns);
            });
        });
        if (!modSocket) return [];

        // TODO: it seems like the adept mods are placed in the modSocket.reusablePlugItems property
        return modSocket!.reusableItems
            .map(i => i.item)
            // The only mod that has this plug category ID is the empty mod slot which is useless here.
            .filter(i => i && i.plug && i.plug.plugCategoryIdentifier !== DataSearchStrings.CategoryIDs.WeaponModEmpty);
    }

    private getAdeptModsFromResolvedSockets = (resolvedSocketItems: IResolvedPlugSet[]) => {
        const modSocket = resolvedSocketItems.find(r => {
            return r.reusableItems.some(i => {
                return !!i.item.plug
                    && (i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModDamage
                        || i.item.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModGuns);
            });
        });
        if (!modSocket) return [];

        return modSocket.socketReusableItems
            .filter(i =>
                i.displayProperties.name.includes(DataSearchStrings.Misc.Adept.value)
                && i.plug
                && (i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModDamage
                    || i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModGuns
                    || i.plug.plugCategoryIdentifier === DataSearchStrings.CategoryIDs.WeaponModMagazine))
    }
}
