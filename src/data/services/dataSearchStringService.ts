import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { computed, ref, type Ref } from "vue";
import { EnglishLanguageIndex, LanguageInfos } from "../constants";
import type { ItemHash, TraitId, WeaponCategoryRegex } from "../interfaces";
import TranslationMap from "../translations/translationMap";

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
    public get ExoticMasterworkPlugComponent() { return "exotic.weapon.masterwork"; }
    public get CatalystsPlug() { return "catalysts"; }
    public get StocksPlug() { return "stocks"; }
    public get GripsPlug() { return "grips"; }

    public get WeaponMasterworkPlug() { return "v400.plugs.weapons.masterworks"; }
    public get WeaponMasterworkPlugComponent() { return "plugs.weapons.masterworks.stat"; }
    public get WeaponMasterworkImpact() { return "v400.plugs.weapons.masterworks.stat.damage"; }
    public get WeaponModEmpty() { return "v400.weapon.mod_empty"; }
    public get WeaponModGuns() { return "v400.weapon.mod_guns"; }
    public get WeaponModDamage() { return "v400.weapon.mod_damage"; }
    public get WeaponModMagazine() { return "v400.weapon.mod_magazine"; }
}

/*
class Stats {
    constructor(private readonly languageRef: Ref<DestinyManifestLanguage>) {}

    public Accuracy = computed(() => TranslationMap[this.languageRef.value].stats.accuracy);
    public AimAssistance = computed(() => TranslationMap[this.languageRef.value].stats.aimAssistance);
    public AirborneEffectiveness = computed(() => TranslationMap[this.languageRef.value].stats.airborneEffectiveness);
    public AmmoCapacity = computed(() => TranslationMap[this.languageRef.value].stats.ammoCapacity);
    public BlastRadius = computed(() => TranslationMap[this.languageRef.value].stats.blastRadius);
    public ChargeRate = computed(() => TranslationMap[this.languageRef.value].stats.chargeRate);
    public ChargeTime = computed(() => TranslationMap[this.languageRef.value].stats.chargeTime);
    public DrawTime = computed(() => TranslationMap[this.languageRef.value].stats.drawTime);
    public GuardEfficiency = computed(() => TranslationMap[this.languageRef.value].stats.guardEfficiency);
    public GuardEndurance = computed(() => TranslationMap[this.languageRef.value].stats.guardEndurance);
    public GuardResistance = computed(() => TranslationMap[this.languageRef.value].stats.guardResistance);
    public Handling = computed(() => TranslationMap[this.languageRef.value].stats.handling);
    public Impact = computed(() => TranslationMap[this.languageRef.value].stats.impact);
    public InventorySize = computed(() => "Inventory Size");
    public MagSize = computed(() => TranslationMap[this.languageRef.value].stats.magSize);
    public Range = computed(() => TranslationMap[this.languageRef.value].stats.range);
    public RecoilDirection = computed(() => TranslationMap[this.languageRef.value].stats.recoilDirection);
    public ReloadSpeed = computed(() => TranslationMap[this.languageRef.value].stats.reloadSpeed);
    public Rpm = computed(() => TranslationMap[this.languageRef.value].stats.rpm);
    public ShieldDuration = computed(() => TranslationMap[this.languageRef.value].stats.shieldDuration);
    public Stability = computed(() => TranslationMap[this.languageRef.value].stats.stability);
    public SwingSpeed = computed(() => TranslationMap[this.languageRef.value].stats.swingSpeed);
    public Velocity = computed(() => TranslationMap[this.languageRef.value].stats.velocity);
    public Zoom = computed(() => TranslationMap[this.languageRef.value].stats.zoom);
}
*/

class StatIndices {
    public get Accuracy() { return 17; }
    public get AimAssistance() { return 30; }
    public get AirborneEffectiveness() { return 43; }
    public get AmmoCapacity() { return 40; }
    public get BlastRadius() { return 21; }
    public get ChargeRate() { return 19; }
    public get ChargeTime() { return 18; }
    public get DrawTime() { return 50; }
    public get GuardEfficiency() { return 39; }
    public get GuardEndurance() { return 41; }
    public get GuardResistance() { return 38; }
    public get Handling() { return 26; }
    public get Impact() { return 15; }
    public get InventorySize() { return 25; }
    public get MagSize() { return 24; }
    public get Range() { return 16; }
    public get RecoilDirection() { return 31; }
    public get ReloadSpeed() { return 27; }
    public get Rpm() { return 14; }
    public get ShieldDuration() { return 42; }
    public get Stability() { return 22; }
    public get SwingSpeed() { return 37; }
    public get Velocity() { return 20; }
    public get Zoom() { return 32; }
}

class Misc {
    constructor(private readonly languageRef: Ref<DestinyManifestLanguage>) {}

    public Adept = computed(() => TranslationMap[this.languageRef.value].misc.adept);
    public Harrowed = computed(() => TranslationMap[this.languageRef.value].misc.harrowed);
    public get DrangIntrinsicHash() { return 1282254042; }
    public get MidaMiniToolIntrinsicHash() { return 2213377102; }
    // public RangefinderPerkName = computed(() => TranslationMap[this.languageRef.value].misc.rangefinderPerk);
    public get RangefinderPerkHash() { return 2846385770 as ItemHash; }
    public Timelost = computed(() => TranslationMap[this.languageRef.value].misc.timelost);
}

class TraitIds {
    public get Weapon(): TraitId { return "item_type.weapon"; }
    public get AutoRifle(): TraitId { return "weapon_type.auto_rifle"; }
    public get Bow(): TraitId { return "weapon_type.bow"; }
    public get FusionRifle(): TraitId { return "weapon_type.fusion_rifle"; }
    public get Glaive(): TraitId { return "weapon_type.glaive"; }
    public get GrenadeLauncher(): TraitId { return "weapon_type.grenade_launcher"; }
    public get HandCannon(): TraitId { return "weapon_type.hand_cannon"; }
    public get LinearFusion(): TraitId { return "weapon_type.linear_fusion_rifle"; }
    public get MachineGun(): TraitId { return "weapon_type.machinegun"; }
    public get PulseRifle(): TraitId { return "weapon_type.pulse_rifle"; }
    public get RocketLauncher(): TraitId { return "weapon_type.rocket_launcher"; }
    public get ScoutRifle(): TraitId { return "weapon_type.scout_rifle"; }
    public get Shotgun(): TraitId { return "weapon_type.shotgun"; }
    public get Sidearm(): TraitId { return "weapon_type.sidearm"; }
    public get SniperRifle(): TraitId { return "weapon_type.sniper_rifle"; }
    public get SubmachineGun(): TraitId { return "weapon_type.submachinegun"; }
    public get Sword(): TraitId { return "weapon_type.sword"; }

    public get ExoticCatalyst(): TraitId { return "item_type.exotic_catalyst"; }
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

    private static readonly _categoryIds = new CategoryIds();
    private static readonly _statIndices = new StatIndices();
    private static readonly _misc = new Misc(this.language);
    private static readonly _traitIds = new TraitIds();
    private static readonly _weaponCategoryRegex = new WeaponCategoryRegexes();

    public static get DefaultLanguage() { return LanguageInfos.value[EnglishLanguageIndex.value]; }
    public static get Languages() { return LanguageInfos.value; }

    public static setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public static get CategoryIDs() { return this._categoryIds; }
    public static get StatIndices() { return this._statIndices; }
    public static get Misc() { return this._misc; }
    public static get TraitIDs() { return this._traitIds; }
    public static get WeaponCategoryRegex() { return this._weaponCategoryRegex; }
}
