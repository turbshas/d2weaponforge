import type { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinyItemTierTypeDefinition, DestinyPlugSetDefinition, DestinySeasonDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import type { UsedDestinyManifestSlice } from "../interfaces";

export class ManifestAccessor {
    constructor(private readonly manifest: UsedDestinyManifestSlice) { }

    public get slice() { return this.manifest; }

    // Wrappers for typing reasons (explicitly requiring return values are checked for undefined)
    public getDamageTypeDefinition = (hash: number): DestinyDamageTypeDefinition | undefined => {
        return this.manifest.DestinyDamageTypeDefinition[hash];
    }

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

    public getStatGroupDefinition = (hash: number): DestinyStatGroupDefinition | undefined => {
        return this.manifest.DestinyStatGroupDefinition[hash];
    }

    public getStatTypeDefinition = (hash: number): DestinyStatDefinition | undefined => {
        return this.manifest.DestinyStatDefinition[hash];
    }
}