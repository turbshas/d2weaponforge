import type { DestinyItemStatBlockDefinition } from "bungie-api-ts/destiny2";
import type { IArchetype, ItemHash, TraitId } from "../interfaces";
import { DefaultWeaponMainStat, DefaultWeaponTypeRpmUnits, WeaponTraitIdMainStatMap, WeaponTypeRpmUnitsMap } from "../processingConstants";
import { hashMapToArray } from "../util";
import type { ManifestAccessor } from "./manifestAccessor";

export class Archetype implements IArchetype {
    public readonly rpmStatHash: number | undefined;
    public readonly rpmStatValue: number | undefined;
    public readonly rpmUnits: string;

    constructor(
        public readonly intrinsicPerkHash: ItemHash,
        weaponTypeTraitId: TraitId,
        weaponStats: DestinyItemStatBlockDefinition | undefined,
        manifest: ManifestAccessor,
        ) {

        const rpmStat = getArchetypeRpmStat(weaponTypeTraitId, weaponStats, manifest);
        this.rpmStatHash = rpmStat ? rpmStat.statHash : undefined;
        this.rpmStatValue = rpmStat && weaponStats && weaponStats.stats && weaponStats.stats[rpmStat.statHash]
            ? weaponStats.stats[rpmStat.statHash].value
            : undefined;
        this.rpmUnits = WeaponTypeRpmUnitsMap[weaponTypeTraitId] || DefaultWeaponTypeRpmUnits;
    }
}

function getArchetypeRpmStat(weaponTypeTraitId: TraitId, weaponStats: DestinyItemStatBlockDefinition | undefined, manifest: ManifestAccessor) {
    const searchStatIndex = WeaponTraitIdMainStatMap[weaponTypeTraitId] || DefaultWeaponMainStat;
    const statList = weaponStats ? hashMapToArray(weaponStats.stats) : [];
    const rpmStat = statList.find(s => {
        const statType = manifest.getStatTypeDefinition(s.statHash);
        return statType && statType.index === searchStatIndex;
    });
    return rpmStat;
}
