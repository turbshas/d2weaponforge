import FlagIcons from "@/assets/FlagIcons";
import OriginIcons from "@/assets/OriginIcons";
import WeaponIcons from "@/assets/WeaponIcons";
import { computed } from "vue";
import { DataSearchStrings } from "./dataSearchStringService";
import type { IFilterButton, ILanguageInfo, IWeaponRangeValues } from "./types";

export const LanguageInfos = computed<ILanguageInfo[]>(() => [
    { language: "de", flagIcon: FlagIcons.DE, text: "Altsächsisch", },
    { language: "en", flagIcon: FlagIcons.EN, text: "English", },
    { language: "es", flagIcon: FlagIcons.ES, text: "Español", },
    { language: "es-mx", flagIcon: FlagIcons.ES_MX, text: "Español de México", },
    { language: "fr", flagIcon: FlagIcons.FR, text: "Français", },
    { language: "it", flagIcon: FlagIcons.IT, text: "Italiano", },
    { language: "ja", flagIcon: FlagIcons.JA, text: "日本語", },
    { language: "ko", flagIcon: FlagIcons.KO, text: "한국어", },
    { language: "pl", flagIcon: FlagIcons.PL, text: "Polski", },
    { language: "pt-br", flagIcon: FlagIcons.PT_BR, text: "Português do Brasil", },
    { language: "ru", flagIcon: FlagIcons.RU, text: "Русский", },
    { language: "zh-chs", flagIcon: FlagIcons.ZH_CHS, text: "汉语", },
    { language: "zh-cht", flagIcon: FlagIcons.ZH_CHT, text: "漢語", },
]);
export const EnglishLanguageIndex = computed(() => LanguageInfos.value.findIndex(l => l.language === "en"));

export const WeaponTraitIdMainStatMap = computed<{ [traitId: string]: string }>(() => {
    return {
        [DataSearchStrings.TraitIDs.Bow]: DataSearchStrings.Stats.DrawTime.value,
        [DataSearchStrings.TraitIDs.FusionRifle]: DataSearchStrings.Stats.ChargeTime.value,
        [DataSearchStrings.TraitIDs.LinearFusion]: DataSearchStrings.Stats.ChargeTime.value,
        [DataSearchStrings.TraitIDs.Sword]: DataSearchStrings.Stats.Impact.value,
    };
});
// All other weapons types use RPM.
export const DefaultWeaponMainStat = computed(() => DataSearchStrings.Stats.Rpm.value);

export const ValidPerkPlugCategories = computed(() => [
    DataSearchStrings.CategoryIDs.BarrelsPlug,
    DataSearchStrings.CategoryIDs.BladesPlug,
    DataSearchStrings.CategoryIDs.BowstringsPlug,
    DataSearchStrings.CategoryIDs.HaftsPlug,
    DataSearchStrings.CategoryIDs.ScopesPlug,
    DataSearchStrings.CategoryIDs.TubesPlug,

    DataSearchStrings.CategoryIDs.ArrowsPlug,
    DataSearchStrings.CategoryIDs.BatteriesPlug,
    DataSearchStrings.CategoryIDs.GuardsPlug,
    DataSearchStrings.CategoryIDs.MagazinesPlug,
    DataSearchStrings.CategoryIDs.MagazinesGLPlug,

    DataSearchStrings.CategoryIDs.FramesPlug,
    DataSearchStrings.CategoryIDs.OriginsPlug,
    DataSearchStrings.CategoryIDs.ExoticMasterworkPlug,
    DataSearchStrings.CategoryIDs.CatalystsPlug,
    DataSearchStrings.CategoryIDs.StocksPlug,
]);

export const AllowedPlugCategoryIds = computed(() => [...ValidPerkPlugCategories.value,
    DataSearchStrings.CategoryIDs.IntrinsicPlug,

    DataSearchStrings.CategoryIDs.WeaponModDamage,
    DataSearchStrings.CategoryIDs.WeaponModGuns,
    DataSearchStrings.CategoryIDs.WeaponModMagazine,
]);

export const WeaponTypeRpmUnitsMap = computed<{ [traitId: string]: string }>(() => {
    return {
        [DataSearchStrings.TraitIDs.Bow]: "ms",
        [DataSearchStrings.TraitIDs.FusionRifle]: "ms",
        [DataSearchStrings.TraitIDs.LinearFusion]: "ms",
    }
});

