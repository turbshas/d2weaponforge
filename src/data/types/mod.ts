import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ItemPerkVisibility } from "../interfaces";
import { BasicPerk } from "./basicPerk";
import type { ManifestAccessor } from "./manifestAccessor";

function getModDescription(mod: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    const sandboxPerks = mod.perks
        .filter(p => p.perkVisibility === ItemPerkVisibility.Visible as number)
        .map(p => manifest.getSandboxPerkDefinition(p.perkHash))
        .filter(p => !!p);
    if (sandboxPerks.length === 0) return "";
    const sandboxPerk = sandboxPerks[0];
    return sandboxPerk ? sandboxPerk.displayProperties.description : "";
}

export class Mod extends BasicPerk {
    constructor(
        mod: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        ) {
        super(mod, manifest, mod.displayProperties.name, getModDescription(mod, manifest));
    }
}
