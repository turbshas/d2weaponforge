import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition, DestinySandboxPerkDefinition } from "bungie-api-ts/destiny2";
import { ItemTierIndex, type ICatalyst, type IMasterwork, type IMod, type IPerk, type IPerkLookup, type IPerkPair, type ISandboxPerk, type ItemHash, type IWeaponTypeInfo, type LookupMap, type UsedDestinyManifestSlice, TraitId } from "./interfaces";
import { AllPerkPlugCategoryMap, ExcludedItemsMap, ModPlugCategoryMap, PlugCategoryId, Year1ExoticCatalystPlugCategoryMap } from "./processingConstants";
import { DataSearchStrings } from "./services/dataSearchStringService";
import { Catalyst } from "./types/catalyst";
import { ManifestAccessor } from "./types/manifestAccessor";
import { Masterwork } from "./types/masterwork";
import { Mod } from "./types/mod";
import { Perk } from "./types/perk";
import { SandboxPerk } from "./types/sandboxPerk";
import { Weapon } from "./types/weapon";
import { arrayToHashMap, hashMapToArray } from "./util";

interface IGroupedItems {
    weapons: DestinyInventoryItemDefinition[];
    perks: DestinyInventoryItemDefinition[];
    masterworks: DestinyInventoryItemDefinition[];
    mods: DestinyInventoryItemDefinition[];
    catalysts: DestinyInventoryItemDefinition[];
}

const enum ItemType {
    None,
    Weapon,
    Perk,
    Mod,
    Masterwork,
    Catalyst,
}

export class DestinyManifestProcessor {
    private readonly manifest: ManifestAccessor;
    private readonly _weapons: Weapon[];
    private readonly _weaponTypes: IWeaponTypeInfo[];
    private readonly _perkLookup: IPerkLookup;
    private readonly _masterworkLookup: LookupMap<ItemHash, IMasterwork>;
    private readonly _modLookup: LookupMap<ItemHash, IMod>;
    private readonly _catalystLookup: LookupMap<ItemHash, ICatalyst>;
    private readonly _sandboxPerkLookup: LookupMap<ItemHash, ISandboxPerk>;
    private readonly _itemCategories: DestinyItemCategoryDefinition[];

    constructor(manifestSlice: UsedDestinyManifestSlice) {
        this.manifest = new ManifestAccessor(manifestSlice);
        const groupedItems = this.stripUnneededAndGroup();

        this._itemCategories = hashMapToArray(this.manifest.slice.DestinyItemCategoryDefinition);

        this._perkLookup = this.processPerks(groupedItems.perks);
        this._masterworkLookup = arrayToHashMap(this.processMasterworks(groupedItems.masterworks), "hash");
        this._modLookup = arrayToHashMap(this.processMods(groupedItems.mods), "hash");
        this._catalystLookup = arrayToHashMap(this.processCatalysts(groupedItems.catalysts), "hash");
        this._sandboxPerkLookup = this.processSandboxPerks(manifestSlice.DestinySandboxPerkDefinition);

        this._weapons = this.processWeapons(groupedItems.weapons, this._perkLookup, this._masterworkLookup, this._modLookup);
        this._weaponTypes = this.processArchetypes(this._weapons, this._perkLookup);
    }

