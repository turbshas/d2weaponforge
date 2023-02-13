import type { DestinyInventoryItemDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import { BasicPerk } from "./basicPerk";
import type { ManifestAccessor } from "./manifestAccessor";

function getMasterworkStatName(
    masterwork: DestinyInventoryItemDefinition,
    weaponStatGroup: DestinyStatGroupDefinition | undefined,
    manifest: ManifestAccessor,
    ) {
    const increasedStat = masterwork.investmentStats.find(stat => stat.value > 0);
    if (!increasedStat) return "";
    const overrideDisplay = weaponStatGroup && weaponStatGroup.overrides && (weaponStatGroup.overrides[increasedStat.statTypeHash]?.displayProperties);
    if (overrideDisplay) return overrideDisplay.name;
    const statDefinition = manifest.getStatTypeDefinition(increasedStat.statTypeHash);
    if (!statDefinition) return "";
    return statDefinition.displayProperties.name;
}

export class Masterwork extends BasicPerk {
    constructor(
        masterwork: DestinyInventoryItemDefinition,
        weaponStatGroup: DestinyStatGroupDefinition | undefined,
        manifest: ManifestAccessor,
        ) {
        super(masterwork, getMasterworkStatName(masterwork, weaponStatGroup, manifest), manifest);
    }
}
