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
    DestinyStatDefinition
} from "bungie-api-ts/destiny2";

export type UsedDestinyManifestSlice = DestinyManifestSlice<(
    "DestinyDamageTypeDefinition"
    | "DestinyItemCategoryDefinition"
    | "DestinyItemTierTypeDefinition"
    | "DestinySeasonDefinition"
    | "DestinyInventoryItemDefinition"
    | "DestinyPlugSetDefinition"
    | "DestinyStatDefinition"
    | "DestinySocketCategoryDefinition"
    | "DestinySocketTypeDefinition"
    | "DestinyPowerCapDefinition"
)[]>;

export enum DataSearchString {
    // Adept names
    Adept = "Adept",
    Harrowed = "Harrowed",
    Timelost = "Timelost",

    FramesPlugCategoryId = "frames",
    RangefinderPerkName = "Rangefinder",
    TrackerCategoryId = "v400.plugs.weapons.masterworks.trackers",

    // Stat names
    AccuracyStatName = "Accuracy",
    AimAssistanceStatName = "Aim Assistance",
    AirborneEffectivenessStatName = "Airborne Effectiveness",
    BlastRadiusStatName = "Blast Radius",
    ChargeTimeStatName = "Charge Time",
    DrawTimeStatName = "Draw Time",
    MagSizeStatName = "Magazine",
    ImpactStatName = "Impact",
    HandlingStatName = "Handling",
    RangeStatName = "Range",
    RecoilDirectionStatName = "Recoil Direction",
    ReloadSpeedStatName = "Reload Speed",
    RpmStatName = "Rounds Per Minute",
    StabilityStatName = "Stability",
    VelocityStatName = "Velocity",
    ZoomStatName = "Zoom",

    ModItemCategoryName = "Mods",
    WeaponItemCategoryName = "Weapon",
    WeaponIntrinsicPerkCategoryName = "INTRINSIC TRAITS",
    WeaponOriginPerkItemCategoryName = "Weapon Mods: Origin Traits",
    WeaponPerkSocketCategoryName = "WEAPON PERKS",
    WeaponMasterworkPlugWhitelistCategoryId = "v400.plugs.weapons.masterworks",
    WeaponModsSocketCategoryName = "WEAPON MODS",
    WeaponModPlugWhitelistCategoryId = "v400.weapon.mod_empty",

    // Weapon categories
    AutoRifleTypeRegex = ".*_auto_rifle",
    BowTypeRegex = "type_weapon_bow",
    HandCannonTypeRegex = ".*_hand_cannon",
    FusionRifleTypeRegex = "type_weapon_fusion_rifle",
    GlaiveTypeRegex = ".*_glaive",
    GrenadeLauncherTypeRegex = ".*_grenade_launcher",
    LinearFusionTypeRegex = ".*_fusion_rifle_line",
    MachineGunTypeRegex = ".*_machinegun",
    PulseRifleTypeRegex = ".*_pulse_rifle",
    RocketLauncherTypeRegex = ".*_rocket_launcher",
    ScoutRifleTypeRegex = ".*_scout_rifle",
    SidearmTypeRegex = ".*_sidearm",
    ShotgunTypeRegex = ".*_shotgun",
    SniperRifleTypeRegex = ".*_sniper_rifle",
    SubmachinegunTypeRegex = ".*_submachinegun",
    SwordTypeRegex = "type_weapon_sword",
    TraceRifleTypeRegex = ".*_beam_rifle",

    // Weapon Archetypes
    Adaptive = "Adaptive",
    AdaptiveBurst = "Adaptive (Burst)",
    Aggressive = "Aggressive",
    AggressiveBurst = "Agg. Burst", // Or Aggressive Burst?
    Caster = "Caster",
    HakkePrecision = "Hakke Precision",
    HighImpact = "High-Impact",
    Lightweight = "Lightweight",
    OmolonAdaptive = "Omolon Adaptive",
    PinpointSlug = "Pinpoint Slug",
    Precision = "Precision",
    RapidFire = "Rapid-Fire",
    SurosRapidFire = "Suros Rapid-Fire",
    VeistRapidFire = "Veist Rapid-Fire",
    Vortex = "Vortex",
    WaveFrame = "Wave-Frame",
}

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

export interface IWeapon {
    weapon: DestinyInventoryItemDefinition;
    intrinsic: DestinyInventoryItemDefinition | undefined;
    perks: IPerkSlotOptions[];
    curated: IPerkSlotOptions[];
    masterworks: DestinyInventoryItemDefinition[];
    mods: DestinyInventoryItemDefinition[];
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
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };

    originPerkCategory: DestinyItemCategoryDefinition;
    weaponIntrinsicCategory: DestinySocketCategoryDefinition;
    weaponPerkCategory: DestinySocketCategoryDefinition;
}

export interface IPerkOption {
    perk: DestinyInventoryItemDefinition;
    enhancedPerk?: DestinyInventoryItemDefinition;
    craftingInfo: ICraftingInfo | undefined;
    currentlyCanRoll: boolean;
    useEnhanced: boolean;
}

export interface ICraftingInfo {
    requiredLevel: number;
    requiredLevelEnhanced: number | undefined;
}

export interface IPerkSlotOptions {
    options: IPerkOption[];
}
