<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import { DataSearchString } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyItemInvestmentStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const statOrdering = [
    DataSearchString.ImpactStatName,
    DataSearchString.BlastRadiusStatName,

    DataSearchString.RangeStatName,
    DataSearchString.AccuracyStatName,
    DataSearchString.VelocityStatName,

    DataSearchString.StabilityStatName,
    DataSearchString.HandlingStatName,
    DataSearchString.ReloadSpeedStatName,
    DataSearchString.AimAssistanceStatName,
    DataSearchString.AirborneEffectivenessStatName,
    DataSearchString.ZoomStatName,
    DataSearchString.RecoilDirectionStatName,

    DataSearchString.RpmStatName,
    DataSearchString.DrawTimeStatName,
    DataSearchString.ChargeTimeStatName,

    DataSearchString.MagSizeStatName,
];

const props = defineProps<{
    statGroup: DestinyStatGroupDefinition | undefined,
    investmentStats: DestinyItemInvestmentStatDefinition[],
    selectedPerks: (DestinyInventoryItemDefinition | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const investmentStatMap = computed(() => {
    const map: { [name: string]: DestinyItemInvestmentStatDefinition } = {};
    for (const stat of props.investmentStats) {
        const definition = getStatDefinition(stat.statTypeHash);
        if (definition) {
            map[definition.displayProperties.name] = stat;
        }
    }
    return map;
});

const orderedInvestmentStats = computed(() => {
    const ordered: DestinyItemInvestmentStatDefinition[] = [];
    for(const statName of statOrdering) {
        if (investmentStatMap.value[statName]) {
            ordered.push(investmentStatMap.value[statName]);
        }
    }
    return ordered;
});

function getStatDefinition(statHash: number) {
    return destinyDataService.getStatDefinition(statHash);
}

function getModifierForStat(statHash: number) {
    const bonusFromPerks = props.selectedPerks
        .filter(p => !!p)
        .map(p =>
            p!.investmentStats
                .filter(s => s.statTypeHash === statHash)
                .map(s => s.value)
                .reduce((total, current) => total += current, 0))
        .reduce((total, current) => total += current, 0); 
    const bonusFromMasterwork = props.masterwork
        ? props.masterwork.investmentStats
            .filter(s => s.statTypeHash === statHash)
            .map(s => selectionService.showCraftedBonus || !s.isConditionallyActive ? s.value : 0)
            .reduce((total, current) => total += current, 0)
        : 0;
    const bonusFromMod = props.mod
        ? props.mod.investmentStats
            .filter(s => s.statTypeHash === statHash)
            .map(s => s.value)
            .reduce((total, current) => total += current, 0)
        : 0;
    return bonusFromPerks + bonusFromMasterwork + bonusFromMod;
}
</script>

<template>
    <div class="list">
        <WeaponStatDisplay
            v-for="investmentStat in orderedInvestmentStats"
            :key="investmentStat.statTypeHash"
            :stat-group="props.statGroup"
            :definition="getStatDefinition(investmentStat.statTypeHash)"
            :investment-value="investmentStat"
            :modifier="getModifierForStat(investmentStat.statTypeHash)"
        ></WeaponStatDisplay>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>

