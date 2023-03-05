<script setup lang="ts">
import { WeaponCategoryReloadValuesMap } from '@/data/curatedData/WeaponFormulas';
import type { ISelectedGear } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const ReloadSpeedStatIndex = DataSearchStrings.StatIndices.ReloadSpeed;

const weapon = computed(() => props.selectedGear.weapon.value);

const reloadSpeedValues = computed(() => weapon.value ? WeaponCategoryReloadValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);

const allStats = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);
const reloadStat = computed(() => {
    return allStats.value
        .filter(s => s.index === ReloadSpeedStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});
const ammoTimeMultiplier = computed(() => reloadSpeedValues.value ? reloadSpeedValues.value.ammoTime : 0);

const reloadSpeed = computed(() => {
    if (!reloadSpeedValues.value) return 0;
    const a = reloadSpeedValues.value.a;
    const b = reloadSpeedValues.value.b;
    const c = reloadSpeedValues.value.c;
    const reload = reloadStat.value;
    return (a * reload * reload) + (b * reload) + c;
});
const roundedReloadSpeed = computed(() => Math.round(reloadSpeed.value * 100) / 100);
const showReloadSpeed = computed(() => reloadSpeed.value > 0);

const ammoTime = computed(() => reloadSpeed.value * ammoTimeMultiplier.value);
const roundedAmmoTime = computed(() => Math.round(ammoTime.value * 100) / 100);
const showAmmoTime = computed(() => ammoTime.value > 0);
</script>

<template>
    <div>
        Reload: {{ roundedReloadSpeed }}
        Ammo Time: {{ roundedAmmoTime }}
    </div>
</template>

<style scoped>
</style>
