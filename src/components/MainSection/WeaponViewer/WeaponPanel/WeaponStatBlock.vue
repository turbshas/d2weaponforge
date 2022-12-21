<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import { DataSearchString } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyInventoryItemStatDefinition } from 'bungie-api-ts/destiny2';
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
    stats: DestinyInventoryItemStatDefinition[],
    selectedPerks: (DestinyInventoryItemDefinition | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const statMap = computed(() => {
    const map: { [name: string]: DestinyInventoryItemStatDefinition } = {};
    for (const stat of props.stats) {
        const definition = getStatDefinition(stat);
        if (definition) {
            map[definition.displayProperties.name] = stat;
        }
    }
    return map;
});

const orderedStats = computed(() => {
    const ordered: DestinyInventoryItemStatDefinition[] = [];
    for(const statName of statOrdering) {
        if (statMap.value[statName]) {
            ordered.push(statMap.value[statName]);
        }
    }
    return ordered;
});

function getStatDefinition(stat: DestinyInventoryItemStatDefinition) {
    return destinyDataService.getStatDefinition(stat.statHash);
}

function getModifierForStat(stat: DestinyInventoryItemStatDefinition) {
    const bonusFromPerks = props.selectedPerks
        .filter(p => !!p)
        .map(p =>
            p!.investmentStats
                .filter(s => s.statTypeHash === stat.statHash)
                .map(s => s.value)
                .reduce((total, current) => total += current, 0))
        .reduce((total, current) => total += current, 0); 
    const bonusFromMasterwork = props.masterwork
        ? props.masterwork.investmentStats
            .filter(s => s.statTypeHash === stat.statHash)
            .map(s => selectionService.showCraftedBonus || !s.isConditionallyActive ? s.value : 0)
            .reduce((total, current) => total += current, 0)
        : 0;
    const bonusFromMod = props.mod
        ? props.mod.investmentStats
            .filter(s => s.statTypeHash === stat.statHash)
            .map(s => s.value)
            .reduce((total, current) => total += current, 0)
        : 0;
    return bonusFromPerks + bonusFromMasterwork + bonusFromMod;
}
</script>

<template>
    <div class="list">
        <WeaponStatDisplay
            v-for="stat in orderedStats"
            :key="stat.statHash"
            :definition="getStatDefinition(stat)"
            :value="stat"
            :modifier="getModifierForStat(stat)"
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

