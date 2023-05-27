import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { IWeapon } from "./gameData";
import type { ItemHash, LookupMap } from "./common";

export enum PageSelection {
    Home = "Home",
    Glossary = "Glossary",
    Compare = "Compare",
    Weapon = "Weapon",
}

export enum SidebarPanelSelection {
    Weapons = "Weapons",
    Filters = "Filters",
    Languages = "Languages",
    /**
     * When the screen is narrow, default is to hide the sidebar and show the weapon viewer.
     * When the screen is wide enough, the sidebar is always displayed so the default is the weapon list.
     */
    Default = "Default",
}

export enum StatDisplayType {
    Bar = "Bar",
    Angle = "Angle",
    Number = "Number",
}

export interface ILanguageInfo {
    language: DestinyManifestLanguage;
    flagIcon: string;
    text: string;
}

export type FilterCategory = "Damage Type" | "Weapon" | "Archetype" | "Collections" | "Rarity" | "Misc";

export type FilterPredicate = (item: IWeapon) => boolean;

export interface ISelectedFilters {
    includeSunset: boolean;
    selectedPerks: LookupMap<string, IPerkFilterInfo>;
    selectedFiltersMap: Record<FilterCategory, LookupMap<string, IFilterButton>>;
}

export interface IPerkFilterInfo {
    name: string;
    /** There are some duplicate perks with different hashes but the same name. */
    perkHashes: ItemHash[];
}

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
}

export interface IArchetypeFilter extends IFilterButton {
    /** Whatever constitutes as an "RPM" for this weapon type. (Fusion are charge time, bows are draw time, etc.) */
    rpm: number;
    /** The name of the archetype. */
    name: string;
}

export interface IWeaponFilterButton extends IFilterButton {
    archetypes: IArchetypeFilter[];
}

export interface IAppliedFilters {
    includeSunsetWeapons: boolean;
    perkFilter: FilterPredicate | undefined;
    collectionsFilters: FilterPredicate[];
    damageFilters: FilterPredicate[];
    miscFilters: FilterPredicate[];
    rarityFilters: FilterPredicate[];
    weaponFilters: FilterPredicate[];
    perkNames: string[];
}
