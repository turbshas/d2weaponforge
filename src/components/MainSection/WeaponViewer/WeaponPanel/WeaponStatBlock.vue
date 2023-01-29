<script setup lang="ts">
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyItemInvestmentStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const statOrdering = [
    DataSearchStrings.Stats.Impact,
    DataSearchStrings.Stats.BlastRadius,

    DataSearchStrings.Stats.Range,
    DataSearchStrings.Stats.Accuracy,
    DataSearchStrings.Stats.Velocity,

    DataSearchStrings.Stats.Stability,
    DataSearchStrings.Stats.Handling,
    DataSearchStrings.Stats.ReloadSpeed,
    DataSearchStrings.Stats.AimAssistance,
    DataSearchStrings.Stats.AirborneEffectiveness,
    DataSearchStrings.Stats.Zoom,
    DataSearchStrings.Stats.RecoilDirection,

    DataSearchStrings.Stats.Rpm,
    DataSearchStrings.Stats.DrawTime,
    DataSearchStrings.Stats.ChargeTime,

    DataSearchStrings.Stats.MagSize,
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

