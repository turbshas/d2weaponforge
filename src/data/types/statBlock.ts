import type { DestinyDisplayPropertiesDefinition, DestinyItemInvestmentStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";
import type { IStatBlock, IStatInfo } from "../interfaces";
import { arrayToHashMap } from "../util";
import type { ManifestAccessor } from "./manifestAccessor";

export class StatBlock implements IStatBlock {
    public readonly statInfos: IStatInfo[];

    constructor(
        statGroup: DestinyStatGroupDefinition | undefined,
        investmentStats: DestinyItemInvestmentStatDefinition[],
        manifest: ManifestAccessor,
        ) {
        this.statInfos = getStatInfos(statGroup, investmentStats, manifest);
    }
}

function getStatInfos(
    statGroup: DestinyStatGroupDefinition | undefined,
    investmentStats: DestinyItemInvestmentStatDefinition[],
    manifest: ManifestAccessor,
    ) {
    const investmentStatMap = arrayToHashMap(investmentStats, "statTypeHash");
    const scaledStats = statGroup ? statGroup.scaledStats : [];
    const statInfos = scaledStats.map(s => {
        const statDef = manifest.getStatTypeDefinition(s.statHash);
        const statDisplayProps = statDef ? statDef.displayProperties : undefined;

        const overrideDisplay: DestinyDisplayPropertiesDefinition | undefined = statGroup
            && statGroup.overrides
            && statGroup.overrides[s.statHash]
            && statGroup.overrides[s.statHash].displayProperties;

        const displayProps = overrideDisplay || statDisplayProps;
        const scaledStats = statGroup ? statGroup.scaledStats : [];
        const scaling = scaledStats.find(scaled => scaled.statHash === s.statHash);
        const investmentStat = investmentStatMap[s.statHash];

        const statInfo: IStatInfo = {
            index: statDef ? statDef.index : -1,
            statHash: s.statHash,
            statName: displayProps ? displayProps.name : "",
            investmentValue: investmentStat ? investmentStat.value : 0,
            statDisplay: scaling,
        };
        return statInfo;
    });
    return statInfos;
}