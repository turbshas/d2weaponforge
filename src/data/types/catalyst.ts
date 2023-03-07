import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { ICatalyst, ICatalystUnlockRequirement, ItemHash } from "../interfaces";
import { BasicPerk } from "./basicPerk";
import type { ManifestAccessor } from "./manifestAccessor";

function getSandboxPerks(catalyst: DestinyInventoryItemDefinition) {
    if (!catalyst || !catalyst.perks) return [];
    const sandboxPerks = catalyst.perks
        // This *should be* correct, but some catalysts (that are in game) seem to have their visibility set to Disabled or Hidden...
        // .filter(p => p.perkVisibility === ItemPerkVisibility.Visible as number)
        .map(p => p.perkHash)
    return sandboxPerks;
}

function getUnlockRequirements(catalyst: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    if (!catalyst || !catalyst.objectives) return [];
    const requirements: ICatalystUnlockRequirement[] = [];
    for (const objectiveHash of catalyst.objectives.objectiveHashes) {
        const objective = manifest.getObjectiveDefinition(objectiveHash);
        if (objective) {
            requirements.push({
                description: objective.progressDescription,
                completionValue: objective.completionValue,
            });
        }
    }
    return requirements;
}

export class Catalyst extends BasicPerk implements ICatalyst {
    public readonly sandboxPerks: ItemHash[];
    public readonly unlockRequirements: ICatalystUnlockRequirement[];
    constructor(
        catalyst: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        ) {
        // Description should come from sandbox perk if available -> catalyst upgrade item (year 1 catalysts)
        // Name should come from sandbox perk if available -> catalyst upgrade item (year 1 catalysts)
        // Same for icon
        // Same for stat boosts (range/stability/etc.)
        super(catalyst, manifest, catalyst.displayProperties.name, catalyst.displayProperties.description);
        this.sandboxPerks = getSandboxPerks(catalyst);
        this.unlockRequirements = getUnlockRequirements(catalyst, manifest);
    }
}
