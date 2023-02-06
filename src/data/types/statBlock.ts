import type { DestinyDisplayPropertiesDefinition, DestinyItemInvestmentStatDefinition, DestinyStatDisplayDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import type { ManifestAccessor } from "./manifestAccessor";

interface IStatInfo {
    statHash: number;
    statName: string;
    investmentValue: number;
    statDisplay: DestinyStatDisplayDefinition | undefined;
}

export class StatBlock {
    public readonly statInfos: IStatInfo[];

    constructor(
        statGroup: DestinyStatGroupDefinition | undefined,
        investmentStats: DestinyItemInvestmentStatDefinition[],
        manifest: ManifestAccessor,
        ) {
        this.statInfos = this.getStatInfos(statGroup, investmentStats, manifest);
    }

    private getStatInfos = (
        statGroup: DestinyStatGroupDefinition | undefined,
        investmentStats: DestinyItemInvestmentStatDefinition[],
        manifest: ManifestAccessor,
        ) => {
        const statInfos = investmentStats.map(s => {
            const statDef = manifest.getStatTypeDefinition(s.statTypeHash);
            const statDisplayProps = statDef ? statDef.displayProperties : undefined;

            const overrideDisplay: DestinyDisplayPropertiesDefinition | undefined = statGroup
                && statGroup.overrides
                && statGroup.overrides[s.statTypeHash]
                && statGroup.overrides[s.statTypeHash].displayProperties;

            const displayProps = overrideDisplay || statDisplayProps;
            const scaledStats = statGroup ? statGroup.scaledStats : [];
            const scaling = scaledStats.find(scaled => scaled.statHash === s.statTypeHash);

            const statInfo: IStatInfo = {
                statHash: s.statTypeHash,
                statName: displayProps ? displayProps.name : "",
                investmentValue: s.value,
                statDisplay: scaling,
            }
            return statInfo;
        });
        return statInfos;
    }
}