import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export interface IFilter {
    text: string;
    iconUrl: string;
    /** Returns true if item is included, false if item is excluded. */
    filter: (item: DestinyInventoryItemDefinition) => boolean;
}
