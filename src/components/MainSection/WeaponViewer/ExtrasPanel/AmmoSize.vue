<script setup lang="ts">
import { WeaponCategoryAmmoSizeValuesMap } from '@/data/curatedData/WeaponFormulas';
import type { ISelectedGear } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const MagSizeStatIndex = DataSearchStrings.StatIndices.MagSize;
const InventorySizeStatIndex = DataSearchStrings.StatIndices.InventorySize;

const weapon = computed(() => props.selectedGear.weapon.value);

const ammoSizeValues = computed(() => weapon.value ? WeaponCategoryAmmoSizeValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);

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

// TODO: from perks e.g. reservoir burst
const magSizeMultiplier = computed(() => 1);
const magSizeAdder = computed(() => 0);

const magSize = computed(() => {
    const adjustedRaw = Math.ceil(rawMagSize.value);
    const modified = (adjustedRaw * magSizeMultiplier.value) + magSizeAdder.value;
    const size = Math.ceil(modified);
    return Math.max(1, size);
});

const reservesSize = computed(() => {
    if (!ammoSizeValues.value) return 0;
    const reservesCalc = ammoSizeValues.value.reservesCalc;
    return reservesCalc(rawMagSize.value, magSizeStat.value, inventorySizeStat.value);
});
</script>

<template>
    <div>
        Reserves: {{ reservesSize }}
    </div>
</template>

<style scoped>
</style>
