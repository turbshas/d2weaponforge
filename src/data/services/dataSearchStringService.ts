import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { computed, ref, type Ref } from "vue";
import { EnglishLanguageIndex, LanguageInfos } from "../constants";
import type { ItemHash, WeaponCategoryRegex } from "../interfaces";
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

class WeaponCategoryRegexes {
    public get AutoRifle(): WeaponCategoryRegex { return ".*_auto_rifle"; }
    public get Bow(): WeaponCategoryRegex { return "type_weapon_bow"; }
    public get HandCannon(): WeaponCategoryRegex { return ".*_hand_cannon"; }
    public get FusionRifle(): WeaponCategoryRegex { return "type_weapon_fusion_rifle"; }
    public get Glaive(): WeaponCategoryRegex { return ".*_glaive"; }
    public get GrenadeLauncher(): WeaponCategoryRegex { return ".*_grenade_launcher"; }
    public get LinearFusion(): WeaponCategoryRegex { return ".*_fusion_rifle_line"; }
    public get MachineGun(): WeaponCategoryRegex { return ".*_machinegun"; }
    public get PulseRifle(): WeaponCategoryRegex { return ".*_pulse_rifle"; }
    public get RocketLauncher(): WeaponCategoryRegex { return ".*_rocket_launcher"; }
    public get ScoutRifle(): WeaponCategoryRegex { return ".*_scout_rifle"; }
    public get Sidearm(): WeaponCategoryRegex { return ".*_sidearm"; }
    public get Shotgun(): WeaponCategoryRegex { return ".*_shotgun"; }
    public get SniperRifle(): WeaponCategoryRegex { return ".*_sniper_rifle"; }
    public get SubmachineGun(): WeaponCategoryRegex { return ".*_submachinegun"; }
    public get Sword(): WeaponCategoryRegex { return "type_weapon_sword"; }
    public get TraceRifle(): WeaponCategoryRegex { return ".*_beam_rifle"; }
}

export class DataSearchStrings {
    private static readonly language = ref<DestinyManifestLanguage>("en");

    private static readonly _misc = new Misc(this.language);
    private static readonly _weaponCategoryRegex = new WeaponCategoryRegexes();

    public static get DefaultLanguage() { return LanguageInfos.value[EnglishLanguageIndex.value]; }
    public static get Languages() { return LanguageInfos.value; }

    public static setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public static get Misc() { return this._misc; }
    public static get WeaponCategoryRegex() { return this._weaponCategoryRegex; }
}
