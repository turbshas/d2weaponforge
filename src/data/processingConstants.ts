import { StatIndex, type LookupMap, type WeaponCategoryRegex } from "./interfaces";

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

export const Year1ExoticCatalystPlugCategoryMap: LookupMap<string, boolean> = {
    [PlugCategoryId.Coldheart]: true,
    [PlugCategoryId.SweetBusiness]: true,
    [PlugCategoryId.Merciless]: true,
    [PlugCategoryId.FightingLion]: true,
    [PlugCategoryId.Prospector]: true,
    [PlugCategoryId.Sturm]: true,
    [PlugCategoryId.Sunshot]: true,
    [PlugCategoryId.VigilanceWing]: true,
    [PlugCategoryId.GravitonLance]: true,
    [PlugCategoryId.WardcliffCoil]: true,
    [PlugCategoryId.SkyburnersOath]: true,
    [PlugCategoryId.TractorCannon]: true,
    [PlugCategoryId.LegendOfAcrius]: true,
    [PlugCategoryId.RatKing]: true,
    [PlugCategoryId.Borealis]: true,
    [PlugCategoryId.DARCI]: true,
    [PlugCategoryId.Riskrunner]: true,
    [PlugCategoryId.HardLight]: true,
    [PlugCategoryId.MidaMultiTool]: true,
    [PlugCategoryId.PrometheusLens]: true,
    [PlugCategoryId.Colony]: true,
    [PlugCategoryId.Crimson]: true,
    [PlugCategoryId.Telesto]: true,
    [PlugCategoryId.JadeRabbit]: true,
    [PlugCategoryId.PolarisLance]: true,
    [PlugCategoryId.Huckleberry]: true,
    [PlugCategoryId.WorldlineZero]: true,
    [PlugCategoryId.SurosRegime]: true,
    [PlugCategoryId.SleeperSimulant]: true,
    [PlugCategoryId.Whisper]: true,
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
