import { StatIndex, type ItemHash, type LookupMap, TraitId } from "./interfaces";

/**
 * This file should contain constants that are ONLY used for processing the manifest,
 * to reduce the file size of the other constants.
 * This file should only be lazy-loaded when the manifest updates and we need to pull new data.
 */

export enum PlugCategoryId {
    Intrinsic = "intrinsics",
    Barrels = "barrels",
    Blades = "blades",
    Bowstrings = "bowstrings",
    Hafts = "hafts",
    Scopes = "scopes",
    Tubes = "tubes",
    Arrows = "arrows",
    Batteries = "batteries",
    Guards = "guards",
    Magazines = "magazines",
    MagazinesGL = "magazines_gl",
    Frames = "frames",
    Origins = "origins",
    Catalysts = "catalysts",
    Stocks = "stocks",
    Grips = "grips",

    Tracker = "v400.plugs.weapons.masterworks.trackers",
    
    // Masterworks
    ExoticMasterwork = "v400.empty.exotic.masterwork",
    WeaponMasterwork = "v400.plugs.weapons.masterworks",
    WeaponMasterworkImpact = "v400.plugs.weapons.masterworks.stat.damage",
    // Components are used in string include() searches
    ExoticMasterworkComponent = "exotic.weapon.masterwork",
    WeaponMasterworkComponent = "plugs.weapons.masterworks.stat",

    // Mods
    WeaponModEmpty = "v400.weapon.mod_empty",
    WeaponModGuns = "v400.weapon.mod_guns",
    WeaponModDamage = "v400.weapon.mod_damage",
    WeaponModMagazine = "v400.weapon.mod_magazine",

    // Year 1 exotics each have their own specific plug category
    Coldheart =         "v300_new_auto_rifle0_masterwork",
    SweetBusiness =     "v300_new_auto_rifle1_masterwork",
    Merciless =         "v300_new_fusion_rifle0_masterwork",
    FightingLion =      "v300_new_grenade_launcher0_masterwork",
    Prospector =        "v300_new_grenade_launcher1_masterwork",
    Sturm =             "v300_new_hand_cannon0_masterwork",
    Sunshot =           "v300_new_hand_cannon1_masterwork",
    VigilanceWing =     "v300_new_pulse_rifle0_masterwork",
    GravitonLance =     "v300_new_pulse_rifle1_masterwork",
    WardcliffCoil =     "v300_new_rocket_launcher0_masterwork",
    SkyburnersOath =    "v300_new_scout_rifle0_masterwork",
    TractorCannon =     "v300_new_shotgun0_masterwork",
    LegendOfAcrius =    "v300_new_shotgun1_masterwork",
    RatKing =           "v300_new_sidearm1_masterwork",
    Borealis =          "v300_new_sniper_rifle0_masterwork",
    DARCI =             "v300_new_sniper_rifle1_masterwork",
    Riskrunner =        "v300_new_submachinegun1_masterwork",
    HardLight =         "v300_repackage_auto_rifle0_masterwork",
    MidaMultiTool =     "v300_repackage_scout_rifle0_masterwork",
    PrometheusLens =    "v310_new_auto_rifle0_masterwork",
    Colony =            "v310_new_grenade_launcher0_masterwork",
    Crimson =           "v310_new_hand_cannon0_masterwork",
    Telesto =           "v310_repackage_fusion_rifle0_masterwork",
    JadeRabbit =        "v310_repackage_scout_rifle0_masterwork",
    PolarisLance =      "v320_new_scout_rifle0_masterwork",
    Huckleberry =       "v320_new_submachinegun0_masterwork",
    WorldlineZero =     "v320_new_sword0_masterwork",
    SurosRegime =       "v320_repackage_auto_rifle0_masterwork",
    SleeperSimulant =   "v320_repackage_fusion_rifle0_masterwork",
    Whisper =           "v320_repackage_sniper_rifle0_masterwork",
}