export const WeaponTypeTraitToRegex = computed<{ [traitId: string]: string }>(() => {
    return {
        [DataSearchStrings.TraitIDs.AutoRifle]: DataSearchStrings.WeaponCategoryRegex.AutoRifle,
        [DataSearchStrings.TraitIDs.Bow]: DataSearchStrings.WeaponCategoryRegex.Bow,
        [DataSearchStrings.TraitIDs.FusionRifle]: DataSearchStrings.WeaponCategoryRegex.FusionRifle,
        [DataSearchStrings.TraitIDs.Glaive]: DataSearchStrings.WeaponCategoryRegex.Glaive,
        [DataSearchStrings.TraitIDs.GrenadeLauncher]: DataSearchStrings.WeaponCategoryRegex.GrenadeLauncher,
        [DataSearchStrings.TraitIDs.HandCannon]: DataSearchStrings.WeaponCategoryRegex.HandCannon,
        [DataSearchStrings.TraitIDs.LinearFusion]: DataSearchStrings.WeaponCategoryRegex.LinearFusion,
        [DataSearchStrings.TraitIDs.MachineGun]: DataSearchStrings.WeaponCategoryRegex.MachineGun,
        [DataSearchStrings.TraitIDs.PulseRifle]: DataSearchStrings.WeaponCategoryRegex.PulseRifle,
        [DataSearchStrings.TraitIDs.RocketLauncher]: DataSearchStrings.WeaponCategoryRegex.RocketLauncher,
        [DataSearchStrings.TraitIDs.ScoutRifle]: DataSearchStrings.WeaponCategoryRegex.ScoutRifle,
        [DataSearchStrings.TraitIDs.Shotgun]: DataSearchStrings.WeaponCategoryRegex.Shotgun,
        [DataSearchStrings.TraitIDs.Sidearm]: DataSearchStrings.WeaponCategoryRegex.Sidearm,
        [DataSearchStrings.TraitIDs.SniperRifle]: DataSearchStrings.WeaponCategoryRegex.SniperRifle,
        [DataSearchStrings.TraitIDs.SubmachineGun]: DataSearchStrings.WeaponCategoryRegex.SubmachineGun,
        [DataSearchStrings.TraitIDs.Sword]: DataSearchStrings.WeaponCategoryRegex.Sword,
        // [DataSearchStrings.TraitIDs.TraceRifle]: DataSearchStrings.WeaponCategoryRegex.TraceRifle,
    }
});

// Numbers from: https://docs.google.com/spreadsheets/d/1B2zWeT99SksMzmptNeIt66Mv8YZu38R7t-KR50BJ0p0/view#gid=817864056
// TODO: numbers for exotics are different, like vex that acts as an auto rifle
export const WeaponCategoryRangeValuesMap = computed<{ [itemRegex: string]: IWeaponRangeValues }>(() => {
    return {
        // TODO: hand cannons are different for 120s, include that somehow
        // TODO: some weapons have a "zoom scalar" that is added to the base zoom?
        [DataSearchStrings.WeaponCategoryRegex.AutoRifle]: { baseFalloffStart: 10.8, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },
        [DataSearchStrings.WeaponCategoryRegex.HandCannon]: { baseFalloffStart: 16, hipFireRangePerStat: 0.096, zoomAdjustment: 0.25, },
        // TODO: pulse rifles are all over the place in zoom/"modified zoom multiplier"
        [DataSearchStrings.WeaponCategoryRegex.PulseRifle]: { baseFalloffStart: 15, hipFireRangePerStat: 0.0685, zoomAdjustment: 0.25, },
        [DataSearchStrings.WeaponCategoryRegex.ScoutRifle]: { baseFalloffStart: 29.2, hipFireRangePerStat: 0.169, zoomAdjustment: 1.25, },
        [DataSearchStrings.WeaponCategoryRegex.Sidearm]: { baseFalloffStart: 11.6, hipFireRangePerStat: 0.034, zoomAdjustment: 0.25, },
        [DataSearchStrings.WeaponCategoryRegex.SubmachineGun]: { baseFalloffStart: 8.19, hipFireRangePerStat: 0.09576, zoomAdjustment: 1.25, },

        [DataSearchStrings.WeaponCategoryRegex.FusionRifle]: { baseFalloffStart: 8.2, hipFireRangePerStat: 0.036, zoomAdjustment: 2, },
        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: { baseFalloffStart: 10.05, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },

        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: { baseFalloffStart: 10.05, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },

        /*
        // TODO: what to do with these? ignore them?
        ".*_fusion_rifle_line": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
        // TODO: shotgun just has 1 number, presumably it's not affected by zoom
        ".*_shotgun": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
        ".*_sniper_rifle": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
        */
    }
});

