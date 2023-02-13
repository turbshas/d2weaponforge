import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { BasicPerk } from "./basicPerk";
import type { ManifestAccessor } from "./manifestAccessor";

export class Perk extends BasicPerk {
    constructor(
        perk: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        ) {
        super(perk, perk.displayProperties.name, manifest);
    }
}
