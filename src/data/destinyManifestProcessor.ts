import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition } from "bungie-api-ts/destiny2";
import { AllowedPlugCategoryIds } from "./constants";
import { DataSearchStrings } from "./dataSearchStringService";
import { ItemTierIndex, type IWeaponTypeInfo, type UsedDestinyManifestSlice } from "./interfaces";
import { ManifestAccessor } from "./types/manifestAccessor";
import { Weapon } from "./types/weapon";
import { hashMapToArray } from "./util";

export class DestinyManifestProcessor {
    private readonly manifest: ManifestAccessor;
    private readonly _weapons: Weapon[];
    private readonly _weaponTypes: IWeaponTypeInfo[];
    private readonly _itemCategories: DestinyItemCategoryDefinition[];

    constructor(manifestSlice: UsedDestinyManifestSlice) {
        this.manifest = new ManifestAccessor(manifestSlice);
        this.stripRedactedAndUnneeded();

        this._itemCategories = hashMapToArray(this.manifest.slice.DestinyItemCategoryDefinition);
        this._weapons = this.processWeapons();
        this._weaponTypes = this.processArchetypes(this._weapons);
    }

    private stripRedactedAndUnneeded = () => {
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

    private processWeapons = () => {
        const weapons: DestinyInventoryItemDefinition[] = [];

        for (const key in this.manifest.slice.DestinyInventoryItemDefinition) {
            const item = this.manifest.slice.DestinyInventoryItemDefinition[key];
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

        // return weapons.map(this.getWeaponPerkInfo);
        return weapons.map(w => new Weapon(this.manifest, w));
    }

    private processArchetypes = (weapons: Weapon[]) => {
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

            weaponTypeInfoMap[weapon.weaponCategoryRegex].archetypes.push({
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