// This uses the "itemTypeRegex" field of DestinyItemCategoryDefinition as an identifier for each
// weapon type, since hash could theoretically change.
export const WeaponCategoryIconMap = computed<{ [itemRegex: string]: string }>(() => {
    return {
        [DataSearchStrings.WeaponCategoryRegex.AutoRifle]: WeaponIcons.AutoRifle,
        [DataSearchStrings.WeaponCategoryRegex.HandCannon]: WeaponIcons.HandCannon,
        [DataSearchStrings.WeaponCategoryRegex.PulseRifle]: WeaponIcons.PulseRifle,
        [DataSearchStrings.WeaponCategoryRegex.ScoutRifle]: WeaponIcons.ScoutRifle,
        [DataSearchStrings.WeaponCategoryRegex.FusionRifle]: WeaponIcons.FusionRifle,
        [DataSearchStrings.WeaponCategoryRegex.SniperRifle]: WeaponIcons.SniperRifle,
        [DataSearchStrings.WeaponCategoryRegex.Shotgun]: WeaponIcons.Shotgun,
        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: WeaponIcons.MachineGun,
        [DataSearchStrings.WeaponCategoryRegex.RocketLauncher]: WeaponIcons.RocketLauncher,
        [DataSearchStrings.WeaponCategoryRegex.Sidearm]: WeaponIcons.Sidearm,
        [DataSearchStrings.WeaponCategoryRegex.Sword]: WeaponIcons.Sword,
        [DataSearchStrings.WeaponCategoryRegex.GrenadeLauncher]: WeaponIcons.GrenadeLauncher,
        [DataSearchStrings.WeaponCategoryRegex.LinearFusion]: WeaponIcons.LinearFusionRifle,
        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: WeaponIcons.TraceRifle,
        [DataSearchStrings.WeaponCategoryRegex.Bow]: WeaponIcons.Bow,
        [DataSearchStrings.WeaponCategoryRegex.Glaive]: WeaponIcons.Glaive,
        [DataSearchStrings.WeaponCategoryRegex.SubmachineGun]: WeaponIcons.SubmachineGun,
    }
});

// TODO: custom icons for the older seasons
export const SeasonIconMap = computed<{ [seasonNumber: number]: string }>(() => {
    return {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        10: OriginIcons.SeasonWorthy,
    }
});

// TODO: these filters
export const OriginFilters = computed<IFilterButton[]>(() => [
    { text: "World (Current)", iconUrl: "", filter: () => false, },
    { text: "Word (Old)", iconUrl: "", filter: () => false, },
    { text: "Vanguard Ops", iconUrl: OriginIcons.FactionVanguard, filter: () => false, },
    { text: "Crucible", iconUrl: OriginIcons.FactionCrucible, filter: () => false, },
    { text: "Gambit", iconUrl: OriginIcons.FactionGambit, filter: () => false, },
    { text: "Iron Banner", iconUrl: OriginIcons.FactionIronBanner, filter: () => false, },
    { text: "Trials of Osiris", iconUrl: OriginIcons.FactionOsiris, filter: () => false, },
    { text: "Nightfall", iconUrl: OriginIcons.Nightfall, filter: () => false, },
    { text: "King's Fall", iconUrl: "", filter: () => false, },
    { text: "Duality", iconUrl: OriginIcons.Duality, filter: () => false, },
    { text: "Opulent", iconUrl: "", filter: () => false, }, // TODO: this would be opulent weapons that were reissued ONLY (unless Include Sunset is checked?)
    { text: "Vow of the Disciple", iconUrl: OriginIcons.VowOfTheDisciple, filter: () => false, },
    { text: "Throne World", iconUrl: "", filter: () => false, },
    { text: "30th Anniversary", iconUrl: "", filter: () => false, },
    { text: "Vault of Glass", iconUrl: OriginIcons.VaultOfGlass, filter: () => false, },
    { text: "Europa", iconUrl: OriginIcons.Europa, filter: () => false, },
    { text: "Deep Stone Crypt", iconUrl: "", filter: () => false, },
    { text: "Prophecy", iconUrl: OriginIcons.FactionTheNine, filter: () => false, }, // TODO: this would be Trials of the Nine weapons that drop in Prophecy ONLY (unless Include Sunset is checked?)
    { text: "Altars of Sorrow", iconUrl: "", filter: () => false, },
    { text: "Pit of Heresy", iconUrl: "", filter: () => false, },
    { text: "Dreambane", iconUrl: "", filter: () => false, },
    { text: "Garden of Salvation", iconUrl: "", filter: () => false, },
    { text: "The Dreaming City", iconUrl: "", filter: () => false, },
    { text: "Last Wish", iconUrl: "", filter: () => false, },
]);
