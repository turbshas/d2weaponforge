import type {
    DestinyDamageTypeDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyManifestSlice,
    DestinyPlugSetDefinition,
    DestinySeasonDefinition,
    DestinySocketCategoryDefinition,
    DestinySocketTypeDefinition,
    DestinyStatDefinition,
    DestinyStatGroupDefinition
} from "bungie-api-ts/destiny2";

export type UsedDestinyManifestSlice = DestinyManifestSlice<(
    "DestinyDamageTypeDefinition"
    | "DestinyItemCategoryDefinition"
    | "DestinyItemTierTypeDefinition"
    | "DestinySeasonDefinition"
    | "DestinyInventoryItemDefinition"
    | "DestinyPlugSetDefinition"
    | "DestinyStatDefinition"
    | "DestinyStatGroupDefinition"
    | "DestinySocketCategoryDefinition"
    | "DestinySocketTypeDefinition"
    | "DestinyPowerCapDefinition"
)[]>;

export enum WeaponArchetypeRpm {
    AutoAdaptive = 600,
    AutoHighImpact = 360,
    AutoLightweight = 450,
    AutoPrecision = 450,
    AutoRapidFire = 720,

    BowLightweight = 580,
    BowPrecision = 684,

    FusionAdaptive = 660,
    FusionHighImpact = 960,
    FusionPrecision = 780,
    FusionRapidFire = 500,

    GrenadeAdaptive = 120,
    GrenadeLightweight = 90,
    GrenadePrecision = 100,
    GrenadeRapidFire = 150,
    GrenadeWave = 72,

    HandCannonAdaptive = 140,
    HandCannonAggressive = 120,
    HandCannonPrecision = 180,

    LinearAggressive = 533,
    LinearPrecision = 533,

    MachineGunAdaptive = 450,
    MachineGunHighImpact = 360,
    MachineGunRapidFire = 900,

    PulseAdaptive = 390,
    PulseAggBurst = 450,
    PulseHighImpact = 340,
    PulseLightweight = 450,
    PulseRapidFire = 540,

    RocketAdaptive = 20,
    RocketAggressive = 25,
    RocketHakkePrecision = 15,
    RocketHighImpact = 15,
    RocketPrecision = 15,

    ScoutHighImpact = 150,
    ScoutLightweight = 200,
    ScoutPrecision = 180,
    ScoutRapidFire = 260,
    ScoutVeistRapidFire = 260,

    SidearmAdaptive = 300,
    SidearmAdaptiveBurst = 491,
    SidearmAggressiveBurst = 325,
    SidearmLightweight = 360,
    SidearmOmolonAdaptive = 491,
    SidearmPrecision = 260,
    SidearmSurosRapidFire = 450,

    ShotgunAggressive = 55,
    ShotgunLightweight = 80,
    ShotgunPinpointSlug = 65,
    ShotgunPrecision = 65,
    ShotgunRapidFire = 140,

    SmgAdaptive = 900,
    SmgAggressive = 750,
    SmgLightweight = 900,
    SmgPrecision = 600,

    SniperAdaptive = 90,
    SniperAggressive = 72,
    SniperRapidFire = 140,

    SwordAdaptive = -1,
    SwordAggressive = -1,
    SwordCaster = -1,
    SwordVortex = -1,
}

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

export type FilterCategory = "Damage Type" | "Weapon" | "Archetype" | "Collections" | "Rarity";

export type FilterPredicate = (item: IWeapon) => boolean;

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
}

export interface IArchetypeFilter {
    text: string;
    filter: FilterPredicate;
}

export interface IWeaponFilterButton extends IFilterButton {
    archetypes: IArchetypeFilter[];
}

export interface IAppliedFilters {
    includeSunsetWeapons: boolean;
    collectionsFilters: FilterPredicate[];
    damageFilters: FilterPredicate[];
    rarityFilters: FilterPredicate[];
    weaponFilters: FilterPredicate[];
    perkNames: string[];
}

export enum ItemTierIndex {
    Basic = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Legendary = 4,
    Exotic = 5,
}

export interface Destiny2GameData {
    damageTypes: DestinyDamageTypeDefinition[];
    damageTypesLookup: { [hash: number]: DestinyDamageTypeDefinition };

    itemCategories: DestinyItemCategoryDefinition[];
    itemCategoriesLookup: { [hash: number]: DestinyItemCategoryDefinition };

    itemTierTypes: DestinyItemTierTypeDefinition[];
    itemTierTypesLookup: { [hash: number]: DestinyItemTierTypeDefinition };

    seasons: DestinySeasonDefinition[];
    seasonsLookup: { [hash: number]: DestinySeasonDefinition };

    weapons: IWeapon[];
    weaponsLookup: { [weaponHash: number]: IWeapon };

    statsLookup: { [hash: number]: DestinyStatDefinition };
    statGroupsLookup: { [hash: number]: DestinyStatGroupDefinition };
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };
}

export interface IWeapon {
    weapon: DestinyInventoryItemDefinition;
    isAdept: boolean;
    intrinsic: DestinyInventoryItemDefinition | undefined;
    perks: IPerkSlotOptions[];
    curated: IPerkSlotOptions[];
    masterworks: DestinyInventoryItemDefinition[];
    mods: DestinyInventoryItemDefinition[];
}

export interface IWeaponInfo {
    hash: number;
    name: string;
    icon: string;
    watermark: string;
    screenshot: string;
    typeDisplayName: string;
    elementName: string;
    elementIcon: string;
    categories: DestinyItemCategoryDefinition[];
    damageTypes: DestinyDamageTypeDefinition[];
    season: DestinySeasonDefinition;
    tier: ItemTierIndex;

    accuracy: number;
    aimAssist: number;
    airbourneEffectiveness: number;
    blastRadius: number;
    chargeTime: number;
    drawTime: number;
    /** The actual magazine size, i.e. number of shots. */
    magSize: number;
    /** The underlying magazine stat value, from 0-100. Comes from the "investmentStat" property rather than the "stats" block. */
    magStat: number;
    impact: number;
    handling: number;
    range: number;
    recoilDirection: number;
    reloadSpeed: number;
    rpm: number;
    stability: number;
    velocity: number;
    zoom: number;
}

export interface IPerkOption {
    perk: DestinyInventoryItemDefinition;
    enhancedPerk?: DestinyInventoryItemDefinition;
    craftingInfo: ICraftingInfo | undefined;
    currentlyCanRoll: boolean;
    useEnhanced: boolean;
}

export interface ICraftingInfo {
    requiredLevel: number | undefined;
    requiredLevelEnhanced: number | undefined;
}

export interface IPerkSlotOptions {
    options: IPerkOption[];
}
