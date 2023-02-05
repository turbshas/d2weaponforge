import type { DestinyInventoryItemDefinition, DestinyItemTierTypeDefinition, DestinyPlugSetDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import type { UsedDestinyManifestSlice } from "../interfaces";

export class ManifestAccessor {
    constructor(private readonly manifest: UsedDestinyManifestSlice) { }

    public getItemDefinition = (hash: number): DestinyInventoryItemDefinition | undefined => {
        return this.manifest.DestinyInventoryItemDefinition[hash];
    }

    public getItemTierDefinition = (hash: number): DestinyItemTierTypeDefinition | undefined => {
        return this.manifest.DestinyItemTierTypeDefinition[hash];
    }

    public getPlugSetDefinition = (hash: number): DestinyPlugSetDefinition | undefined => {
        return this.manifest.DestinyPlugSetDefinition[hash];
    }

    public getSocketTypeDefinition = (hash: number): DestinySocketTypeDefinition | undefined => {
        return this.manifest.DestinySocketTypeDefinition[hash];
    }

    public getStatTypeDefinition = (hash: number): DestinyStatDefinition | undefined => {
        return this.manifest.DestinyStatDefinition[hash];
    }

    public getStatGroupDefinition = (hash: number): DestinyStatGroupDefinition | undefined => {
        return this.manifest.DestinyStatGroupDefinition[hash];
    }
}
