import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { BasicPerk } from "./basicPerk";
import type { ManifestAccessor } from "./manifestAccessor";

export class Mod extends BasicPerk {
    constructor(
        mod: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        ) {
        super(mod, mod.displayProperties.name, manifest);
    }
}
