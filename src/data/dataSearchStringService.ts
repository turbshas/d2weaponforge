import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { ref } from "vue";
import TranslationMap from "./translations/translationMap";

class CategoryIds {
    public get FramesPlug() { return "frames"; }
    public get TrackerPlug() { return "v400.plugs.weapons.masterworks.trackers"; }
    public get WeaponMasterworkPlug() { return "v400.plugs.weapons.masterworks"; }
    public get WeaponMasterworkImpact() { return "v400.plugs.weapons.masterworks.stat.damage"; }
    public get WeaponMod() { return "v400.weapon.mod_empty"; }
}

class CategoryNames {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get ModItem() { return TranslationMap[this.language].categoryNames.modItem; }
    public get WeaponIntrinsicPerk() { return TranslationMap[this.language].categoryNames.weaponIntrinsicPerk; }
    public get WeaponItem() { return TranslationMap[this.language].categoryNames.weaponItem; }
    public get WeaponModsSocket() { return TranslationMap[this.language].categoryNames.weaponModsSocket; }
    public get WeaponOriginPerk() { return TranslationMap[this.language].categoryNames.weaponOriginPerk; }
    public get WeaponPerkSocket() { return TranslationMap[this.language].categoryNames.weaponPerkSocket; }
}

class Stats {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get AccuracyStatName() { return TranslationMap[this.language].stats.accuracyStatName; }
    public get AimAssistanceStatName() { return TranslationMap[this.language].stats.aimAssistanceStatName; }
    public get AirborneEffectivenessStatName() { return TranslationMap[this.language].stats.airborneEffectivenessStatName; }
    public get BlastRadiusStatName() { return TranslationMap[this.language].stats.blastRadiusStatName; }
    public get ChargeTimeStatName() { return TranslationMap[this.language].stats.chargeTimeStatName; }
    public get DrawTimeStatName() { return TranslationMap[this.language].stats.drawTimeStatName; }
    public get MagSizeStatName() { return TranslationMap[this.language].stats.magSizeStatName; }
    public get ImpactStatName() { return TranslationMap[this.language].stats.impactStatName; }
    public get HandlingStatName() { return TranslationMap[this.language].stats.handlingStatName; }
    public get RangeStatName() { return TranslationMap[this.language].stats.rangeStatName; }
    public get RecoilDirectionStatName() { return TranslationMap[this.language].stats.recoilDirectionStatName; }
    public get ReloadSpeedStatName() { return TranslationMap[this.language].stats.reloadSpeedStatName; }
    public get RpmStatName() { return TranslationMap[this.language].stats.rpmStatName; }
    public get StabilityStatName() { return TranslationMap[this.language].stats.stabilityStatName; }
    public get VelocityStatName() { return TranslationMap[this.language].stats.velocityStatName; }
    public get ZoomStatName() { return TranslationMap[this.language].stats.zoomStatName; }
}

class Misc {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get Adept() { return TranslationMap[this.language].misc.adept; }
    public get Harrowed() { return TranslationMap[this.language].misc.harrowed; }
    public get RangefinderPerkName() { return TranslationMap[this.language].misc.rangefinderPerk; }
    public get Timelost() { return TranslationMap[this.language].misc.timelost; }
}

class TraitIds {
    public get Weapon() { return "item_type.weapon"; }
}

class WeaponArchetypes {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get Adaptive() { return TranslationMap[this.language].archetypes.adaptive; }
    public get AdaptiveBurst() { return TranslationMap[this.language].archetypes.adaptiveBurst; }
    public get Aggressive() { return TranslationMap[this.language].archetypes.aggressive; }
    public get AggressiveBurst() { return TranslationMap[this.language].archetypes.aggressiveBurst; }
    public get Caster() { return TranslationMap[this.language].archetypes.caster; }
    public get HakkePrecision() { return TranslationMap[this.language].archetypes.hakkePrecision; }
    public get HighImpact() { return TranslationMap[this.language].archetypes.highImpact; }
    public get Lightweight() { return TranslationMap[this.language].archetypes.lightweight; }
    public get OmolonAdaptive() { return TranslationMap[this.language].archetypes.omolonAdaptive; }
    public get PinpointSlug() { return TranslationMap[this.language].archetypes.pinpointSlug; }
    public get Precision() { return TranslationMap[this.language].archetypes.precision; }
    public get RapidFire() { return TranslationMap[this.language].archetypes.rapidFire; }
    public get SurosRapidFire() { return TranslationMap[this.language].archetypes.surosRapidFire; }
    public get VeistRapidFire() { return TranslationMap[this.language].archetypes.veistRapidFire; }
    public get Vortex() { return TranslationMap[this.language].archetypes.vortex; }
    public get WaveFrame() { return TranslationMap[this.language].archetypes.waveFrame; }
}

class WeaponCategoryRegex {
    public get AutoRifle() { return ".*_auto_rifle"; }
    public get Bow() { return "type_weapon_bow"; }
    public get HandCannon() { return ".*_hand_cannon"; }
    public get FusionRifle() { return "type_weapon_fusion_rifle"; }
    public get Glaive() { return ".*_glaive"; }
    public get GrenadeLauncher() { return ".*_grenade_launcher"; }
    public get LinearFusion() { return ".*_fusion_rifle_line"; }
    public get MachineGun() { return ".*_machinegun"; }
    public get PulseRifle() { return ".*_pulse_rifle"; }
    public get RocketLauncher() { return ".*_rocket_launcher"; }
    public get ScoutRifle() { return ".*_scout_rifle"; }
    public get Sidearm() { return ".*_sidearm"; }
    public get Shotgun() { return ".*_shotgun"; }
    public get SniperRifle() { return ".*_sniper_rifle"; }
    public get Submachinegun() { return ".*_submachinegun"; }
    public get Sword() { return "type_weapon_sword"; }
    public get TraceRifle() { return ".*_beam_rifle"; }
}

class DataSearchStringService {
    private readonly language = ref<DestinyManifestLanguage>("en");

    private readonly _categoryIds = new CategoryIds();
    private readonly _categoryNames = new CategoryNames(this.language.value);
    private readonly _stats = new Stats(this.language.value);
    private readonly _misc = new Misc(this.language.value);
    private readonly _traitIds = new TraitIds();
    private readonly _weaponArchetypes = new WeaponArchetypes(this.language.value);
    private readonly _weaponCategoryRegex = new WeaponCategoryRegex();

    public setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public get CategoryIDs() { return this._categoryIds; }
    public get CategoryNames() { return this._categoryNames; }
    public get Stats() { return this._stats; }
    public get Misc() { return this._misc; }
    public get TraitIDs() { return this._traitIds; }
    public get WeaponArchetypes() { return this._weaponArchetypes; }
    public get WeaponCategoryRegex() { return this._weaponCategoryRegex; }
}

export const dataSearchStringService = new DataSearchStringService();
