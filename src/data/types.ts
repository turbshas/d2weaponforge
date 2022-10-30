import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export enum PageSelection {
    Home = "Home",
    Glossary = "Glossary",
    Compare = "Compare",
    Weapon = "Weapon",
}

export enum StatDisplayType {
    Bar = "Bar",
    Angle = "Angle",
    Number = "Number",
}

export type FilterCategory = "Damage Type" | "Weapon" | "Collections" | "Rarity";

export type FilterPredicate = (item: DestinyInventoryItemDefinition) => boolean;

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
    active: boolean;
}

export enum ItemTierIndex {
    Basic = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Legendary = 4,
    Exotic = 5,
}

export interface IPerkOption {
    perk: DestinyInventoryItemDefinition;
    enhancedPerk?: DestinyInventoryItemDefinition;
    currentlyCanRoll: boolean;
}

export interface IPerkSlotOptions {
    options: IPerkOption[];
}
