import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ItemTierIndex, type IMasterwork, type IMod, type IPerkLookup, type ItemHash, type IWeapon, type LookupMap, TraitId } from "../interfaces";
import { DataSearchStrings } from "../services/dataSearchStringService";
import { Archetype } from "./archetype";
import { DamageType } from "./damageType";
import type { ManifestAccessor } from "./manifestAccessor";
import type { PerkGrid } from "./perkGrid";
import { ResolvedWeaponSockets } from "./resolvedWeaponSockets";
import { StatBlock } from "./statBlock";
import { WeaponCategoryHashFilterMap } from "../processingConstants";

export class Weapon implements IWeapon {
    public readonly index: number;
    public readonly hash: number;
    public readonly name: string;
    public readonly description: string;
    public readonly itemTypeDisplayName: string;
    public readonly screenshotUrl: string;
    public readonly iconUrl: string;
    public readonly iconWatermarkUrl: string;
    public readonly isAdept: boolean;
    public readonly isCraftable: boolean;
    public readonly isSunset: boolean;
    public readonly tierTypeIndex: number;

    public readonly categoryHash: ItemHash;
    public readonly traitId: TraitId;

    public readonly damageType: DamageType;
    public readonly statBlock: StatBlock;
    public readonly archetype: Archetype | undefined;
    public readonly perks: PerkGrid;
    public readonly curated: PerkGrid;
    public readonly masterworks: ItemHash[];
    public readonly mods: ItemHash[];
    public readonly catalysts: ItemHash[];

    // TODO: is this possible?
    public readonly seasonHash: number | undefined;

    constructor(
        weaponItem: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        perkLookup: IPerkLookup,
        masterworkLookup: LookupMap<ItemHash, IMasterwork>,
        modLookup: LookupMap<ItemHash, IMod>,
        ) {
        this.index = weaponItem.index;
        this.hash = weaponItem.hash;
        this.name = weaponItem.displayProperties.name;
        this.description = weaponItem.flavorText || weaponItem.displayProperties.description;
        this.itemTypeDisplayName = weaponItem.itemTypeDisplayName;
        this.screenshotUrl = weaponItem.screenshot;
        this.iconUrl = weaponItem.displayProperties.icon;
        this.iconWatermarkUrl = getWatermarkUrl(weaponItem);
        this.isAdept = isWeaponAdept(weaponItem);
        this.isSunset = isWeaponSunset(weaponItem);
        this.tierTypeIndex = getWeaponTierTypeIndex(weaponItem, manifest);

        this.categoryHash = getWeaponCategoryHash(weaponItem);
        this.traitId = getWeaponTraitId(weaponItem);

        this.damageType = new DamageType(weaponItem, manifest);
        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash
            ? manifest.getStatGroupDefinition(weaponItem.stats.statGroupHash)
            : undefined;
        this.statBlock = new StatBlock(statGroup, weaponItem.investmentStats, manifest);

        const resolvedWeaponSockets = new ResolvedWeaponSockets(weaponItem, manifest, perkLookup, masterworkLookup, modLookup);
        this.archetype = resolvedWeaponSockets.intrinsic
            ? new Archetype(resolvedWeaponSockets.intrinsic, this.traitId, weaponItem.stats, manifest)
            : undefined;
        this.perks = resolvedWeaponSockets.perks;
        this.curated = resolvedWeaponSockets.curated;

        this.masterworks = resolvedWeaponSockets.masterworks;

        const baseMods = resolvedWeaponSockets.mods;
        this.mods = this.isAdept
            ? baseMods.concat(resolvedWeaponSockets.adeptMods)
            : baseMods;

        this.catalysts = resolvedWeaponSockets.catalysts;

        this.seasonHash = weaponItem.seasonHash;
        this.isCraftable = this.perks.perkColumns.some(c => c.perks.some(p => !!p.enhancedPerk));
    }
}

// Functions can't be serialized to indexed DB, so don't have them as members of the class
function getWatermarkUrl(weapon: DestinyInventoryItemDefinition) {
    // Priority here: weapon.quality.displayVersionWatermarkIcons -> weapon.iconWatermarkShelved -> weapon.iconWatermark
    return weapon
        && (
            (
                weapon.quality
                && weapon.quality.displayVersionWatermarkIcons.length > 0
                && weapon.quality.displayVersionWatermarkIcons[weapon.quality.displayVersionWatermarkIcons.length - 1]
            )
            || weapon.iconWatermarkShelved
            || weapon.iconWatermark
        );
}

function isWeaponAdept(weapon: DestinyInventoryItemDefinition) {
    const name = weapon.displayProperties.name;
    return name.includes(DataSearchStrings.Misc.Adept.value)
        || name.includes(DataSearchStrings.Misc.Harrowed.value)
        || name.includes(DataSearchStrings.Misc.Timelost.value);
}

function isWeaponSunset(weapon: DestinyInventoryItemDefinition) {
    return !!weapon.iconWatermarkShelved
        && (!weapon.quality
            || weapon.quality.displayVersionWatermarkIcons.length === 0
            || weapon.quality.displayVersionWatermarkIcons[weapon.quality.displayVersionWatermarkIcons.length - 1] === weapon.iconWatermarkShelved);
}

function getWeaponTierTypeIndex(weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    if (!weapon.inventory) return ItemTierIndex.Basic;
    const tierType = manifest.getItemTierDefinition(weapon.inventory.tierTypeHash);
    return tierType ? (tierType.index as ItemTierIndex) : ItemTierIndex.Basic;
}

function getWeaponCategoryHash(weapon: DestinyInventoryItemDefinition) { return weapon.itemCategoryHashes?.find(h => WeaponCategoryHashFilterMap[h]) || 0; }

// Archetype trait ID seems to always be last one in the list, hopefully that doesn't change.
function getWeaponTraitId(weapon: DestinyInventoryItemDefinition) { return weapon.traitIds[weapon.traitIds.length - 1] as TraitId; }
