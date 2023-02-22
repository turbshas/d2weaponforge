import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryDefinition, DestinyItemSocketEntryPlugItemDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinySocketTypeDefinition, DestinyStatDisplayDefinition } from "bungie-api-ts/destiny2";
import { ExcludedPerkPlugCategories } from "../constants";
import { WeaponSocketCategoryHash, type IMasterwork, type IMod, type IPerkGrid, type IPerkLookup, type IPerkOption, type IPerkPair, type ItemHash, type LookupMap } from "../interfaces";
import { DataSearchStrings } from "../services/dataSearchStringService";
import type { ManifestAccessor } from "./manifestAccessor";
import { PerkColumn } from "./perkColumn";
import { PerkGrid } from "./perkGrid";
import { PerkOption } from "./perkOption";

interface IResolvedPlugSet {
    socketType: DestinySocketTypeDefinition | undefined;
    singleInitialItemHash: number;
    /** reusablePlugItems on the socket itself rather than from the Plug Set. */
    socketReusableItems: DestinyItemSocketEntryPlugItemDefinition[];
    /** randomizedPlugSetHash -> Plug Set -> reusablePlugItems */
    randomizedItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[];
    /** reusablePlugSetHash -> Plug Set -> reusablePlugItems */
    reusableItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[];
}

interface IResolvedSockets {
    intrinsic: IResolvedPlugSet[];
    masterworks: IResolvedPlugSet[];
    mods: IResolvedPlugSet[];
    /** Includes only the main 4 + origin perk. */
    perks: IResolvedPlugSet[];
}

export class ResolvedWeaponSockets {
    public readonly intrinsic: ItemHash | undefined;
    public readonly perks: PerkGrid;
    public readonly curated: PerkGrid;
    public readonly masterworks: ItemHash[];
    public readonly mods: ItemHash[];
    public readonly adeptMods: ItemHash[];

    constructor(
        weapon: DestinyInventoryItemDefinition,
        private readonly manifest: ManifestAccessor,
        private readonly perkLookup: IPerkLookup,
        private readonly masterworkLookup: LookupMap<ItemHash, IMasterwork>,
        private readonly modLookup: LookupMap<ItemHash, IMod>,
        ) {
        const resolvedSockets = this.resolveWeaponSockets(weapon);
        this.intrinsic = this.getIntrinsicFromResolvedSockets(resolvedSockets.intrinsic);
        this.perks = this.getPerkOptionsFromResolvedSockets(resolvedSockets.perks);
        this.curated = this.getCuratedFromResolvedSockets(resolvedSockets.perks, this.perks);
        this.masterworks = this.getMasterworksFromResolvedSockets(resolvedSockets.masterworks, weapon);

        this.adeptMods = this.getAdeptModsFromResolvedSockets(resolvedSockets.mods);
        const allMods = this.getModsFromResolvedSockets(resolvedSockets.mods);
        const adeptModsLookup: LookupMap<ItemHash, boolean> = {};
        for (const mod of this.adeptMods) {
            adeptModsLookup[mod] = true;
        }
        this.mods = allMods.filter(m => !adeptModsLookup[m]);
    }

