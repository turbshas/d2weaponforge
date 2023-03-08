import FlagIcons from "@/assets/FlagIcons";
import OriginIcons from "@/assets/OriginIcons";
import WeaponIcons from "@/assets/WeaponIcons";
import { computed } from "vue";
import { Collection, type ILanguageInfo, type LookupMap, type SeasonNumber, type TraitId, type WeaponCategoryRegex } from "./interfaces";
import { DataSearchStrings } from "./services/dataSearchStringService";

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

// This uses the "itemTypeRegex" field of DestinyItemCategoryDefinition as an identifier for each
// weapon type, since hash could theoretically change.
export const WeaponCategoryIconMap = computed<LookupMap<WeaponCategoryRegex, string>>(() => {
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

type SeasonIconMap = { [season in SeasonNumber]?: string };
// TODO: custom icons for the older seasons
export const SeasonIconMap = computed<SeasonIconMap>(() => {
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

interface IOriginFilterInfo {
    collection: Collection;
    text: string;
    iconUrl: string;
}

type SeasonNumberToCollectionMap = { [season in SeasonNumber]: Collection };

export const SeasonToCollectionMap = computed<SeasonNumberToCollectionMap>(() => {
    return {
        1: Collection.TheRedWar,
        2: Collection.CurseOfOsiris,
        3: Collection.Warmind,
        4: Collection.Outlaw,
        5: Collection.Forge,
        6: Collection.Drifter,
        7: Collection.Opulence,
        8: Collection.Undying,
        9: Collection.Dawn,
        10: Collection.Worthy,
        11: Collection.Arrivals,
        12: Collection.Hunt,
        13: Collection.Chosen,
        14: Collection.Splicer,
        15: Collection.Lost,
        16: Collection.Risen,
        17: Collection.Haunted,
        18: Collection.Plunder,
        19: Collection.Seraph,
    }
});

export const OriginFilterInfos = computed<IOriginFilterInfo[]>(() => [
    { collection: Collection.WorldCurrent, text: "World (Current)", iconUrl: "", },
    { collection: Collection.WorldOld, text: "Word (Old)", iconUrl: "", },
    { collection: Collection.VanguardOps, text: "Vanguard Ops", iconUrl: OriginIcons.FactionVanguard, },
    { collection: Collection.Crucible, text: "Crucible", iconUrl: OriginIcons.FactionCrucible, },
    { collection: Collection.Gambit, text: "Gambit", iconUrl: OriginIcons.FactionGambit, },
    { collection: Collection.IronBanner, text: "Iron Banner", iconUrl: OriginIcons.FactionIronBanner, },
    { collection: Collection.TrialsOfOsiris, text: "Trials of Osiris", iconUrl: OriginIcons.FactionOsiris, },
    { collection: Collection.Nightfall, text: "Nightfall", iconUrl: OriginIcons.Nightfall, },
    { collection: Collection.KingsFall, text: "King's Fall", iconUrl: "", },
    { collection: Collection.Duality, text: "Duality", iconUrl: OriginIcons.Duality, },
    { collection: Collection.Opulent, text: "Opulent", iconUrl: "", }, // TODO: this would be opulent weapons that were reissued ONLY (unless Include Sunset is checked?)
    { collection: Collection.VowOfTheDisciple, text: "Vow of the Disciple", iconUrl: OriginIcons.VowOfTheDisciple, },
    { collection: Collection.ThroneWorld, text: "Throne World", iconUrl: "", },
    { collection: Collection.Anniversary, text: "30th Anniversary", iconUrl: "", },
    { collection: Collection.VaultOfGlass, text: "Vault of Glass", iconUrl: OriginIcons.VaultOfGlass, },
    { collection: Collection.Europa, text: "Europa", iconUrl: OriginIcons.Europa, },
    { collection: Collection.DeepStoneCrypt, text: "Deep Stone Crypt", iconUrl: "", },
    { collection: Collection.Prophecy, text: "Prophecy", iconUrl: OriginIcons.FactionTheNine, }, // TODO: this would be Trials of the Nine weapons that drop in Prophecy ONLY (unless Include Sunset is checked?)
    { collection: Collection.AltarsOfSorrow, text: "Altars of Sorrow", iconUrl: "", },
    { collection: Collection.PitOfHeresy, text: "Pit of Heresy", iconUrl: "", },
    { collection: Collection.Dreambane, text: "Dreambane", iconUrl: "", },
    { collection: Collection.GardenOfSalvation, text: "Garden of Salvation", iconUrl: "", },
    { collection: Collection.TheDreamingCity, text: "The Dreaming City", iconUrl: "", },
    { collection: Collection.LastWish, text: "Last Wish", iconUrl: "", },
]);
