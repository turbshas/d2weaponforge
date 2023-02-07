import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { IDamageType } from "../interfaces";
import type { ManifestAccessor } from "./manifestAccessor";

export class DamageType implements IDamageType {
    public readonly hash: number | undefined;
    public readonly name: string;
    public readonly iconUrl: string;

    constructor(weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
        this.hash = weapon.defaultDamageTypeHash;
        const damageType = getDamageType(weapon, manifest);
        this.name = damageType ? damageType.displayProperties.name : "None";
        this.iconUrl = damageType ? damageType.displayProperties.icon : "";
    }
}

function getDamageType(weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    const damageTypeHash = weapon.defaultDamageTypeHash;
    if (!damageTypeHash) return undefined;
    return manifest.getDamageTypeDefinition(damageTypeHash);
}
