import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition } from "bungie-api-ts/destiny2";
import { AllowedPlugCategoryIds, AllPerkPlugCategoryIds, ModPlugCategoryIds } from "./constants";
import { DataSearchStrings } from "./services/dataSearchStringService";
import { ItemTierIndex, type IMasterwork, type IMod, type IPerk, type IPerkLookup, type IPerkPair, type ItemHash, type IWeaponTypeInfo, type LookupMap, type UsedDestinyManifestSlice, type WeaponCategoryRegex } from "./interfaces";
import { ManifestAccessor } from "./types/manifestAccessor";
import { Weapon } from "./types/weapon";
import { arrayToExistenceMap, arrayToHashMap, hashMapToArray } from "./util";
import { Perk } from "./types/perk";
import { Masterwork } from "./types/masterwork";
import { Mod } from "./types/mod";

interface IGroupedItems {
    weapons: DestinyInventoryItemDefinition[];
    perks: DestinyInventoryItemDefinition[];
    masterworks: DestinyInventoryItemDefinition[];
    mods: DestinyInventoryItemDefinition[];
}

export class DestinyManifestProcessor {
    private readonly manifest: ManifestAccessor;
    private readonly _weapons: Weapon[];
    private readonly _weaponTypes: IWeaponTypeInfo[];
    private readonly _perkLookup: IPerkLookup;
    private readonly _masterworkLookup: LookupMap<ItemHash, IMasterwork>;
    private readonly _modLookup: LookupMap<ItemHash, IMod>;
    private readonly _itemCategories: DestinyItemCategoryDefinition[];

    constructor(manifestSlice: UsedDestinyManifestSlice) {
        this.manifest = new ManifestAccessor(manifestSlice);
        this.stripRedactedAndUnneeded();

        this._itemCategories = hashMapToArray(this.manifest.slice.DestinyItemCategoryDefinition);

        const groupedItems = this.groupItems();
        this._perkLookup = this.processPerks(groupedItems.perks);
        this._masterworkLookup = arrayToHashMap(this.processMasterworks(groupedItems.masterworks), "hash");
        this._modLookup = arrayToHashMap(this.processMods(groupedItems.mods), "hash");

        this._weapons = this.processWeapons(groupedItems.weapons, this.perkLookup, this.masterworkLookup, this.modLookup);
        this._weaponTypes = this.processArchetypes(this._weapons);
    }

    private readonly stripRedactedAndUnneeded = () => {
        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const itemHashesToRemove: number[] = [];
        for (const key in this.manifest.slice.DestinyInventoryItemDefinition) {
            const item = this.manifest.slice.DestinyInventoryItemDefinition[key];
            
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
            delete this.manifest.slice.DestinyInventoryItemDefinition[hash];
        }

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
    }

