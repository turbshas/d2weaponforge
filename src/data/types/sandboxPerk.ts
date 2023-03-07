import type { DestinySandboxPerkDefinition } from "bungie-api-ts/destiny2";
import type { ISandboxPerk } from "../interfaces";

export class SandboxPerk implements ISandboxPerk {
    public readonly index: number;
    public readonly hash: number;
    public readonly name: string;
    public readonly description: string;
    public readonly iconUrl: string;
    public readonly damageTypeHash?: number | undefined;

    constructor(
        sandboxPerkItem: DestinySandboxPerkDefinition,
        ) {
        this.index = sandboxPerkItem.index;
        this.hash = sandboxPerkItem.hash;
        this.name = sandboxPerkItem.displayProperties.name;
        this.description = sandboxPerkItem.displayProperties.description;
        this.iconUrl = sandboxPerkItem.displayProperties.icon || "";
        this.damageTypeHash = sandboxPerkItem.damageTypeHash;
    }
}
