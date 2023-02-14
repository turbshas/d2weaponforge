<script setup lang="ts">
import { DataSearchStrings } from '@/data/services';
import type { IModifiedStat } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const statOrdering = computed(() => [
    DataSearchStrings.StatIndices.Impact,
    DataSearchStrings.StatIndices.BlastRadius,

    DataSearchStrings.StatIndices.Range,
    DataSearchStrings.StatIndices.Accuracy,
    DataSearchStrings.StatIndices.Velocity,

    DataSearchStrings.StatIndices.ShieldDuration,
    DataSearchStrings.StatIndices.Stability,
    DataSearchStrings.StatIndices.Handling,
    DataSearchStrings.StatIndices.ReloadSpeed,
    DataSearchStrings.StatIndices.AimAssistance,
    DataSearchStrings.StatIndices.AirborneEffectiveness,
    DataSearchStrings.StatIndices.Zoom,
    DataSearchStrings.StatIndices.RecoilDirection,

    DataSearchStrings.StatIndices.SwingSpeed,
    DataSearchStrings.StatIndices.ChargeRate,
    DataSearchStrings.StatIndices.GuardEfficiency,
    DataSearchStrings.StatIndices.GuardResistance,
    DataSearchStrings.StatIndices.GuardEndurance,

    DataSearchStrings.StatIndices.Rpm,
    DataSearchStrings.StatIndices.DrawTime,
    DataSearchStrings.StatIndices.ChargeTime,

    DataSearchStrings.StatIndices.MagSize,
    DataSearchStrings.StatIndices.AmmoCapacity,
    DataSearchStrings.StatIndices.InventorySize,
]);

const props = defineProps<{
    displayStats: IModifiedStat[],
}>();

const statInfoMap = computed(() => {
    const map: { [statHash: number]: IModifiedStat | undefined } = {};
    for (const stat of props.displayStats) {
        map[stat.statHash] = stat;
    }
    return map;
});

const orderedStats = computed(() => {
    const workingStatList: (IModifiedStat | undefined)[] = statOrdering.value.map(_ => undefined);

    for (const statInfo of props.displayStats) {
        const index = statOrdering.value.findIndex(index => index === statInfo.index);
        if (index < 0) continue;
        // Some weapons (e.g. swords) have stats that appear in their scaledStats list but not their investmentStats.
        workingStatList[index] = statInfoMap.value[statInfo.statHash] || defaultStatInfo(statInfo.statHash);
    }

    return workingStatList.filter(s => !!s).map(s => s!);
});

function defaultStatInfo(statHash: number): IModifiedStat {
    return {
        index: -1,
        statHash: statHash,
        statName: "",
        statDisplay: undefined,
        baseStat: 0,
        modifiedStat: 0,
    };
}
</script>

<template>
    <div class="list">
        <WeaponStatDisplay
            v-for="stat in orderedStats"
            :key="stat.statHash"
            :display-stat="stat"
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

