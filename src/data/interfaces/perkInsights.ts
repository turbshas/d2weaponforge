import type { ItemHash, LookupMap } from "./common";
import type { ModHash, PerkHash } from "./gameValues";

export interface IPerkInsightCollection {
    weaponPerks: IPerkInsights<PerkHash>;
    weaponMods: IPerkInsights<ModHash>;
}

export type IPerkInsights<T extends string | number | symbol> = LookupMap<T, IPerkInsight>;

export interface IPerkInsight {
    description: string;
}

export interface IInsightDisplay {
    hash: ItemHash;
    name: string;
    iconUrl: string;
    description: string;
}
