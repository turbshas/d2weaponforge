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
    public get WeaponModEmpty() { return "v400.weapon.mod_empty"; }
    public get WeaponModGuns() { return "v400.weapon.mod_guns"; }
    public get WeaponModDamage() { return "v400.weapon.mod_damage"; }
    public get WeaponModMagazine() { return "v400.weapon.mod_magazine"; }
}

class Stats {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get Accuracy() { return TranslationMap[this.language].stats.accuracy; }
    public get AimAssistance() { return TranslationMap[this.language].stats.aimAssistance; }
    public get AirborneEffectiveness() { return TranslationMap[this.language].stats.airborneEffectiveness; }
    public get AmmoCapacity() { return TranslationMap[this.language].stats.ammoCapacity; }
    public get BlastRadius() { return TranslationMap[this.language].stats.blastRadius; }
    public get ChargeRate() { return TranslationMap[this.language].stats.chargeRate; }
    public get ChargeTime() { return TranslationMap[this.language].stats.chargeTime; }
    public get DrawTime() { return TranslationMap[this.language].stats.drawTime; }
    public get GuardEfficiency() { return TranslationMap[this.language].stats.guardEfficiency; }
    public get GuardResistance() { return TranslationMap[this.language].stats.guardResistance; }
    public get Handling() { return TranslationMap[this.language].stats.handling; }
    public get Impact() { return TranslationMap[this.language].stats.impact; }
    public get MagSize() { return TranslationMap[this.language].stats.magSize; }
    public get Range() { return TranslationMap[this.language].stats.range; }
    public get RecoilDirection() { return TranslationMap[this.language].stats.recoilDirection; }
    public get ReloadSpeed() { return TranslationMap[this.language].stats.reloadSpeed; }
    public get Rpm() { return TranslationMap[this.language].stats.rpm; }
    public get Stability() { return TranslationMap[this.language].stats.stability; }
    public get SwingSpeed() { return TranslationMap[this.language].stats.swingSpeed; }
    public get Velocity() { return TranslationMap[this.language].stats.velocity; }
    public get Zoom() { return TranslationMap[this.language].stats.zoom; }
}

class Misc {
    constructor(private readonly language: DestinyManifestLanguage) {}

    public get Adept() { return TranslationMap[this.language].misc.adept; }
    public get DrangName() { return "Drang"; }
    public get Harrowed() { return TranslationMap[this.language].misc.harrowed; }
    public get MidaMiniToolName() { return "Mini-Tool"; }
    public get RangefinderPerkName() { return TranslationMap[this.language].misc.rangefinderPerk; }
    public get Timelost() { return TranslationMap[this.language].misc.timelost; }
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
    private static readonly _stats = new Stats(this.language.value);
    private static readonly _misc = new Misc(this.language.value);
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
