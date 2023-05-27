import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { computed, ref, type Ref } from "vue";
import { EnglishLanguageIndex, LanguageInfos } from "../constants";
import type { ItemHash } from "../interfaces";
import TranslationMap from "../translations/translationMap";

class Misc {
    constructor(private readonly languageRef: Ref<DestinyManifestLanguage>) {}

    public Adept = computed(() => TranslationMap[this.languageRef.value].misc.adept);
    public Harrowed = computed(() => TranslationMap[this.languageRef.value].misc.harrowed);
    public get DrangIntrinsicHash() { return 1282254042; }
    public get MidaMiniToolIntrinsicHash() { return 2213377102; }
    public get RangefinderPerkHash() { return 2846385770 as ItemHash; }
    public Timelost = computed(() => TranslationMap[this.languageRef.value].misc.timelost);
}

export class DataSearchStrings {
    private static readonly language = ref<DestinyManifestLanguage>("en");

    private static readonly _misc = new Misc(this.language);

    public static get DefaultLanguage() { return LanguageInfos.value[EnglishLanguageIndex.value]; }
    public static get Languages() { return LanguageInfos.value; }

    public static setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public static get Misc() { return this._misc; }
}
