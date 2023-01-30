import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2"
import type { IDataSearchStrings } from "./schemas";
import TranslationsDE from "./maps/translations.de";
import TranslationsEN from "./maps/translations.en";
import TranslationsES from "./maps/translations.es";
import TranslationsES_MX from "./maps/translations.es-mx";
import TranslationsFR from "./maps/translations.fr";
import TranslationsIT from "./maps/translations.it";
import TranslationsJA from "./maps/translations.ja";
import TranslationsKO from "./maps/translations.ko";
import TranslationsPL from "./maps/translations.pl";
import TranslationsPT_BR from "./maps/translations.pt-br";
import TranslationsRU from "./maps/translations.ru";
import TranslationsZH_CHS from "./maps/translations.zh-chs";
import TranslationsZH_CHT from "./maps/translations.zh-cht";

const map: { [language in DestinyManifestLanguage]: IDataSearchStrings } = {
    "de": TranslationsDE,
    "en": TranslationsEN,
    "es": TranslationsES,
    "es-mx": TranslationsES_MX,
    "fr": TranslationsFR,
    "it": TranslationsIT,
    "ja": TranslationsJA,
    "ko": TranslationsKO,
    "pl": TranslationsPL,
    "pt-br": TranslationsPT_BR,
    "ru": TranslationsRU,
    "zh-chs": TranslationsZH_CHS,
    "zh-cht": TranslationsZH_CHT,
}

export default map;