    private readonly stripUnneededAndGroup = () => {
        // Remove redacted values
        for (const key in this.manifest) {
            const table = key as keyof UsedDestinyManifestSlice;
            const component = this.manifest.slice[table];

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

        // Next, remove items we don't need and group them into useful categories.
        const grouped: IGroupedItems = {
            weapons: [],
            perks: [],
            masterworks: [],
            mods: [],
            catalysts: [],
        };

        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const itemHashesToRemove: ItemHash[] = [...ExcludedItemsMap];
        for (const key in this.manifest.slice.DestinyInventoryItemDefinition) {
            const item = this.manifest.slice.DestinyInventoryItemDefinition[key];
            const itemType = this.getItemType(item);
            switch (itemType) {
                case ItemType.Weapon: grouped.weapons.push(item); break;
                case ItemType.Perk: grouped.perks.push(item); break;
                case ItemType.Mod: grouped.mods.push(item); break;
                case ItemType.Masterwork: grouped.masterworks.push(item); break;
                case ItemType.Catalyst: grouped.catalysts.push(item); break;
                case ItemType.None: itemHashesToRemove.push(item.hash); break;
                default: throw `Unknown item type: ${itemType}.`;
            }
        }
        for (const hash of itemHashesToRemove) {
            delete this.manifest.slice.DestinyInventoryItemDefinition[hash];
        }

        return grouped;
    }

    private readonly getItemType = (item: DestinyInventoryItemDefinition) => {
        const isWeapon =
            // If no categories, probably not an item we care about.
            !!item.traitIds && item.traitIds.some(t => !!t && t.includes(TraitId.Weapon))
            // Some weapons don't have screenshots (including some duplicates) - probably for the crafting menu.
            && !!item.screenshot
            // Others don't have an infusion category, probably also crafting related.
            && !!item.quality
            && (!!item.quality.infusionCategoryHash
                || (!!item.quality.infusionCategoryHashes && item.quality.infusionCategoryHashes.length > 0));
        if (isWeapon) return ItemType.Weapon;

        const isCatalyst = (!!item.traitIds && item.traitIds.includes(TraitId.ExoticCatalyst))
            || (!!item.plug && !!Year1ExoticCatalystPlugCategoryMap[item.plug.plugCategoryIdentifier]);
        if (isCatalyst) return ItemType.Catalyst;

        if (!item.plug) return ItemType.None;

        const isPerk = !!AllPerkPlugCategoryMap[item.plug.plugCategoryIdentifier];
        if (isPerk) return ItemType.Perk;
        const isMod = !!ModPlugCategoryMap[item.plug.plugCategoryIdentifier];
        if (isMod) return ItemType.Mod;
        const isMasterwork = item.plug.plugCategoryIdentifier.includes(PlugCategoryId.WeaponMasterworkComponent);
        if (isMasterwork) return ItemType.Masterwork;

        return ItemType.None;
    }

    private readonly processWeapons = (
        weapons: DestinyInventoryItemDefinition[],
        perkLookup: IPerkLookup,
        masterworkLookup: LookupMap<ItemHash, IMasterwork>,
        modLookup: LookupMap<ItemHash, IMod>,
        ) => {
        // Sort the weapons newest to oldest (roughly).
        // TODO: find a better way to sort, or manually curate the order to show recent weapons.
        weapons.sort((a, b) => b.index - a.index);

        console.log("weapons", weapons);
        return weapons.map(w => new Weapon(w, this.manifest, perkLookup, masterworkLookup, modLookup));
    }

    private readonly processPerks = (perks: DestinyInventoryItemDefinition[]) => {
        const normalPerks: IPerk[] = [];
        const enhancedPerks: IPerk[] = [];
        const enhancedPerkNameMap: LookupMap<string, IPerk> = {};

        // Separate by normal/enhanced, add enhanced to lookup table by name for faster matching with normal perks.
        for (const perkItem of perks) {
            if (!perkItem.plug) continue;
            if (!perkItem.inventory) continue;
            const itemTier = this.manifest.getItemTierDefinition(perkItem.inventory.tierTypeHash);
            if (!itemTier) continue;

            const perk = new Perk(perkItem, this.manifest);
            const isIntrinsic = perkItem.plug.plugCategoryIdentifier === PlugCategoryId.Intrinsic;
            if (itemTier.index !== ItemTierIndex.Uncommon || isIntrinsic) {
                normalPerks.push(perk);
            } else if (itemTier.index === ItemTierIndex.Uncommon) {
                enhancedPerks.push(perk);
                enhancedPerkNameMap[perk.name] = perk;
            }
        }

        // Group normal + enhanced together.
        const perkPairs: IPerkPair[] = [];
        const perkPairMap: LookupMap<ItemHash, IPerkPair> = {};
        for (const perk of normalPerks) {
            const perkPair: IPerkPair = {
                perk: perk.hash,
                enhanced: undefined,
            };
            if (perk.categoryId === PlugCategoryId.Frames) {
                // Searching through the array could be slow, so only bother for perks that CAN be enhanced.
                const enhancedPerk = enhancedPerkNameMap[perk.name] || enhancedPerks.find(e => e.name.includes(perk.name));
                perkPair.enhanced = enhancedPerk?.hash;
            }
            perkPairs.push(perkPair);
            perkPairMap[perk.hash] = perkPair;
        }

        const perkLookup: IPerkLookup = {
            normal: arrayToHashMap(normalPerks, "hash"),
            enhanced: arrayToHashMap(enhancedPerks, "hash"),
            perkPairs: perkPairs,
            perkPairLookup: perkPairMap,
        };
        return perkLookup;
    }

    private readonly processMods = (mods: DestinyInventoryItemDefinition[]) => {
        return mods.map(m => new Mod(m, this.manifest));
    }

    private readonly processMasterworks = (masterworks: DestinyInventoryItemDefinition[]) => {
        // TODO: how to involve stat display override?
        return masterworks.map(mw => new Masterwork(mw, undefined, this.manifest));
    }

    private readonly processCatalysts = (catalysts: DestinyInventoryItemDefinition[]) => {
        return catalysts.map(c => new Catalyst(c, this.manifest));
    }

    private readonly processSandboxPerks = (sandboxPerkTable: { [hash: number]: DestinySandboxPerkDefinition }) => {
        const sandboxPerks: ISandboxPerk[] = [];
        for (const key in sandboxPerkTable) {
            const item = sandboxPerkTable[key];
            if (item.isDisplayable) {
                sandboxPerks.push(new SandboxPerk(item));
            }
        }
        return arrayToHashMap(sandboxPerks, "hash");
    }

    private readonly processArchetypes = (weapons: Weapon[], perkLookup: IPerkLookup) => {
        const activeWeapons = weapons.filter(w => !w.isSunset);

        type SeenRPMs = LookupMap<number, boolean>;
        type IntrinsicNameSeenRPMs = LookupMap<string, SeenRPMs>;
        type SeenArchetypes = LookupMap<TraitId, IntrinsicNameSeenRPMs>;
        const seenArchetypes: SeenArchetypes = {};
        const weaponTypeInfoMap: LookupMap<TraitId, IWeaponTypeInfo> = {};

        for (const weapon of activeWeapons) {
            if (!weapon.archetype || (weapon.tierTypeIndex !== ItemTierIndex.Legendary)) continue;
            
            const weaponTypeTraitId = weapon.traitId;
            const archetypePerk = perkLookup.normal[weapon.archetype.intrinsicPerkHash];
            if (!archetypePerk) continue;
            // Exclude Drang/Mini-Tool unique intrinsics.
            if (archetypePerk.hash === DataSearchStrings.Misc.DrangIntrinsicHash
                || archetypePerk.hash === DataSearchStrings.Misc.MidaMiniToolIntrinsicHash) continue;

            const archetypeName = archetypePerk.name;

            const weaponRpmStatHash = weapon.archetype.rpmStatHash;
            const stat = weapon.archetype.rpmStatValue;
            if (!weaponRpmStatHash || (!stat && stat !== 0)) continue;

            const category = this._itemCategories.find(c => c.traitId === weapon.traitId);
            if (!category) continue;

            const intrinsicNameSeenRPMs = seenArchetypes[weapon.traitId] || {};
            if (!seenArchetypes[weapon.traitId]) {
                seenArchetypes[weapon.traitId] = intrinsicNameSeenRPMs;

                weaponTypeInfoMap[weapon.traitId] = {
                    weaponTypeName: category.displayProperties.name,
                    traitId: weaponTypeTraitId,
                    weaponCategoryHash: category.hash,
                    // Hide RPM for bows and swords - bows are inconsistent and swords don't have one that makes sense.
                    showRpm: weaponTypeTraitId !== TraitId.Bow && weaponTypeTraitId !== TraitId.Sword,
                    // Sidearms have duplicate adaptive frames but differing RPM, so make sure to actually compare with RPM.
                    compareUsingRpm: weaponTypeTraitId === TraitId.Sidearm,
                    rpmUnits: weapon.archetype.rpmUnits,
                    archetypes: [],
                };
            }
            const seenRPMs = intrinsicNameSeenRPMs[archetypeName] || {};
            if (!intrinsicNameSeenRPMs[archetypeName]) {
                intrinsicNameSeenRPMs[archetypeName] = seenRPMs;
            }

            if (seenRPMs[stat]) continue;
            seenRPMs[stat] = true;

            weaponTypeInfoMap[weapon.traitId]!.archetypes.push({
                weaponType: weaponTypeTraitId,
                hash: archetypePerk.hash,
                name: archetypeName,
                rpm: stat,
                statHash: weaponRpmStatHash,
            });
        }
        return hashMapToArray(weaponTypeInfoMap);
    }

    // Output values
    public get weapons() { return this._weapons; }
    public get weaponTypes() { return this._weaponTypes; }
    public get perkLookup() { return this._perkLookup; }
    public get masterworkLookup() { return this._masterworkLookup; }
    public get modLookup() { return this._modLookup; }
    public get catalystLookup() { return this._catalystLookup; }
    public get sandboxPerkLookup() { return this._sandboxPerkLookup; }

    public get damageTypes() { return hashMapToArray(this.manifest.slice.DestinyDamageTypeDefinition); }
    public get damageTypeLookup() { return this.manifest.slice.DestinyDamageTypeDefinition; }
    public get itemCategories() { return this._itemCategories; }
    public get itemCategoriesLookup() { return this.manifest.slice.DestinyItemCategoryDefinition; }
    public get itemTierTypes() { return hashMapToArray(this.manifest.slice.DestinyItemTierTypeDefinition); }
    public get itemTierTypesLookup() { return this.manifest.slice.DestinyItemTierTypeDefinition; }
    public get seasons() {
        const list = hashMapToArray(this.manifest.slice.DestinySeasonDefinition);
        list.sort((a, b) => b.seasonNumber - a.seasonNumber);
        return list;
    }
    public get seasonsLookup() { return this.manifest.slice.DestinySeasonDefinition; }

    public get statsLookup() { return this.manifest.slice.DestinyStatDefinition; }
    public get statGroupsLookup() { return this.manifest.slice.DestinyStatGroupDefinition; }
    public get itemLookup() { return this.manifest.slice.DestinyInventoryItemDefinition; }
    public get plugSetLookup() { return this.manifest.slice.DestinyPlugSetDefinition; }
    public get socketCategoryLookup() { return this.manifest.slice.DestinySocketCategoryDefinition; }
    public get socketTypeLookup() { return this.manifest.slice.DestinySocketTypeDefinition; }
}
