<script setup lang="ts">
import CalculationDisplay from '@/components/Common/CalculationDisplay.vue';
import ExtrasListItem from '@/components/Common/ExtrasListItem.vue';
import { WeaponCategoryReloadValuesMap, WeaponCategoryValuesArchetypeOverrideMap, WeaponCategoryValuesExoticOverrideMap } from '@/data/curatedData/WeaponFormulas';
import { StatIndex, type ISelectedGear } from '@/data/interfaces';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const ReloadSpeedStatIndex = StatIndex.ReloadSpeed;

const weapon = computed(() => props.selectedGear.weapon.value);
const weaponHash = computed(() => weapon.value ? weapon.value.hash : 0);
const archetypeHash = computed(() => weapon.value && weapon.value.archetype ? weapon.value.archetype.intrinsicPerkHash : 0);

const exoticOverride = computed(() => WeaponCategoryValuesExoticOverrideMap.value[weaponHash.value]);
const archetypeOverride = computed(() => {
    if (!weapon.value) return undefined;
    const regex = weapon.value.weaponCategoryRegex;
    const archetypeMap = WeaponCategoryValuesArchetypeOverrideMap.value[regex];
    return archetypeMap && archetypeMap[archetypeHash.value];
});
const overrideValues = computed(() => exoticOverride.value || archetypeOverride.value);

const baseReloadValues = computed(() => weapon.value ? WeaponCategoryReloadValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);
const overrideReloadValues = computed(() => overrideValues.value?.reload);

const reloadSpeedValues = computed(() => overrideReloadValues.value || baseReloadValues.value);

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

const reloadSpeedText = computed(() => `${roundedReloadSpeed.value} s`);
const ammoTimeText = computed(() => `${roundedAmmoTime.value} s`);
</script>

<template>
    <ExtrasListItem label="Reload" v-if="showReloadSpeed">
        <CalculationDisplay :text="reloadSpeedText"></CalculationDisplay>
    </ExtrasListItem>
    <ExtrasListItem label="Ammo Time" v-if="showAmmoTime">
        <CalculationDisplay :text="ammoTimeText"></CalculationDisplay>
    </ExtrasListItem>
</template>

<style scoped>
</style>