    private readonly resolveWeaponSockets = (weapon: DestinyInventoryItemDefinition) => {
        const weaponSocketCategories = weapon.sockets?.socketCategories || [];
        const weaponSockets = weapon.sockets?.socketEntries || [];

        const intrinsicSockets: DestinyItemSocketEntryDefinition[] = [];
        const modSockets: DestinyItemSocketEntryDefinition[] = [];
        const perkSockets: DestinyItemSocketEntryDefinition[] = [];

        for (const socketCategory of weaponSocketCategories) {
            const socketEntries = socketCategory.socketIndexes.map(i => weaponSockets[i]);
            if (socketCategory.socketCategoryHash === WeaponSocketCategoryHash.Intrinsic) {
                intrinsicSockets.push(...socketEntries);
            } else if (socketCategory.socketCategoryHash === WeaponSocketCategoryHash.Mods) {
                modSockets.push(...socketEntries);
            } else if (socketCategory.socketCategoryHash === WeaponSocketCategoryHash.Perks) {
                perkSockets.push(...socketEntries);
            }
        }

        const modsMasterworks = this.resolveWeaponSocketEntries(modSockets);
        const resolvedSockets: IResolvedSockets = {
            intrinsic: this.resolveWeaponSocketEntries(intrinsicSockets),
            masterworks: modsMasterworks.filter(s =>
                s.socketType
                && s.socketType.plugWhitelist.some(pw => pw.categoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponMasterworkPlug))),
            mods: modsMasterworks.filter(s =>
                s.socketType
                && s.socketType.plugWhitelist.some(pw =>
                    pw.categoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponModGuns)
                    || pw.categoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponModDamage)
                    || pw.categoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponModMagazine))),
            perks: this.resolveWeaponSocketEntries(perkSockets)
                .filter(s => s.socketType && s.socketType.plugWhitelist.every(pw => !ExcludedPerkPlugCategories.value.includes(pw.categoryIdentifier))),
        };

        return resolvedSockets;
    }

    private readonly resolveWeaponSocketEntries = (socketEntries: DestinyItemSocketEntryDefinition[]) => {
        return socketEntries.map(s => {
            const socketType = this.manifest.getSocketTypeDefinition(s.socketTypeHash);
            const randomizedPlugSet = s.randomizedPlugSetHash ? this.manifest.getPlugSetDefinition(s.randomizedPlugSetHash) : undefined;
            const reusablePlugSet = s.reusablePlugSetHash ? this.manifest.getPlugSetDefinition(s.reusablePlugSetHash) : undefined;

            const singleInitialItem = s.singleInitialItemHash;
            const randomizedPlugItems = randomizedPlugSet ? randomizedPlugSet.reusablePlugItems : [];
            const reusablePlugItems = reusablePlugSet ? reusablePlugSet.reusablePlugItems : [];

            const resolved: IResolvedPlugSet = {
                socketType: socketType,
                singleInitialItemHash: singleInitialItem,
                socketReusableItems: s.reusablePlugItems,
                randomizedItems: randomizedPlugItems,
                reusableItems: reusablePlugItems,
            };
            return resolved;
        });
    }

    private readonly getIntrinsicFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[]): ItemHash | undefined => {
        const intrinsicPerkSocket = resolvedSockets.find(s => !!s);
        if (!intrinsicPerkSocket) return undefined;
        const intrinsicPerk = intrinsicPerkSocket && intrinsicPerkSocket.reusableItems.length > 0
            ? intrinsicPerkSocket.reusableItems[0].plugItemHash
            : undefined;
        return intrinsicPerk;
    }

    private readonly getPerkOptionsFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[]) => {
        // Either one or the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const plugItems = resolvedSockets.map(plugSet => plugSet.randomizedItems.concat(plugSet.reusableItems));
        const perkColumns = plugItems.map(this.getPerkOptionsFromPlugSet);
        return new PerkGrid(perkColumns);
    }

    private readonly getPerkOptionsFromPlugSet = (plugItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[]) => {
        const currentlyCanRollMap: LookupMap<ItemHash, boolean> = {};
        const requiredCraftedLevelMap: LookupMap<ItemHash, number> = {};
        const seenPlugItems: LookupMap<ItemHash, boolean> = {};

        const perksInSlot: ItemHash[] = [];
        const perksInSlotMap: LookupMap<ItemHash, boolean> = {};

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of plugItems || []) {
            if (seenPlugItems[plugItem.plugItemHash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[plugItem.plugItemHash] = plugItem.currentlyCanRoll;
            if (plugItem.craftingRequirements) {
                requiredCraftedLevelMap[plugItem.plugItemHash] = plugItem.craftingRequirements.requiredLevel;
            }

            perksInSlot.push(plugItem.plugItemHash);
            perksInSlotMap[plugItem.plugItemHash] = true;
        }

        const perkOptions: IPerkOption[] = [];
        for (const perk of perksInSlot) {
            // Perk pair lookup is keyed by the normal perk hash.
            const perkPair = this.perkLookup.perkPairLookup[perk];
            // Unknown perk, ignore.
            if (!perkPair) continue;

            const thisWeaponHasEnhanced = !!perkPair.enhanced && !!perksInSlotMap[perkPair.enhanced];

            const craftedLevel = requiredCraftedLevelMap[perk];
            const enhancedCraftedLevel = perkPair.enhanced ? requiredCraftedLevelMap[perkPair.enhanced] : undefined;
            // Some perks have no base crafted level (can be crafted at level 0), but do have an enhanced crafted level
            const craftingInfo = craftedLevel || enhancedCraftedLevel ?
                    {
                        requiredLevel: craftedLevel,
                        requiredLevelEnhanced: enhancedCraftedLevel
                    }
                    : undefined;
            const perkOption = new PerkOption(
                perk,
                thisWeaponHasEnhanced ? perkPair.enhanced : undefined,
                craftingInfo,
                !!currentlyCanRollMap[perk],
                );
            perkOptions.push(perkOption);
        }

        return new PerkColumn(perkOptions);
    }

    private readonly getCuratedFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[], randomRollPerkOptions: IPerkGrid) => {
        const curatedPerkColumns = resolvedSockets
            .map((s, index) => {
                const perkColumn = randomRollPerkOptions.perkColumns[index];
                if (s.singleInitialItemHash) {
                    const perkOption = perkColumn.perks.find(p => p.perk === s.singleInitialItemHash);
                    // Sometimes, a curated perk is a perk that the weapon cannot normally roll. Construct a new
                    // perk option object in this case, as there's nothing to match up with anyway.
                    if (perkOption) return perkOption;
                    return new PerkOption(
                        s.singleInitialItemHash,
                        undefined,
                        undefined,
                        true, // Currently can roll = true is probably fine for curated? Would look weird greyed out or hidden.
                    );
                } else {
                    // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                    const itemHash = !!s && s.randomizedItems.length > 0 ? s.randomizedItems[0].plugItemHash : undefined;
                    return perkColumn.perks.find(p => p.perk === itemHash);
                }
            })
            // Checking for undefined here to have better defined behavior, but it really should never be undefined.
            .map(perkOption => new PerkColumn(perkOption ? [perkOption] : []));
        return new PerkGrid(curatedPerkColumns);
    }

    private readonly getMasterworksFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[], weaponItem: DestinyInventoryItemDefinition) => {
        const masterworkSocket = resolvedSockets.find(s => !!s);
        if (!masterworkSocket) return [];

        const masterworks: IMasterwork[] = [];
        for (const item of masterworkSocket.reusableItems) {
            const mw = this.masterworkLookup[item.plugItemHash];
            if (mw) {
                masterworks.push(mw);
            }
        }
        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash ? this.manifest.getStatGroupDefinition(weaponItem.stats.statGroupHash) : undefined;
        if (!statGroup) return masterworks.map(mw => mw.hash);

        const scaledStatsLookup: LookupMap<ItemHash, DestinyStatDisplayDefinition> = {};
        for (const stat of statGroup.scaledStats) {
            scaledStatsLookup[stat.statHash] = stat;
        }

        const isSword = weaponItem.traitIds.includes(DataSearchStrings.TraitIDs.Sword);
        return masterworks.filter(mw => {
            const mainStat = mw.mainBonuses.find(b => b.value > 0);
            const isValidStat = !!mainStat && !!scaledStatsLookup[mainStat.statHash];
            if (!isValidStat) return false;
            const isImpactMasterwork = mw.categoryId === DataSearchStrings.CategoryIDs.WeaponMasterworkImpact;
            // Impact only applies to swords.
            // Swords can only have impact.
            return (isImpactMasterwork && isSword) || (!isImpactMasterwork && !isSword);
        }).map(mw => mw.hash);
    }

    private readonly getModsFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[]) => {
        const modSocket = resolvedSockets.find(s => !!s);
        if (!modSocket) return [];

        // TODO: it seems like the adept mods are placed in the modSocket.reusablePlugItems property
        return modSocket!.reusableItems
            .map(i => i.plugItemHash)
            // The only mod that has this plug category ID is the empty mod slot which is useless here.
            .filter(h => {
                const mod = this.modLookup[h];
                return mod && mod.categoryId !== DataSearchStrings.CategoryIDs.WeaponModEmpty;
            });
    }

    private readonly getAdeptModsFromResolvedSockets = (resolvedSockets: IResolvedPlugSet[]) => {
        const modSocket = resolvedSockets.find(s => !!s);
        if (!modSocket) return [];

        return modSocket.socketReusableItems
            .filter(i => {
                const mod = this.modLookup[i.plugItemHash];
                return mod
                    && mod.name.includes(DataSearchStrings.Misc.Adept.value)
                    && (mod.categoryId === DataSearchStrings.CategoryIDs.WeaponModDamage
                        || mod.categoryId === DataSearchStrings.CategoryIDs.WeaponModGuns
                        || mod.categoryId === DataSearchStrings.CategoryIDs.WeaponModMagazine)
            }).map(i => i.plugItemHash);
    }
}
