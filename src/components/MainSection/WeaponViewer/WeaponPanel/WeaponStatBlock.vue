<script setup lang="ts">
import { StatIndex, type IModifiedStat } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import WeaponStatDisplay from './WeaponStatDisplay/WeaponStatDisplay.vue';

const statOrdering = computed(() => [
    StatIndex.Impact,
    StatIndex.BlastRadius,

    StatIndex.Range,
    StatIndex.Accuracy,
    StatIndex.Velocity,

    StatIndex.ShieldDuration,
    StatIndex.Stability,
    StatIndex.Handling,
    StatIndex.ReloadSpeed,
    StatIndex.AimAssistance,
    StatIndex.AirborneEffectiveness,
    StatIndex.Zoom,
    StatIndex.RecoilDirection,

    StatIndex.SwingSpeed,
    StatIndex.ChargeRate,
    StatIndex.GuardEfficiency,
    StatIndex.GuardResistance,
    StatIndex.GuardEndurance,

    StatIndex.Rpm,
    StatIndex.DrawTime,
    StatIndex.ChargeTime,

    StatIndex.MagSize,
    StatIndex.AmmoCapacity,
    StatIndex.InventorySize,
]);

const props = defineProps<{
    displayStats: IModifiedStat[],
}>();

const orderedStats = computed(() => {
    const workingStatList: (IModifiedStat | undefined)[] = statOrdering.value.map(_ => undefined);

    for (const statInfo of props.displayStats) {
        const index = statOrdering.value.findIndex(index => index === statInfo.index);
        if (index < 0) continue;
        // Some weapons (e.g. swords) have stats that appear in their scaledStats list but not their investmentStats.
        workingStatList[index] = statInfo;
    }

    return workingStatList.filter(s => !!s).map(s => s!);
});
</script>

<template>
    <section class="list" aria-label="Weapon Stats">
        <WeaponStatDisplay
            v-for="stat in orderedStats"
            :key="stat.statHash"
            :display-stat="stat"
        ></WeaponStatDisplay>
    </section>
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

