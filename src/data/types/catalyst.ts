import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { ICatalyst, ICatalystUnlockRequirement, ItemHash } from "../interfaces";
import { Year1ExoticCatalystPlugCategoryMap } from "../processingConstants";
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

function getIconAndPerks(catalyst: DestinyInventoryItemDefinition, manifest: ManifestAccessor) {
    const year1CatalystHash = catalyst.plug ? Year1ExoticCatalystPlugCategoryMap[catalyst.plug.plugCategoryIdentifier] : undefined;
    const year1Catalyst = manifest.getItemDefinition(year1CatalystHash);
    if (year1Catalyst && catalyst.objectives && catalyst.objectives.objectiveHashes.length > 0) {
        // Only one of the referenced catalysts has objectives - that one also has the stat bonuses,
        // so only add the perks to that one.
        return {
            icon: year1Catalyst.displayProperties.icon,
            perks: getSandboxPerks(year1Catalyst),
        };
    } else {
        return {
            icon: catalyst.displayProperties.icon,
            perks: getSandboxPerks(catalyst),
        };
    }
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
        const iconAndPerks = getIconAndPerks(catalyst, manifest);
        // Description should come from sandbox perk if available -> catalyst upgrade item (year 1 catalysts)
        // Name should come from sandbox perk if available -> catalyst upgrade item (year 1 catalysts)
        // Same for icon
        // Same for stat boosts (range/stability/etc.)
        super(catalyst, manifest, catalyst.displayProperties.name, catalyst.displayProperties.description, iconAndPerks.icon);

        this.sandboxPerks = iconAndPerks.perks;
        this.unlockRequirements = getUnlockRequirements(catalyst, manifest);
    }
}
