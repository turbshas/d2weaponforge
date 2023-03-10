import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import type { IPerk, IPerkBonus } from "../interfaces";
import type { ManifestAccessor } from "./manifestAccessor";

export abstract class BasicPerk implements IPerk {
    public readonly hash: number;
    public readonly name: string;
    public readonly description: string;
    public readonly itemTypeDisplayName: string;
    public readonly iconUrl: string;
    public readonly iconWatermarkUrl: string;
    public readonly mainBonuses: IPerkBonus[];
    public readonly adeptOrCraftedBonuses: IPerkBonus[];
    public readonly categoryId: string;

    constructor(
        item: DestinyInventoryItemDefinition,
        manifest: ManifestAccessor,
        name?: string,
        description?: string,
        iconUrl?: string,
        ) {
        this.hash = item.hash;
        this.name = name || item.displayProperties.name;
        this.description = description || item.displayProperties.description;
        this.itemTypeDisplayName = item.itemTypeDisplayName;
        this.iconUrl = iconUrl || item.displayProperties.icon;
        this.iconWatermarkUrl = item.iconWatermark;
        this.mainBonuses = getBonuses(item, manifest, false);
        this.adeptOrCraftedBonuses = getBonuses(item, manifest, true);
        this.categoryId = item.plug ? item.plug.plugCategoryIdentifier : "";
    }
}

function getBonuses(masterwork: DestinyInventoryItemDefinition, manifest: ManifestAccessor, conditionallyActive: boolean) {
    return masterwork.investmentStats
        .filter(s => s.isConditionallyActive === conditionallyActive)
        .map(s => {
            const statDef = manifest.getStatTypeDefinition(s.statTypeHash);
            const name = statDef ? statDef.displayProperties.name : "";
            const bonus: IPerkBonus = {
                statHash: s.statTypeHash,
                statName: name,
                value: s.value,
            };
            return bonus;
        });
}
