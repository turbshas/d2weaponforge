import type {
    DestinyDamageTypeDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyManifestLanguage,
    DestinyManifestSlice,
    DestinyPlugSetDefinition,
    DestinySeasonDefinition,
    DestinySocketCategoryDefinition,
    DestinySocketTypeDefinition,
    DestinyStatDefinition,
    DestinyStatDisplayDefinition,
    DestinyStatGroupDefinition
} from "bungie-api-ts/destiny2";
import type { PerkOption } from "./types/perkOption";
import type { Weapon } from "./types/weapon";

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

export enum SidebarPanelSelection {
    Weapons = "Weapons",
    Filters = "Filters",
    Languages = "Languages",
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

    weapons: Weapon[];
    weaponsLookup: { [weaponHash: number]: Weapon };

    weaponTypes: IWeaponTypeInfo[];

    statsLookup: { [hash: number]: DestinyStatDefinition };
    statGroupsLookup: { [hash: number]: DestinyStatGroupDefinition };
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };
}

export type PerkColumnNumber = 1 | 2 | 3 | 4 | 5;
export type SelectedPerkMap = { [column in keyof PerkColumnNumber as PerkColumnNumber]: PerkOption | undefined };

export interface IWeapon {
    index: number;
    hash: number;
    name: string;
    description: string;
    itemTypeDisplayName: string;
    screenshotUrl: string;
    iconUrl: string;
    iconWatermarkUrl: string;
    isAdept: boolean;
    isSunset: boolean;
    tierTypeIndex: number;
    traitId: string;
    weaponCategoryRegex: string;
    damageType: IDamageType;
    statBlock: IStatBlock;
    archetype: IArchetype | undefined;
    perks: IPerkGrid;
    curated: IPerkGrid;
    masterworks: IMasterwork[];
    mods: IMod[];
}

export interface IDamageType {
    name: string;
    iconUrl: string;
}

export interface IStatBlock {
    statInfos: IStatInfo[];
}

export interface IStatInfo {
    statHash: number;
    statName: string;
    investmentValue: number;
    statDisplay: DestinyStatDisplayDefinition | undefined;
}

export interface IArchetype extends IPerk {
    rpmStatHash: number | undefined;
    rpmStatValue: number | undefined;
    rpmUnits: string;
}

export interface IPerkGrid {
    perkColumns: IPerkColumn[];
    get firstColumn(): IPerkOption[];
    get secondColumn(): IPerkOption[];
    get thirdColumn(): IPerkOption[];
    get fourthColumn(): IPerkOption[];
}

export interface IPerkColumn {
    perks: IPerkOption[];
}

export interface IPerkOption {
    craftingInfo: ICraftingInfo | undefined,
    currentlyCanRoll: boolean,
    useEnhanced: boolean,
    perk: IPerk;
    enhancedPerk: IPerk | undefined;
}

export interface ICraftingInfo {
    requiredLevel: number | undefined;
    requiredLevelEnhanced: number | undefined;
}

export interface IPerk {
    hash: number;
    name: string;
    description: string;
    itemTypeDisplayName: string;
    iconUrl: string;
    iconWatermarkUrl: string;
    mainBonuses: IPerkBonus[];
    adeptOrCraftedBonuses: IPerkBonus[];
}

export interface IPerkBonus {
    statHash: number;
    statName: string;
    value: number;
}

export interface IMasterwork extends IPerk { }
export interface IMod extends IPerk { }

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

export interface IWeaponTypeInfo {
    /** User-friendly name of the weapon type. */
    weaponTypeName: string;
    /** The trait ID of this weapon type (@see {@link DestinyInventoryItemDefinition.traitIds}). */
    traitId: string;
    /** The regex from @see {@link DestinyItemCategoryDefinition.itemTypeRegex} that matches this weapon type. */
    weaponCategoryRegex: string;
    /** The hash of the weapon type's category, from @see {@link DestinyItemCategoryDefinition.hash}. */
    weaponCategoryHash: number;
    /** Whether to show the RPM value in the filter. */
    showRpm: boolean;
    /** Whether to use the RPM to compare between archetypes. If not, just the name of the intrinsic perk is used. */
    compareUsingRpm: boolean;
    /** The units that the RPM value is in, e.g. RPM or ms. */
    rpmUnits: string;
    archetypes: IArchetypeInfo[];
}

export interface IArchetypeInfo {
    /** Trait ID of the weapon archetype. */
    weaponType: string;
    /** Name of the archetype's intrinsic perk. */
    name: string;
    /** The RPM of the archetype, or equivalent. */
    rpm: number;
    /** The hash of the stat used to get the RPM. */
    statHash: number;
}

export interface IWeaponRangeValues {
    baseFalloffStart: number;
    hipFireRangePerStat: number;
    zoomAdjustment: number;
}

