import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { IPerkBonus } from "../interfaces";
import type { ManifestAccessor } from "./manifestAccessor";

export abstract class BasicPerk {
    private readonly _name: string | undefined;
    private readonly _description: string;
    private readonly _itemTypeDisplayName: string;
    private readonly _iconUrl: string;
    private readonly _iconWatermarkUrl: string;
    private readonly _mainBonuses: IPerkBonus[];
    private readonly _adeptOrCraftedBonuses: IPerkBonus[];

    constructor(
        item: DestinyInventoryItemDefinition,
        name: string | undefined,
        manifest: ManifestAccessor,
        ) {
        this._name = name;
        this._description = item.displayProperties.description;
        this._itemTypeDisplayName = item.itemTypeDisplayName;
        this._iconUrl = item.displayProperties.icon;
        this._iconWatermarkUrl = item.iconWatermark;
        this._mainBonuses = this.getMasterworkMainBonuses(item, manifest);
        this._adeptOrCraftedBonuses = this.getMasterworkAdeptOrCraftedBonuses(item, manifest);
    }

    public get name() { return this._name; }
    public get itemTypeDisplayName() { return this._itemTypeDisplayName; }
    public get description() { return this._description; }
    public get iconUrl() { return this._iconUrl; }
    public get iconWatermarkUrl() { return this._iconWatermarkUrl; }
    public get mainBonuses() { return this._mainBonuses; }
    public get adeptOrCraftedBonuses() { return this._adeptOrCraftedBonuses; }

    private getMasterworkMainBonuses = (masterwork: DestinyInventoryItemDefinition, manifest: ManifestAccessor) => {
        return masterwork.investmentStats
            .filter(s => !s.isConditionallyActive)
            .map(s => {
                const statDef = manifest.getStatTypeDefinition(s.statTypeHash);
                const name = statDef ? statDef.displayProperties.name : "";
                const bonus: IPerkBonus = {
                    statName: name,
                    value: s.value,
                };
                return bonus;
            });
    }

    private getMasterworkAdeptOrCraftedBonuses = (masterwork: DestinyInventoryItemDefinition, manifest: ManifestAccessor) => {
        return masterwork.investmentStats
            .filter(s => !!s.isConditionallyActive)
            .map(s => {
                const statDef = manifest.getStatTypeDefinition(s.statTypeHash);
                const name = statDef ? statDef.displayProperties.name : "";
                const bonus = {
                    statName: name,
                    value: s.value,
                };
                return bonus;
            });
    }
}
