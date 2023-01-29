import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { ref } from "vue";
import TranslationMap from "./translations/translationMap";

class CategoryIds {
    // Weapon perk plug category IDs
    public get IntrinsicPlug() { return "intrinsics"; }

    public get BarrelsPlug() { return "barrels"; }
    public get BladesPlug() { return "blades"; }
    public get BowstringsPlug() { return "bowstrings"; }
    public get HaftsPlug() { return "hafts"; }
    public get ScopesPlug() { return "scopes"; }
    public get TubesPlug() { return "tubes"; }

    public get ArrowsPlug() { return "arrows"; }
    public get BatteriesPlug() { return "batteries"; }
    public get GuardsPlug() { return "guards"; }
    public get MagazinesPlug() { return "magazines"; }
    public get MagazinesGLPlug() { return "magazines_gl"; }

    public get FramesPlug() { return "frames"; }
    public get OriginsPlug() { return "origins"; }
    public get TrackerPlug() { return "v400.plugs.weapons.masterworks.trackers"; }
    public get ExoticMasterworkPlug() { return "v400.empty.exotic.masterwork"; }
    public get CatalystsPlug() { return "catalysts"; }
    public get StocksPlug() { return "stocks"; }

    public get WeaponMasterworkPlug() { return "v400.plugs.weapons.masterworks"; }
    public get WeaponMasterworkPlugComponent() { return "plugs.weapons.masterworks.stat"; }
    public get WeaponMasterworkImpact() { return "v400.plugs.weapons.masterworks.stat.damage"; }
    public get WeaponMod() { return "v400.weapon.mod_empty"; }
    public get WeaponModGuns() { return "v400.weapon.mod_guns"; }
    public get WeaponModDamage() { return "v400.weapon.mod_damage"; }
}

class Stats {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get Accuracy() { return TranslationMap[this.language].stats.accuracyStatName; }
    public get AimAssistance() { return TranslationMap[this.language].stats.aimAssistanceStatName; }
    public get AirborneEffectiveness() { return TranslationMap[this.language].stats.airborneEffectivenessStatName; }
    public get BlastRadius() { return TranslationMap[this.language].stats.blastRadiusStatName; }
    public get ChargeTime() { return TranslationMap[this.language].stats.chargeTimeStatName; }
    public get DrawTime() { return TranslationMap[this.language].stats.drawTimeStatName; }
    public get MagSize() { return TranslationMap[this.language].stats.magSizeStatName; }
    public get Impact() { return TranslationMap[this.language].stats.impactStatName; }
    public get Handling() { return TranslationMap[this.language].stats.handlingStatName; }
    public get Range() { return TranslationMap[this.language].stats.rangeStatName; }
    public get RecoilDirection() { return TranslationMap[this.language].stats.recoilDirectionStatName; }
    public get ReloadSpeed() { return TranslationMap[this.language].stats.reloadSpeedStatName; }
    public get Rpm() { return TranslationMap[this.language].stats.rpmStatName; }
    public get Stability() { return TranslationMap[this.language].stats.stabilityStatName; }
    public get Velocity() { return TranslationMap[this.language].stats.velocityStatName; }
    public get Zoom() { return TranslationMap[this.language].stats.zoomStatName; }
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

export class DataSearchStrings {
    private static readonly language = ref<DestinyManifestLanguage>("en");

    private static readonly _categoryIds = new CategoryIds();
    private static readonly _stats = new Stats(this.language.value);
    private static readonly _misc = new Misc(this.language.value);
    private static readonly _traitIds = new TraitIds();
    private static readonly _weaponArchetypes = new WeaponArchetypes(this.language.value);
    private static readonly _weaponCategoryRegex = new WeaponCategoryRegex();

    public static setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public static get CategoryIDs() { return this._categoryIds; }
    public static get Stats() { return this._stats; }
    public static get Misc() { return this._misc; }
    public static get TraitIDs() { return this._traitIds; }
    public static get WeaponArchetypes() { return this._weaponArchetypes; }
    public static get WeaponCategoryRegex() { return this._weaponCategoryRegex; }
}
