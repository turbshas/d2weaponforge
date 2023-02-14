import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { WeaponTypeTraitToRegex } from "../constants";
import { DataSearchStrings } from "../services/dataSearchStringService";
import { ItemTierIndex, type IWeapon } from "../interfaces";
import { Archetype } from "./archetype";
import { DamageType } from "./damageType";
import type { ManifestAccessor } from "./manifestAccessor";
import { Masterwork } from "./masterwork";
import { Mod } from "./mod";
import type { PerkGrid } from "./perkGrid";
import { ResolvedWeaponSockets } from "./resolvedWeaponSockets";
import { StatBlock } from "./statBlock";

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
    public readonly isSunset: boolean;
    public readonly tierTypeIndex: number;

    public readonly traitId: string;
    public readonly weaponCategoryRegex: string;

    public readonly damageType: DamageType;
    public readonly statBlock: StatBlock;
    public readonly archetype: Archetype | undefined;
    public readonly perks: PerkGrid;
    public readonly curated: PerkGrid;
    public readonly masterworks: Masterwork[];
    public readonly mods: Mod[];

    // TODO: is this possible?
    public readonly seasonHash: number | undefined;

    constructor(manifest: ManifestAccessor, weaponItem: DestinyInventoryItemDefinition) {
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

        this.traitId = getWeaponTraitId(weaponItem);
        this.weaponCategoryRegex = WeaponTypeTraitToRegex.value[this.traitId];

        this.damageType = new DamageType(weaponItem, manifest);
        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash
            ? manifest.getStatGroupDefinition(weaponItem.stats.statGroupHash)
            : undefined;
        this.statBlock = new StatBlock(statGroup, weaponItem.investmentStats, manifest);
        const resolvedWeaponSockets = new ResolvedWeaponSockets(weaponItem, manifest);
        this.archetype = resolvedWeaponSockets.intrinsic
            ? new Archetype(resolvedWeaponSockets.intrinsic, this.traitId, weaponItem.stats, manifest)
            : undefined;
        this.perks = resolvedWeaponSockets.perks;
        this.curated = resolvedWeaponSockets.curated;
        this.masterworks = resolvedWeaponSockets.masterworks.map(mw => new Masterwork(mw, statGroup, manifest));
        const baseMods = resolvedWeaponSockets.mods.map(mod => new Mod(mod, manifest));
        this.mods = this.isAdept
            ? baseMods.concat(resolvedWeaponSockets.adeptMods.map(mod => new Mod(mod, manifest)))
            : baseMods;

        // This is gross, but meh it seems to work.
        const isAutoTraitId = this.traitId === DataSearchStrings.TraitIDs.AutoRifle;
        const hasTraceRifleRpm = this.archetype && this.archetype.rpmStatValue && this.archetype.rpmStatValue >= 1000;
        if (isAutoTraitId && hasTraceRifleRpm) {
            this.weaponCategoryRegex = DataSearchStrings.WeaponCategoryRegex.TraceRifle;
        }

        this.seasonHash = weaponItem.seasonHash;
        if (this.name === "Blowout") {
            console.log("mods are", resolvedWeaponSockets.mods);
        }
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
                && weapon.quality.displayVersionWatermarkIcons[0]
                && weapon.quality.displayVersionWatermarkIcons[0]
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

function isWeaponSunset(weapon: DestinyInventoryItemDefinition) { return !!weapon.iconWatermarkShelved; }
function getWeaponTierTypeIndex(weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    if (!weapon.inventory) return ItemTierIndex.Basic;
    const tierType = manifest.getItemTierDefinition(weapon.inventory.tierTypeHash);
    return tierType ? (tierType.index as ItemTierIndex) : ItemTierIndex.Basic;
}
// Archetype trait ID seems to always be last one in the list, hopefully that doesn't change.
function getWeaponTraitId(weapon: DestinyInventoryItemDefinition) { return weapon.traitIds[weapon.traitIds.length - 1]; }
