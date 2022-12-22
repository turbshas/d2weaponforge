import type {
    DestinyDamageTypeDefinition,
    DestinyEnergyTypeDefinition,
    DestinyEquipmentSlotDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyPlugSetDefinition,
    DestinySandboxPerkDefinition,
    DestinySeasonDefinition,
    DestinySocketCategoryDefinition,
    DestinySocketTypeDefinition,
    DestinyStatDefinition
} from "bungie-api-ts/destiny2";

export enum DataSearchString {
    Adept = "Adept",
    FramesPlugCategoryId = "frames",
    RangefinderPerkName = "Rangefinder",
    TrackerCategoryId = "v400.plugs.weapons.masterworks.trackers",

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

export type FilterPredicate = (item: DestinyInventoryItemDefinition) => boolean;

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
    active: boolean;
}

export interface IArchetypeFilter {
    text: string;
    filter: FilterPredicate;
    active: boolean;
}

export interface IWeaponFilterButton extends IFilterButton {
    archetypes: IArchetypeFilter[];
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

    energyTypes: DestinyEnergyTypeDefinition[];
    energyTypesLookup: { [hash: number]: DestinyEnergyTypeDefinition };

    equipmentSlots: DestinyEquipmentSlotDefinition[];
    equipmentSlotsLookup: { [hash: number]: DestinyEquipmentSlotDefinition };

    itemCategories: DestinyItemCategoryDefinition[];
    itemCategoriesLookup: { [hash: number]: DestinyItemCategoryDefinition };

    itemTierTypes: DestinyItemTierTypeDefinition[];
    itemTierTypesLookup: { [hash: number]: DestinyItemTierTypeDefinition };

    seasons: DestinySeasonDefinition[];
    seasonsLookup: { [hash: number]: DestinySeasonDefinition };

    weapons: DestinyInventoryItemDefinition[];

    statsLookup: { [hash: number]: DestinyStatDefinition };
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    sandboxPerksLookup: { [hash: number]: DestinySandboxPerkDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };

    originPerkCategory: DestinyItemCategoryDefinition;
    weaponIntrinsicCategory: DestinySocketCategoryDefinition;
    weaponPerkCategory: DestinySocketCategoryDefinition;
}

export interface IPerkOption {
    perk: DestinyInventoryItemDefinition;
    enhancedPerk?: DestinyInventoryItemDefinition;
    currentlyCanRoll: boolean;
    useEnhanced: boolean;
}

export interface IPerkSlotOptions {
    options: IPerkOption[];
}
