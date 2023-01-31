import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import { ref, type Ref } from "vue";
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
    public get WeaponModEmpty() { return "v400.weapon.mod_empty"; }
    public get WeaponModGuns() { return "v400.weapon.mod_guns"; }
    public get WeaponModDamage() { return "v400.weapon.mod_damage"; }
    public get WeaponModMagazine() { return "v400.weapon.mod_magazine"; }
}

class Stats {
    constructor(private readonly languageRef: Ref<DestinyManifestLanguage>) {}

    public get Accuracy() { return TranslationMap[this.languageRef.value].stats.accuracy; }
    public get AimAssistance() { return TranslationMap[this.languageRef.value].stats.aimAssistance; }
    public get AirborneEffectiveness() { return TranslationMap[this.languageRef.value].stats.airborneEffectiveness; }
    public get AmmoCapacity() { return TranslationMap[this.languageRef.value].stats.ammoCapacity; }
    public get BlastRadius() { return TranslationMap[this.languageRef.value].stats.blastRadius; }
    public get ChargeRate() { return TranslationMap[this.languageRef.value].stats.chargeRate; }
    public get ChargeTime() { return TranslationMap[this.languageRef.value].stats.chargeTime; }
    public get DrawTime() { return TranslationMap[this.languageRef.value].stats.drawTime; }
    public get GuardEfficiency() { return TranslationMap[this.languageRef.value].stats.guardEfficiency; }
    public get GuardEndurance() { return TranslationMap[this.languageRef.value].stats.guardEndurance; }
    public get GuardResistance() { return TranslationMap[this.languageRef.value].stats.guardResistance; }
    public get Handling() { return TranslationMap[this.languageRef.value].stats.handling; }
    public get Impact() { return TranslationMap[this.languageRef.value].stats.impact; }
    public get MagSize() { return TranslationMap[this.languageRef.value].stats.magSize; }
    public get Range() { return TranslationMap[this.languageRef.value].stats.range; }
    public get RecoilDirection() { return TranslationMap[this.languageRef.value].stats.recoilDirection; }
    public get ReloadSpeed() { return TranslationMap[this.languageRef.value].stats.reloadSpeed; }
    public get Rpm() { return TranslationMap[this.languageRef.value].stats.rpm; }
    public get ShieldDuration() { return TranslationMap[this.languageRef.value].stats.shieldDuration; }
    public get Stability() { return TranslationMap[this.languageRef.value].stats.stability; }
    public get SwingSpeed() { return TranslationMap[this.languageRef.value].stats.swingSpeed; }
    public get Velocity() { return TranslationMap[this.languageRef.value].stats.velocity; }
    public get Zoom() { return TranslationMap[this.languageRef.value].stats.zoom; }
}

class Misc {
    constructor(private readonly languageRef: Ref<DestinyManifestLanguage>) {}

    public get Adept() { return TranslationMap[this.languageRef.value].misc.adept; }
    public get DrangName() { return "Drang"; }
    public get Harrowed() { return TranslationMap[this.languageRef.value].misc.harrowed; }
    public get MidaMiniToolName() { return "Mini-Tool"; }
    public get RangefinderPerkName() { return TranslationMap[this.languageRef.value].misc.rangefinderPerk; }
    public get Timelost() { return TranslationMap[this.languageRef.value].misc.timelost; }
}

class TraitIds {
    public get Weapon() { return "item_type.weapon"; }
    public get AutoRifle() { return "weapon_type.auto_rifle"; }
    public get Bow() { return "weapon_type.bow"; }
    public get FusionRifle() { return "weapon_type.fusion_rifle"; }
    public get Glaive() { return "weapon_type.glaive"; }
    public get GrenadeLauncher() { return "weapon_type.grenade_launcher"; }
    public get HandCannon() { return "weapon_type.hand_cannon"; }
    public get LinearFusion() { return "weapon_type.linear_fusion_rifle"; }
    public get MachineGun() { return "weapon_type.machinegun"; }
    public get PulseRifle() { return "weapon_type.pulse_rifle"; }
    public get RocketLauncher() { return "weapon_type.rocket_launcher"; }
    public get ScoutRifle() { return "weapon_type.scout_rifle"; }
    public get Shotgun() { return "weapon_type.shotgun"; }
    public get Sidearm() { return "weapon_type.sidearm"; }
    public get SniperRifle() { return "weapon_type.sniper_rifle"; }
    public get SubmachineGun() { return "weapon_type.submachinegun"; }
    public get Sword() { return "weapon_type.sword"; }
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
    public get SubmachineGun() { return ".*_submachinegun"; }
    public get Sword() { return "type_weapon_sword"; }
    public get TraceRifle() { return ".*_beam_rifle"; }
}

export class DataSearchStrings {
    private static readonly language = ref<DestinyManifestLanguage>("en");

    private static readonly _categoryIds = new CategoryIds();
    private static readonly _stats = new Stats(this.language);
    private static readonly _misc = new Misc(this.language);
    private static readonly _traitIds = new TraitIds();
    private static readonly _weaponCategoryRegex = new WeaponCategoryRegex();

    public static setLanguage = (language: DestinyManifestLanguage) => {
        this.language.value = language;
    }

    public static get CategoryIDs() { return this._categoryIds; }
    public static get Stats() { return this._stats; }
    public static get Misc() { return this._misc; }
    public static get TraitIDs() { return this._traitIds; }
    public static get WeaponCategoryRegex() { return this._weaponCategoryRegex; }
}
