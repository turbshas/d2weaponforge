<script setup lang="ts">
import type { IModifiedStat, LookupMap } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
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
    const map: LookupMap<number, IModifiedStat> = {};
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
    <div class="list" aria-label="Weapon Stats">
        <WeaponStatDisplay
            v-for="stat in orderedStats"
            :key="stat.statHash"
            :display-stat="stat"
        ></WeaponStatDisplay>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.list {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
    row-gap: 0.25rem;
    column-gap: 1rem;

    @media @large-screen {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }
}
</style>

