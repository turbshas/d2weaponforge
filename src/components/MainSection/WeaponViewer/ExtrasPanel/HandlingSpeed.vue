<script setup lang="ts">
import { WeaponCategoryHandlingValuesMap } from '@/data/curatedData/WeaponFormulas';
import type { ISelectedGear } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const HandlingStatIndex = DataSearchStrings.StatIndices.Handling;

const weapon = computed(() => props.selectedGear.weapon.value);

const handlingValues = computed(() => weapon.value ? WeaponCategoryHandlingValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);

const showHandlingTime = computed(() => !!handlingValues.value);

const allStats = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);
const handlingStat = computed(() => {
    return allStats.value
        .filter(s => s.index === HandlingStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});

const readySpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.ready.valuePerPoint;
    const offset = handlingValues.value.ready.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const adsSpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.ads.valuePerPoint;
    const offset = handlingValues.value.ads.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const stowSpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.stow.valuePerPoint;
    const offset = handlingValues.value.stow.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const roundedReadySpeed = computed(() => Math.round(readySpeed.value * 100) / 100);
const roundedAdsSpeed = computed(() => Math.round(adsSpeed.value * 100) / 100);
const roundedStowSpeed = computed(() => Math.round(stowSpeed.value * 100) / 100);
const showReadySpeed = computed(() => readySpeed.value > 0);
const showAdsSpeed = computed(() => adsSpeed.value > 0);
const showStowSpeed = computed(() => stowSpeed.value > 0);
</script>

<template>
    <div>
        Ready: {{ roundedReadySpeed }}
        ADS: {{ roundedAdsSpeed }}
        Stow: {{ roundedStowSpeed }}
    </div>
</template>

<style scoped>
</style>
