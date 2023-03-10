<script setup lang="ts">
import CalculationDisplay from '@/components/Common/CalculationDisplay.vue';
import ExtrasListItem from '@/components/Common/ExtrasListItem.vue';
import { WeaponCategoryAmmoSizeValuesMap, WeaponCategoryValuesArchetypeOverrideMap, WeaponCategoryValuesExoticOverrideMap } from '@/data/curatedData/WeaponFormulas';
import { StatIndex, type ISelectedGear } from '@/data/interfaces';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const MagSizeStatIndex = StatIndex.MagSize;
const InventorySizeStatIndex = StatIndex.InventorySize;

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

const baseAmmoValues = computed(() => weapon.value ? WeaponCategoryAmmoSizeValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);
const overrideAmmoValues = computed(() => overrideValues.value?.ammo);

const ammoSizeValues = computed(() => overrideAmmoValues.value || baseAmmoValues.value);

const allStats = computed(() => props.selectedGear.modifiedWeaponStats.value);
// TODO: this value might be display stat e.g. actual number of bullets. I think I need investment stat value
const magSizeStat = computed(() => {
    return allStats.value
        .filter(s => s.index === MagSizeStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});
const inventorySizeStat = computed(() => {
    return allStats.value
        .filter(s => s.index === InventorySizeStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});

const rawMagSize = computed(() => {
    if (!ammoSizeValues.value) return 0;
    const a = ammoSizeValues.value.mag.a;
    const b = ammoSizeValues.value.mag.b;
    const c = ammoSizeValues.value.mag.c;
    const magStat = magSizeStat.value;
    return (a * magStat * magStat) + (b * magStat) + c;
});

const reservesSize = computed(() => {
    if (!ammoSizeValues.value) return 0;
    const reservesCalc = ammoSizeValues.value.reservesCalc;
    return reservesCalc(rawMagSize.value, magSizeStat.value, inventorySizeStat.value);
});

const reservesText = computed(() => `${reservesSize.value}`);
</script>

<template>
    <ExtrasListItem label="Ammo" v-if="reservesSize > 0">
        <CalculationDisplay :text="reservesText"></CalculationDisplay>
    </ExtrasListItem>
</template>

<style scoped>
</style>