    private readonly groupItems = () => {
        const grouped: IGroupedItems = {
            weapons: [],
            perks: [],
            masterworks: [],
            mods: [],
        };

        const perkPlugCategoryIdMap = arrayToExistenceMap(AllPerkPlugCategoryIds.value);
        const modPlugCategoryIdMap = arrayToExistenceMap(ModPlugCategoryIds.value);

        for (const key in this.manifest.slice.DestinyInventoryItemDefinition) {
            const item = this.manifest.slice.DestinyInventoryItemDefinition[key];
            if (!item) continue;
            // If no name, probably not an item we care about.
            if (!item.displayProperties.name) continue;

            const isWeapon =
                // If no categories, probably not an item we care about.
                !!item.traitIds && item.traitIds.includes(DataSearchStrings.TraitIDs.Weapon)
                // Some weapons don't have screenshots (including some duplicates) - probably for the crafting menu.
                && !!item.screenshot
                // Others don't have an infusion category, probably also crafting related.
                && !!item.quality
                && (!!item.quality.infusionCategoryHash
                    || (!!item.quality.infusionCategoryHashes && item.quality.infusionCategoryHashes.length > 0));
            const isPerk = !!item.plug && perkPlugCategoryIdMap[item.plug.plugCategoryIdentifier];
            const isMod = !!item.plug && modPlugCategoryIdMap[item.plug.plugCategoryIdentifier];
            const isMasterwork = !!item.plug
                && item.plug.plugCategoryIdentifier.includes(DataSearchStrings.CategoryIDs.WeaponMasterworkPlugComponent);

            if (isWeapon) {
                grouped.weapons.push(item);
            } else if (isPerk) {
                grouped.perks.push(item);
            } else if (isMod) {
                grouped.mods.push(item);
            } else if (isMasterwork) {
                grouped.masterworks.push(item);
            }
        }

        return grouped;
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
            if (!perkItem.inventory) continue;
            const itemTier = this.manifest.getItemTierDefinition(perkItem.inventory.tierTypeHash);
            if (!itemTier) continue;

            const perk = new Perk(perkItem, this.manifest);
            if (itemTier.index === ItemTierIndex.Common) {
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
                perk: perk,
                enhanced: undefined,
            };
            if (perk.categoryId === DataSearchStrings.CategoryIDs.FramesPlug) {
                // Searching through the array could be slow, so only bother for perks that CAN be enhanced.
                perkPair.enhanced = enhancedPerkNameMap[perk.name] || enhancedPerks.find(e => e.name.includes(perk.name));
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

    private readonly processArchetypes = (weapons: Weapon[]) => {
        const activeWeapons = weapons.filter(w => !w.isSunset);

        const seenArchetypes: {
            [weaponCategoryRegex: string]: {
                [intrinsicName: string]: {
                    [rpm: number]: boolean,
                },
            },
        } = {};
        const weaponTypeInfoMap: LookupMap<WeaponCategoryRegex, IWeaponTypeInfo> = {};

        for (const weapon of activeWeapons) {
            if (!weapon.archetype || (weapon.tierTypeIndex !== ItemTierIndex.Legendary)) continue;
            
            // Exclude Drang/Mini-Tool unique intrinsics.
            const weaponNameLower = weapon.name.toLocaleLowerCase();
            if (weaponNameLower.includes(DataSearchStrings.Misc.DrangName.value.toLocaleLowerCase())
                || weaponNameLower.includes(DataSearchStrings.Misc.MidaMiniToolName.value.toLocaleLowerCase())) continue;

            const weaponTypeTraitId = weapon.traitId;
            const archetypeName = weapon.archetype.name;

            const weaponRpmStatHash = weapon.archetype.rpmStatHash;
            const stat = weapon.archetype.rpmStatValue;
            if (!weaponRpmStatHash || (!stat && stat !== 0)) continue;

            const category = this._itemCategories.find(c => c.itemTypeRegex === weapon.weaponCategoryRegex);
            if (!category) continue;

            if (!seenArchetypes[weapon.weaponCategoryRegex]) {
                seenArchetypes[weapon.weaponCategoryRegex] = {};

                weaponTypeInfoMap[weapon.weaponCategoryRegex] = {
                    weaponTypeName: category.displayProperties.name,
                    traitId: weaponTypeTraitId,
                    weaponCategoryRegex: weapon.weaponCategoryRegex,
                    weaponCategoryHash: category.hash,
                    // Hide RPM for bows and swords - bows are inconsistent and swords don't have one that makes sense.
                    showRpm: weaponTypeTraitId !== DataSearchStrings.TraitIDs.Bow && weaponTypeTraitId !== DataSearchStrings.TraitIDs.Sword,
                    // Sidearms have duplicate adaptive frames but differing RPM, so make sure to actually compare with RPM.
                    compareUsingRpm: weaponTypeTraitId === DataSearchStrings.TraitIDs.Sidearm,
                    rpmUnits: weapon.archetype.rpmUnits,
                    archetypes: [],
                };
            }
            if (!seenArchetypes[weapon.weaponCategoryRegex][archetypeName]) {
                seenArchetypes[weapon.weaponCategoryRegex][archetypeName] = {};
            }

            if (seenArchetypes[weapon.weaponCategoryRegex][archetypeName][stat]) continue;
            seenArchetypes[weapon.weaponCategoryRegex][archetypeName][stat] = true;

            weaponTypeInfoMap[weapon.weaponCategoryRegex]!.archetypes.push({
                weaponType: weaponTypeTraitId,
                name: archetypeName,
                rpm: stat,
                statHash: weaponRpmStatHash,
            });
        }
        console.log("found archetypes:", weaponTypeInfoMap, seenArchetypes);
        return hashMapToArray(weaponTypeInfoMap);
    }

    // Output values
    public get weapons() { return this._weapons; }
    public get weaponTypes() { return this._weaponTypes; }
    public get perkLookup() { return this._perkLookup; }
    public get masterworkLookup() { return this._masterworkLookup; }
    public get modLookup() { return this._modLookup; }

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
