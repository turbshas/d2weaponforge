<script setup lang="ts">
import { SidebarPanelSelection, type FilterCategory, type FilterPredicate, type IAppliedFilters, type IFilterButton, type ILanguageInfo, type ISelectedFilters, type IWeapon, type LookupMap } from "@/data/interfaces";
import { destinyDataService } from "@/data/services";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const FilterWindow = defineAsyncComponent(() => import("./Filter/FilterWindow.vue"));
const LanguageSelector = defineAsyncComponent(() => import("./LanguageSelector.vue"));

const props = defineProps<{
    sidebarPanelSelection: SidebarPanelSelection,
    searchString: string,
    appliedFilters: IAppliedFilters,
    selectedFilters: ISelectedFilters,
}>();

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "filtersApplied", newFilters: IAppliedFilters): void,
    (e: "filtersCleared"): void,
    (e: "languageSelected", language: ILanguageInfo): void,
}>();

const limitingDisplayedWeapons = ref(true);

watch(() => props.searchString, () => { limitingDisplayedWeapons.value = true; });

const weapons = computed(() => destinyDataService.weapons || []);
const filters = computed(() => props.appliedFilters);
const selectedFilters = computed(() => props.selectedFilters);

const areFiltersChosen = computed(() => {
    return filters.value.includeSunsetWeapons
        || !!filters.value.perkFilter
        || filters.value.collectionsFilters.length > 0
        || filters.value.damageFilters.length > 0
        || filters.value.rarityFilters.length > 0
        || filters.value.weaponFilters.length > 0
        || filters.value.perkNames.length > 0;
});

const filteredWeapons = computed(() => {
    // If no filter or search, return truncated list
    if (!areFiltersChosen.value && !props.searchString) {
        return weapons.value.filter(w => !w.isSunset).slice(0, 63);
    }

    const filtered = weapons.value
        .filter(w => filters.value.includeSunsetWeapons || !w.isSunset)
        .filter(w => filters.value.perkFilter ? filters.value.perkFilter(w) : true)
        .filter(w => checkFilterCategoryOnWeapon(filters.value.collectionsFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.damageFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.miscFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.rarityFilters, w))
        .filter(w => checkFilterCategoryOnWeapon(filters.value.weaponFilters, w))
        .filter(w => w.name.toLocaleLowerCase().includes(props.searchString.toLocaleLowerCase()));
    return filtered;
});

const showFilterWindow = computed(() => props.sidebarPanelSelection === SidebarPanelSelection.Filters);
const showLanguageWindow = computed(() => props.sidebarPanelSelection === SidebarPanelSelection.Languages);
const showDefault = computed(() => props.sidebarPanelSelection === SidebarPanelSelection.Default);

function checkFilterCategoryOnWeapon(category: FilterPredicate[], weapon: IWeapon) {
    return !category || category.length === 0 || category.some(predicate => predicate(weapon));
}

function onFiltersApplied(newFilters: IAppliedFilters) {
    limitingDisplayedWeapons.value = true;
    emit("filtersApplied", newFilters);
}

function onFiltersCleared() {
    limitingDisplayedWeapons.value = true;
    emit("filtersCleared");
}

function onFilterToggled(categoryName: FilterCategory, filterText: string, filter: IFilterButton) {
    selectedFilters.value.selectedFiltersMap[categoryName][filterText] = filter;
}

function onLanguageSelected(language: ILanguageInfo) {
    emit("languageSelected", language);
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}

function onShowAllWeapons() {
    limitingDisplayedWeapons.value = false;
}
</script>

<template>
    <div class="panel" :class="{ 'default': showDefault }">
        <FilterWindow
            v-if="showFilterWindow"
            :selected-filters="selectedFilters"
            @filters-applied="onFiltersApplied"
            @filters-cleared="onFiltersCleared"
            @filter-toggled="onFilterToggled"
        ></FilterWindow>
        <LanguageSelector
            v-else-if="showLanguageWindow"
            @language-selected="onLanguageSelected"
        ></LanguageSelector>
        <WeaponList
            v-else
            :weapons="filteredWeapons"
            :limit-weapons="limitingDisplayedWeapons"
            @entry-clicked="onWeaponSelected"
            @show-all-weapons="onShowAllWeapons"
        ></WeaponList>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @media @small-screen {
        &.default {
            display: none;
        }
    }
}
</style>
