import type { DestinyInventoryItemDefinition, DestinyItemCategoryDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugItemCraftingRequirements, DestinySocketTypeDefinition } from "bungie-api-ts/destiny2";
import { DataSearchStrings } from "../dataSearchStringService";
import { ItemTierIndex } from "../interfaces";
import { Archetype } from "./archetype";
import type { ManifestAccessor } from "./manifestAccessor";
import { Masterwork } from "./masterwork";
import { Mod } from "./mod";
import { PerkGrid } from "./perkGrid";
import { ResolvedWeaponSockets } from "./resolvedWeaponSockets";
import type { StatBlock } from "./statBlock";

interface IResolvedPlugItem {
    craftingRequirements: DestinyPlugItemCraftingRequirements;
    currentlyCanRoll: boolean;
    item: DestinyInventoryItemDefinition;
}

interface IResolvedPlugSet {
    socketType: DestinySocketTypeDefinition | undefined;
    singleInitialItemHash: number;
    /** reusablePlugItems on the socket itself rather than from the Plug Set. */
    socketReusableItems: DestinyInventoryItemDefinition[];
    /** randomizedPlugSetHash -> Plug Set -> reusablePlugItems */
    randomizedItems: IResolvedPlugItem[];
    /** reusablePlugSetHash -> Plug Set -> reusablePlugItems */
    reusableItems: IResolvedPlugItem[];
}

export class Weapon {
    private readonly _index: number;
    private readonly _name: string;
    private readonly _description: string;
    private readonly _screenshotUrl: string;
    private readonly _iconUrl: string;
    private readonly _iconWatermarkUrl: string;
    private readonly _isAdept: boolean;
    private readonly _isSunset: boolean;
    private readonly _tierTypeIndex: number;

    private readonly _traitId: string;
    private readonly _weaponCategoryHash: number;
    private readonly _weaponCategoryName: string;
    private readonly _weaponCategoryRegex: string;

    private readonly _statBlock: StatBlock;
    private readonly _archetype: Archetype | undefined;
    private readonly _perks: PerkGrid;
    private readonly _curated: PerkGrid;
    private readonly _masterworks: Masterwork[];
    private readonly _mods: Mod[];

    // TODO: is this possible?
    private readonly season: any = null;

    constructor(manifest: ManifestAccessor, weaponItem: DestinyInventoryItemDefinition, weaponCategory: DestinyItemCategoryDefinition) {
        this._index = weaponItem.index;
        this._name = weaponItem.displayProperties.name;
        this._description = weaponItem.displayProperties.description;
        this._screenshotUrl = weaponItem.screenshot;
        this._iconUrl = weaponItem.displayProperties.icon;
        this._iconWatermarkUrl = this.getWatermarkUrl(weaponItem);
        this._isAdept = this.isWeaponAdept(weaponItem);
        this._isSunset = this.isWeaponSunset(weaponItem);
        this._tierTypeIndex = this.getWeaponTierTypeIndex(weaponItem, manifest);

        this._traitId = this.getWeaponTraitId(weaponItem);
        this._weaponCategoryHash = weaponCategory.hash;
        this._weaponCategoryName = weaponCategory.displayProperties.name;
        this._weaponCategoryRegex = weaponCategory.itemTypeRegex;

        const statGroup = weaponItem.stats && weaponItem.stats.statGroupHash
            ? manifest.getStatGroupDefinition(weaponItem.stats.statGroupHash)
            : undefined;
        this._statBlock = ;
        const resolvedWeaponSockets = new ResolvedWeaponSockets(weaponItem, manifest);
        this._archetype = resolvedWeaponSockets.intrinsic
            ? new Archetype(resolvedWeaponSockets.intrinsic, this._traitId, weaponItem.stats, manifest)
            : undefined;
        this._perks = new PerkGrid(resolvedWeaponSockets.perks);
        this._curated = new PerkGrid(resolvedWeaponSockets.curated);
        this._masterworks = resolvedWeaponSockets.masterworks.map(mw => new Masterwork(mw, statGroup, manifest));
        this._mods = resolvedWeaponSockets.mods.map(mod => new Mod(mod, manifest));
    }

    public get index() { return this._index; }
    public get name() { return this._name; }
    public get description() { return this._description; }
    public get screenshotUrl() { return this._screenshotUrl; }
    public get iconUrl() { return this._iconUrl; }
    public get iconWatermarkUrl() { return this._iconWatermarkUrl; }
    public get isAdept() { return this._isAdept; }
    public get isSunset() { return this._isSunset; }
    public get tierTypeIndex() { return this._tierTypeIndex; }

    public get traitId() { return this._traitId; }
    public get weaponCategoryHash() { return this._weaponCategoryHash; }
    public get weaponCategoryName() { return this._weaponCategoryName; }
    public get weaponCategoryRegex() { return this._weaponCategoryRegex; }

    public get archetype() { return this._archetype; }
    public get statBlock() { return this._statBlock; }
    public get perks() { return this._perks; }
    public get curated() { return this._curated; }
    public get masterworks() { return this._masterworks; }
    public get mods() { return this._mods; }

    private getWatermarkUrl = (weapon: DestinyInventoryItemDefinition) => {
        // Priority here: weapon.quality.displayVersionWatermarkIcons -> weapon.iconWatermarkShelved -> weapon.iconWatermark
        return weapon
            && (
                (
                    weapon.quality
                    && weapon.quality.displayVersionWatermarkIcons.length > 0
                    && weapon.quality.displayVersionWatermarkIcons[0]
                    && weapon.quality.displayVersionWatermarkIcons[0]
                )
                || weapon.iconWatermarkShelved
                || weapon.iconWatermark
            );
    }

    private isWeaponAdept = (weapon: DestinyInventoryItemDefinition) => {
        const name = weapon.displayProperties.name;
        return name.includes(DataSearchStrings.Misc.Adept.value)
            || name.includes(DataSearchStrings.Misc.Harrowed.value)
            || name.includes(DataSearchStrings.Misc.Timelost.value);
    }

    private isWeaponSunset = (weapon: DestinyInventoryItemDefinition) => !!weapon.iconWatermarkShelved;
    private getWeaponTierTypeIndex = (weapon: DestinyInventoryItemDefinition, manifest: ManifestAccessor) => {
        if (!weapon.inventory) return ItemTierIndex.Basic;
        const tierType = manifest.getItemTierDefinition(weapon.inventory.tierTypeHash);
        return tierType ? (tierType.index as ItemTierIndex) : ItemTierIndex.Basic;
    }
    // Archetype trait ID seems to always be last one in the list, hopefully that doesn't change.
    private getWeaponTraitId = (weapon: DestinyInventoryItemDefinition) => weapon.traitIds[weapon.traitIds.length - 1];
}
