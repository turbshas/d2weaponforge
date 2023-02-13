<script setup lang="ts">
import { DataSearchStrings } from '@/data/dataSearchStringService';
import type { IModifiedStat } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const statOrdering = computed(() => [
    DataSearchStrings.Stats.Impact.value,
    DataSearchStrings.Stats.BlastRadius.value,

    DataSearchStrings.Stats.Range.value,
    DataSearchStrings.Stats.Accuracy.value,
    DataSearchStrings.Stats.Velocity.value,

    DataSearchStrings.Stats.ShieldDuration.value,
    DataSearchStrings.Stats.Stability.value,
    DataSearchStrings.Stats.Handling.value,
    DataSearchStrings.Stats.ReloadSpeed.value,
    DataSearchStrings.Stats.AimAssistance.value,
    DataSearchStrings.Stats.AirborneEffectiveness.value,
    DataSearchStrings.Stats.Zoom.value,
    DataSearchStrings.Stats.RecoilDirection.value,

    DataSearchStrings.Stats.SwingSpeed.value,
    DataSearchStrings.Stats.ChargeRate.value,
    DataSearchStrings.Stats.GuardEfficiency.value,
    DataSearchStrings.Stats.GuardResistance.value,
    DataSearchStrings.Stats.GuardEndurance.value,

    DataSearchStrings.Stats.Rpm.value,
    DataSearchStrings.Stats.DrawTime.value,
    DataSearchStrings.Stats.ChargeTime.value,

    DataSearchStrings.Stats.MagSize.value,
    DataSearchStrings.Stats.AmmoCapacity.value,
    DataSearchStrings.Stats.InventorySize,
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
        const index = statOrdering.value.findIndex(name => name === statInfo.statName);
        if (index < 0) continue;
        // Some weapons (e.g. swords) have stats that appear in their scaledStats list but not their investmentStats.
        workingStatList[index] = statInfoMap.value[statInfo.statHash] || defaultStatInfo(statInfo.statHash);
    }

    return workingStatList.filter(s => !!s).map(s => s!);
});

function defaultStatInfo(statHash: number): IModifiedStat {
    return {
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

