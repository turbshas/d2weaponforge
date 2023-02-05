import type { DestinyInventoryItemDefinition, DestinyItemStatBlockDefinition } from "bungie-api-ts/destiny2";
import { DefaultWeaponMainStat, DefaultWeaponTypeRpmUnits, WeaponTraitIdMainStatMap, WeaponTypeRpmUnitsMap } from "../constants";
import { hashMapToArray } from "../util";
import type { ManifestAccessor } from "./manifestAccessor";

export class Archetype {
    private readonly _name: string;
    private readonly _description: string;
    private readonly _iconUrl: string;

    private readonly _rpmStatHash: number | undefined;
    private readonly _rpmStatValue: number | undefined;
    private readonly _rpmUnits: string;

    constructor(
        intrinsic: DestinyInventoryItemDefinition,
        weaponTypeTraitId: string,
        weaponStats: DestinyItemStatBlockDefinition | undefined,
        manifest: ManifestAccessor,
        ) {
        this._name = intrinsic.displayProperties.name;
        this._description = intrinsic.displayProperties.description;
        this._iconUrl = intrinsic.displayProperties.icon;

        const rpmStat = this.getArchetypeRpmStat(weaponTypeTraitId, weaponStats, manifest);
        this._rpmStatHash = rpmStat ? rpmStat.statHash : undefined;
        this._rpmStatValue = rpmStat && weaponStats && weaponStats.stats && weaponStats.stats[rpmStat.statHash]
            ? weaponStats.stats[rpmStat.statHash].value
            : undefined;
        this._rpmUnits = WeaponTypeRpmUnitsMap.value[weaponTypeTraitId] || DefaultWeaponTypeRpmUnits.value;
    }

    public get name() { return this._name; }
    public get description() { return this._description; }
    public get iconUrl() { return this._iconUrl; }
    public get rpmStatHash() { return this._rpmStatHash; }
    public get rpmStatValue() { return this._rpmStatValue; }
    public get rpmUnits() { return this._rpmUnits; }

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
