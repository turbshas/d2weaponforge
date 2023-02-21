<script setup lang="ts">
import { destinyDataService } from "@/data/services";
import { SidebarPanelSelection, type FilterCategory, type FilterPredicate, type IAppliedFilters, type ILanguageInfo, type IWeapon, type LookupMap } from "@/data/interfaces";
import { computed, defineAsyncComponent, ref } from "vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const FilterWindow = defineAsyncComponent(() => import("./Filter/FilterWindow.vue"));
const LanguageSelector = defineAsyncComponent(() => import("./LanguageSelector.vue"));

const props = defineProps<{
    sidebarPanelSelection: SidebarPanelSelection,
    searchString: string,
    appliedFilters: IAppliedFilters,
    activeFilters: Record<FilterCategory, LookupMap<string, boolean>>,
}>();

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "filtersApplied", newFilters: IAppliedFilters): void,
    (e: "filtersCleared"): void,
    (e: "languageSelected", language: ILanguageInfo): void,
}>();

const weapons = computed(() => destinyDataService.weapons);
const filters = computed(() => props.appliedFilters);
const activeFilters = computed(() => props.activeFilters);

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
        return weapons.value.filter(w => !w.isSunset).slice(0, 22);
    }

    return weapons.value
        .filter(w => !filters.value.includeSunsetWeapons || !w.isSunset)
        .filter(w => checkFilterCategoryOnWeapon(filters.value.collectionsFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.damageFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.rarityFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.weaponFilters, w))
        .filter(w => w.name.toLocaleLowerCase().includes(props.searchString.toLocaleLowerCase()));
});

const showFilterWindow = computed(() => props.sidebarPanelSelection === SidebarPanelSelection.Filters);
const showLanguageWindow = computed(() => props.sidebarPanelSelection === SidebarPanelSelection.Languages);

function checkFilterCategoryOnWeapon(category: FilterPredicate[], weapon: IWeapon) {
    return !category || category.length === 0 || category.some(predicate => predicate(weapon));
}

function onFiltersApplied(newFilters: IAppliedFilters) {
    emit("filtersApplied", newFilters);
}

function onFiltersCleared() {
    emit("filtersCleared");
}

function onFilterToggled(categoryName: FilterCategory, filterText: string, active: boolean) {
    activeFilters.value[categoryName][filterText] = active;
}

function onLanguageSelected(language: ILanguageInfo) {
    emit("languageSelected", language);
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}
</script>

<template>
    <div class="panel">
        <FilterWindow
            v-if="showFilterWindow"
            :active-filters="activeFilters"
            @filters-applied="onFiltersApplied"
            @filters-cleared="onFiltersCleared"
            @filter-toggled="onFilterToggled"
        ></FilterWindow>
        <LanguageSelector
            v-else-if="showLanguageWindow"
            @language-selected="onLanguageSelected"
        ></LanguageSelector>
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
