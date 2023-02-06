import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { IPerkBonus } from "../interfaces";
import type { ManifestAccessor } from "./manifestAccessor";

export abstract class BasicPerk {
    public readonly hash: number;
    public readonly name: string | undefined;
    public readonly description: string;
    public readonly itemTypeDisplayName: string;
    public readonly iconUrl: string;
    public readonly iconWatermarkUrl: string;
    public readonly mainBonuses: IPerkBonus[];
    public readonly adeptOrCraftedBonuses: IPerkBonus[];

    constructor(
        item: DestinyInventoryItemDefinition,
        name: string | undefined,
        manifest: ManifestAccessor,
        ) {
        this.hash = item.hash;
        this.name = name;
        this.description = item.displayProperties.description;
        this.itemTypeDisplayName = item.itemTypeDisplayName;
        this.iconUrl = item.displayProperties.icon;
        this.iconWatermarkUrl = item.iconWatermark;
        this.mainBonuses = this.getMasterworkMainBonuses(item, manifest);
        this.adeptOrCraftedBonuses = this.getMasterworkAdeptOrCraftedBonuses(item, manifest);
    }

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
            .filter(s => s.isConditionallyActive)
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
