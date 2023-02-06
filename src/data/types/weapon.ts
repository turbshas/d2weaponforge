import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition } from "bungie-api-ts/destiny2";
import { DataSearchStrings } from "../dataSearchStringService";
import { ItemTierIndex } from "../interfaces";
import { Archetype } from "./archetype";
import type { ManifestAccessor } from "./manifestAccessor";
import { Masterwork } from "./masterwork";
import { Mod } from "./mod";
import type { PerkGrid } from "./perkGrid";
import { ResolvedWeaponSockets } from "./resolvedWeaponSockets";
import { StatBlock } from "./statBlock";

export class Weapon {
    public readonly index: number;
    public readonly name: string;
    public readonly description: string;
    public readonly screenshotUrl: string;
    public readonly iconUrl: string;
    public readonly iconWatermarkUrl: string;
    public readonly isAdept: boolean;
    public readonly isSunset: boolean;
    public readonly tierTypeIndex: number;

    public readonly traitId: string;
    public readonly weaponCategoryHash: number;
    public readonly weaponCategoryName: string;
    public readonly weaponCategoryRegex: string;

    public readonly statBlock: StatBlock;
    public readonly archetype: Archetype | undefined;
    public readonly perks: PerkGrid;
    public readonly curated: PerkGrid;
    public readonly masterworks: Masterwork[];
    public readonly mods: Mod[];

    // TODO: is this possible?
    private readonly season: any = null;

    constructor(manifest: ManifestAccessor, weaponItem: DestinyInventoryItemDefinition, weaponCategory: DestinyItemCategoryDefinition) {
        this.index = weaponItem.index;
        this.name = weaponItem.displayProperties.name;
        this.description = weaponItem.displayProperties.description;
        this.screenshotUrl = weaponItem.screenshot;
        this.iconUrl = weaponItem.displayProperties.icon;
        this.iconWatermarkUrl = this.getWatermarkUrl(weaponItem);
        this.isAdept = this.isWeaponAdept(weaponItem);
        this.isSunset = this.isWeaponSunset(weaponItem);
        this.tierTypeIndex = this.getWeaponTierTypeIndex(weaponItem, manifest);

        this.traitId = this.getWeaponTraitId(weaponItem);
        this.weaponCategoryHash = weaponCategory.hash;
        this.weaponCategoryName = weaponCategory.displayProperties.name;
        this.weaponCategoryRegex = weaponCategory.itemTypeRegex;

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
        this.mods = resolvedWeaponSockets.mods.map(mod => new Mod(mod, manifest));
    }

    private getWatermarkUrl = (weapon: DestinyInventoryItemDefinition) => {
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

    private isWeaponAdept = (weapon: DestinyInventoryItemDefinition) => {
        const name = weapon.displayProperties.name;
        return name.includes(DataSearchStrings.Misc.Adept.value)
            || name.includes(DataSearchStrings.Misc.Harrowed.value)
            || name.includes(DataSearchStrings.Misc.Timelost.value);
    }

    private isWeaponSunset = (weapon: DestinyInventoryItemDefinition) => !!weapon.iconWatermarkShelved;
    private getWeaponTierTypeIndex = (weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) => {
        if (!weapon.inventory) return ItemTierIndex.Basic;
        const tierType = manifest.getItemTierDefinition(weapon.inventory.tierTypeHash);
        return tierType ? (tierType.index as ItemTierIndex) : ItemTierIndex.Basic;
    }
    // Archetype trait ID seems to always be last one in the list, hopefully that doesn't change.
    private getWeaponTraitId = (weapon: DestinyInventoryItemDefinition) => weapon.traitIds[weapon.traitIds.length - 1];
}
