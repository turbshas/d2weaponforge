<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { FilterCategory, FilterPredicate, IAppliedFilters, IWeapon } from "@/data/types";
import { computed, ref } from "vue";
import FilterWindow from "./Filter/FilterWindow.vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const props = defineProps<{
    viewingFilter: boolean,
    searchString: string,
}>();

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "filtersApplied"): void,
}>();

const activeFilters = ref<Record<FilterCategory, { [filterText: string]: boolean }>>({
    "Archetype": {},
    "Collections": {},
    "Damage Type": {},
    "Rarity": {},
    "Weapon": {},
});

const filters = ref<IAppliedFilters>({
    includeSunsetWeapons: false,
    collectionsFilters: [],
    damageFilters: [],
    rarityFilters: [],
    weaponFilters: [],
    perkNames: [],
});

const weapons = computed(() => {
    return destinyDataService.weapons;
});

const areFiltersChosen = computed(() => {
    return filters.value.includeSunsetWeapons
        || filters.value.collectionsFilters.length > 0
        || filters.value.damageFilters.length > 0
        || filters.value.rarityFilters.length > 0
        || filters.value.weaponFilters.length > 0
        || filters.value.perkNames.length > 0;
});

const filteredWeapons = computed(() => {
    // If no filter or search, return truncated list
    if (!areFiltersChosen.value && !props.searchString) {
        return weapons.value.filter(w => !isWeaponSunset(w)).slice(0, 22);
    }

    return weapons.value
        .filter(w => !filters.value.includeSunsetWeapons || !isWeaponSunset(w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.collectionsFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.damageFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.rarityFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.weaponFilters, w))
        .filter(s => s.weapon.displayProperties.name.toLocaleLowerCase().includes(props.searchString.toLocaleLowerCase()));
});

function isWeaponSunset(weapon: IWeapon) {
    return !!weapon.weapon.iconWatermarkShelved;
}

function checkFilterCategoryOnWeapon(category: FilterPredicate[], weapon: IWeapon) {
    return !category || category.length === 0 || category.some(predicate => predicate(weapon));
}

function onFiltersApplied(newFilters: IAppliedFilters) {
    filters.value = newFilters;
    emit("filtersApplied");
}

function onFilterToggled(categoryName: FilterCategory, filterText: string, active: boolean) {
    activeFilters.value[categoryName][filterText] = active;
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}
</script>

<template>
    <div class="panel">
        <FilterWindow
            v-if="viewingFilter"
            :active-filters="activeFilters"
            @filters-applied="onFiltersApplied"
            @filter-toggled="onFilterToggled"
        ></FilterWindow>
        <WeaponList v-else :weapons="filteredWeapons" @entry-clicked="onWeaponSelected"></WeaponList>
    </div>
</template>

<style scoped>
.panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
