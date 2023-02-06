<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import { SidebarPanelSelection, type FilterCategory, type FilterPredicate, type IAppliedFilters, type ILanguageInfo, type IWeapon } from "@/data/interfaces";
import { computed, ref } from "vue";
import FilterWindow from "./Filter/FilterWindow.vue";
import LanguageSelector from "./LanguageSelector.vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const props = defineProps<{
    sidebarPanelSelection: SidebarPanelSelection,
    searchString: string,
}>();

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "filtersApplied"): void,
    (e: "languageSelected", language: ILanguageInfo): void,
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
    filters.value = newFilters;
    emit("filtersApplied");
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
