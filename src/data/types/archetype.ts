import type { DestinyInventoryItemDefinition, DestinyItemStatBlockDefinition } from "bungie-api-ts/destiny2";
import { DefaultWeaponMainStat, DefaultWeaponTypeRpmUnits, WeaponTraitIdMainStatMap, WeaponTypeRpmUnitsMap } from "../constants";
import { hashMapToArray } from "../util";
import type { ManifestAccessor } from "./manifestAccessor";

export class Archetype {
    public readonly name: string;
    public readonly description: string;
    public readonly iconUrl: string;

    public readonly rpmStatHash: number | undefined;
    public readonly rpmStatValue: number | undefined;
    public readonly rpmUnits: string;

    constructor(
        intrinsic: DestinyInventoryItemDefinition,
        weaponTypeTraitId: string,
        weaponStats: DestinyItemStatBlockDefinition | undefined,
        manifest: ManifestAccessor,
        ) {
        this.name = intrinsic.displayProperties.name;
        this.description = intrinsic.displayProperties.description;
        this.iconUrl = intrinsic.displayProperties.icon;

        const rpmStat = this.getArchetypeRpmStat(weaponTypeTraitId, weaponStats, manifest);
        this.rpmStatHash = rpmStat ? rpmStat.statHash : undefined;
        this.rpmStatValue = rpmStat && weaponStats && weaponStats.stats && weaponStats.stats[rpmStat.statHash]
            ? weaponStats.stats[rpmStat.statHash].value
            : undefined;
        this.rpmUnits = WeaponTypeRpmUnitsMap.value[weaponTypeTraitId] || DefaultWeaponTypeRpmUnits.value;
    }

    private getArchetypeRpmStat = (weaponTypeTraitId: string, weaponStats: DestinyItemStatBlockDefinition | undefined, manifest: ManifestAccessor) => {
        const searchStatName = WeaponTraitIdMainStatMap.value[weaponTypeTraitId] || DefaultWeaponMainStat.value;
        const statList = weaponStats ? hashMapToArray(weaponStats.stats) : [];
        const rpmStat = statList.find(s => {
            const statType = manifest.getStatTypeDefinition(s.statHash);
            return statType && statType.displayProperties.name === searchStatName;
        });
        return rpmStat;
    }
}