const enum Year1ExoticCatalystHash {
    Coldheart =         1249968539,
    SweetBusiness =     1249968538,
    Merciless =         1149703256,
    FightingLion =      924149234,
    Prospector =        924149235,
    Sturm =             1824496860,
    Sunshot =           1824496861,
    VigilanceWing =     615063267,
    GravitonLance =     615063266,
    WardcliffCoil =     2409031770,
    SkyburnersOath =    658317088,
    TractorCannon =     456628589,
    LegendOfAcrius =    456628588,
    RatKing =           1758592809,
    Borealis =          2085058763,
    DARCI =             2085058762,
    Riskrunner =        484491717,
    HardLight =         1864989992,
    MidaMultiTool =     3466057365,
    PrometheusLens =    1684153732,
    Colony =            769440797,
    Crimson =           1783582993,
    Telesto =           920755188,
    JadeRabbit =        1496699324,
    PolarisLance =      4067652714,
    Huckleberry =       3459475454,
    WorldlineZero =     2674202880,
    SurosRegime =       1733620422,
    SleeperSimulant =   136852797,
    Whisper =           2732814938,
}

export const Year1ExoticCatalystPlugCategoryMap: LookupMap<string, ItemHash> = {
    [PlugCategoryId.Coldheart]: Year1ExoticCatalystHash.Coldheart,
    [PlugCategoryId.SweetBusiness]: Year1ExoticCatalystHash.SweetBusiness,
    [PlugCategoryId.Merciless]: Year1ExoticCatalystHash.Merciless,
    [PlugCategoryId.FightingLion]: Year1ExoticCatalystHash.FightingLion,
    [PlugCategoryId.Prospector]: Year1ExoticCatalystHash.Prospector,
    [PlugCategoryId.Sturm]: Year1ExoticCatalystHash.Sturm,
    [PlugCategoryId.Sunshot]: Year1ExoticCatalystHash.Sunshot,
    [PlugCategoryId.VigilanceWing]: Year1ExoticCatalystHash.VigilanceWing,
    [PlugCategoryId.GravitonLance]: Year1ExoticCatalystHash.GravitonLance,
    [PlugCategoryId.WardcliffCoil]: Year1ExoticCatalystHash.WardcliffCoil,
    [PlugCategoryId.SkyburnersOath]: Year1ExoticCatalystHash.SkyburnersOath,
    [PlugCategoryId.TractorCannon]: Year1ExoticCatalystHash.TractorCannon,
    [PlugCategoryId.LegendOfAcrius]: Year1ExoticCatalystHash.LegendOfAcrius,
    [PlugCategoryId.RatKing]: Year1ExoticCatalystHash.RatKing,
    [PlugCategoryId.Borealis]: Year1ExoticCatalystHash.Borealis,
    [PlugCategoryId.DARCI]: Year1ExoticCatalystHash.DARCI,
    [PlugCategoryId.Riskrunner]: Year1ExoticCatalystHash.Riskrunner,
    [PlugCategoryId.HardLight]: Year1ExoticCatalystHash.HardLight,
    [PlugCategoryId.MidaMultiTool]: Year1ExoticCatalystHash.MidaMultiTool,
    [PlugCategoryId.PrometheusLens]: Year1ExoticCatalystHash.PrometheusLens,
    [PlugCategoryId.Colony]: Year1ExoticCatalystHash.Colony,
    [PlugCategoryId.Crimson]: Year1ExoticCatalystHash.Crimson,
    [PlugCategoryId.Telesto]: Year1ExoticCatalystHash.Telesto,
    [PlugCategoryId.JadeRabbit]: Year1ExoticCatalystHash.JadeRabbit,
    [PlugCategoryId.PolarisLance]: Year1ExoticCatalystHash.PolarisLance,
    [PlugCategoryId.Huckleberry]: Year1ExoticCatalystHash.Huckleberry,
    [PlugCategoryId.WorldlineZero]: Year1ExoticCatalystHash.WorldlineZero,
    [PlugCategoryId.SurosRegime]: Year1ExoticCatalystHash.SurosRegime,
    [PlugCategoryId.SleeperSimulant]: Year1ExoticCatalystHash.SleeperSimulant,
    [PlugCategoryId.Whisper]: Year1ExoticCatalystHash.Whisper,
};

