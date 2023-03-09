import { StatIndex, type ItemHash, type LookupMap, type WeaponCategoryRegex } from "./interfaces";

const enum PlugCategoryId {
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

const enum TraitId {
    Weapon =            "item_type.weapon",
    AutoRifle =         "weapon_type.auto_rifle",
    Bow =               "weapon_type.bow",
    FusionRifle =       "weapon_type.fusion_rifle",
    Glaive =            "weapon_type.glaive",
    GrenadeLauncher =   "weapon_type.grenade_launcher",
    HandCannon =        "weapon_type.hand_cannon",
    LinearFusion =      "weapon_type.linear_fusion_rifle",
    MachineGun =        "weapon_type.machinegun",
    PulseRifle =        "weapon_type.pulse_rifle",
    RocketLauncher =    "weapon_type.rocket_launcher",
    ScoutRifle =        "weapon_type.scout_rifle",
    Shotgun =           "weapon_type.shotgun",
    Sidearm =           "weapon_type.sidearm",
    SniperRifle =       "weapon_type.sniper_rifle",
    SubmachineGun =     "weapon_type.submachinegun",
    Sword =             "weapon_type.sword",
    ExoticCatalyst =    "item_type.exotic_catalyst",
}

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

export const WeaponTypeTraitToRegex: LookupMap<TraitId, WeaponCategoryRegex> = {
    [TraitId.AutoRifle]: ".*_auto_rifle",
    [TraitId.Bow]: "type_weapon_bow",
    [TraitId.FusionRifle]: "type_weapon_fusion_rifle",
    [TraitId.Glaive]: ".*_glaive",
    [TraitId.GrenadeLauncher]: ".*_grenade_launcher",
    [TraitId.HandCannon]: ".*_hand_cannon",
    [TraitId.LinearFusion]: ".*_fusion_rifle_line",
    [TraitId.MachineGun]: ".*_machinegun",
    [TraitId.PulseRifle]: ".*_pulse_rifle",
    [TraitId.RocketLauncher]: ".*_rocket_launcher",
    [TraitId.ScoutRifle]: ".*_scout_rifle",
    [TraitId.Shotgun]: ".*_shotgun",
    [TraitId.Sidearm]: ".*_sidearm",
    [TraitId.SniperRifle]: ".*_sniper_rifle",
    [TraitId.SubmachineGun]: ".*_submachinegun",
    [TraitId.Sword]: "type_weapon_sword",
};