export const ValidPerkPlugCategoryMap: LookupMap<string, boolean> = {
    [PlugCategoryId.Barrels]: true,
    [PlugCategoryId.Blades]: true,
    [PlugCategoryId.Bowstrings]: true,
    [PlugCategoryId.Hafts]: true,
    [PlugCategoryId.Scopes]: true,
    [PlugCategoryId.Tubes]: true,

    [PlugCategoryId.Arrows]: true,
    [PlugCategoryId.Batteries]: true,
    [PlugCategoryId.Guards]: true,
    [PlugCategoryId.Magazines]: true,
    [PlugCategoryId.MagazinesGL]: true,

    [PlugCategoryId.Frames]: true,
    [PlugCategoryId.Origins]: true,
    [PlugCategoryId.ExoticMasterwork]: true,
    [PlugCategoryId.ExoticMasterworkComponent]: true,
    [PlugCategoryId.Catalysts]: true,
    [PlugCategoryId.Stocks]: true,
    [PlugCategoryId.Grips]: true,
};

export const ExcludedPerkCategoryMap: LookupMap<string, boolean> = {
    [PlugCategoryId.Tracker]: true,
    [PlugCategoryId.WeaponModEmpty]: true,
};

export const AllPerkPlugCategoryMap: LookupMap<string, boolean> = {
    ...ValidPerkPlugCategoryMap,
    [PlugCategoryId.Intrinsic]: true,
};

export const ModPlugCategoryMap: LookupMap<string, boolean> = {
    [PlugCategoryId.WeaponModDamage]: true,
    [PlugCategoryId.WeaponModGuns]: true,
    [PlugCategoryId.WeaponModMagazine]: true,
};

export const AllowedPlugCategoryMap: LookupMap<string, boolean> = {
    ...AllPerkPlugCategoryMap,
    ...ModPlugCategoryMap,
};

export const WeaponTraitIdMainStatMap: LookupMap<TraitId, StatIndex> = {
    [TraitId.Bow]: StatIndex.DrawTime,
    [TraitId.FusionRifle]: StatIndex.ChargeTime,
    [TraitId.LinearFusion]: StatIndex.ChargeTime,
    [TraitId.Sword]: StatIndex.Impact,
};
// All other weapons types use RPM.
export const DefaultWeaponMainStat = StatIndex.Rpm;

export const WeaponTypeRpmUnitsMap: LookupMap<TraitId, string> = {
    [TraitId.Bow]: "ms",
    [TraitId.FusionRifle]: "ms",
    [TraitId.LinearFusion]: "ms",
};
export const DefaultWeaponTypeRpmUnits = "RPM";

export const WeaponCategoryHashFilterMap: LookupMap<ItemHash, boolean> = {
    5: true, // Auto Rifles
    6: true, // Hand Cannon
    7: true, // Pulse Rifle
    8: true, // Scout Rifle
    9: true, // Fusion Rifle
    10: true, // Sniper Rifle
    11: true, // Shotgun
    12: true, // Machine gun
    13: true, // Rocket Launcher
    14: true, // Sidearm
    54: true, // Sword
    153950757: true, // Grenade Launchers
    1504945536: true, // Linear Fusion Rifles
    2489664120: true, // Trace Rifles
    3317538576: true, // Bows
    3871742104: true, // Glaives
    3954685534: true, // Submachine Guns
};

export const NonSunsetPowerCapMap: LookupMap<ItemHash, boolean> = {
    999940: true,
    999950: true,
    999960: true,
    999970: true,
    999980: true,
    999990: true,
};

const enum ExcludedItems {
    SecondLegendOfAcrius = 1744115122,
    BastionCatalyst = 4273298922,
}

export const ExcludedItemsMap: ItemHash[] = [
    ExcludedItems.SecondLegendOfAcrius,
    ExcludedItems.BastionCatalyst,
];
