<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import Searchbar from "./Searchbar.vue";
import SidebarPanel from "./SidebarPanel/SidebarPanel.vue";
import TabBar from "./TabBar.vue";

import { SidebarPanelSelection, type FilterCategory, type IAppliedFilters, type ILanguageInfo, type IWeapon, type LookupMap, type PageSelection } from "@/data/interfaces";
import { selectionService } from "@/data/services";
import { computed, ref } from "vue";
import LanguageButton from "./LanguageButton.vue";
import WeaponListButton from "./WeaponListButton.vue";

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "tabSelected", tab: PageSelection): void,
    (e: "languageSelected", language: ILanguageInfo): void,
    (e: "sidebarToggled", active: boolean): void,
}>();

const panelSelection = ref(SidebarPanelSelection.Weapons);
const searchString = ref("");
const selectedLanguage = computed(() => selectionService.language);

const appliedFilters = ref<IAppliedFilters>(emptyAppliedFilters());
const activeFilters = ref<Record<FilterCategory, LookupMap<string, boolean>>>(emptyActiveFilters());

const viewingFilter = computed(() => panelSelection.value === SidebarPanelSelection.Filters);
const viewingLanguages = computed(() => panelSelection.value === SidebarPanelSelection.Languages);
const viewingWeaponList = computed(() => panelSelection.value === SidebarPanelSelection.Weapons);

function onTabSelected(tab: PageSelection) {
    emit("tabSelected", tab);
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}

function onLanguageSelected(language: ILanguageInfo) {
    panelSelection.value = SidebarPanelSelection.Weapons;
    emit("languageSelected", language);
}

function onFiltersApplied(newFilters: IAppliedFilters) {
    appliedFilters.value = newFilters;
    // Clear search bar, may end up with empty results after a filter which may be confusing.
    searchString.value = "";
    panelSelection.value = SidebarPanelSelection.Weapons;
}

function onFiltersCleared() {
    appliedFilters.value = emptyAppliedFilters();
    activeFilters.value = emptyActiveFilters();
}

function onSearchChanged(newSearchString: string) {
    searchString.value = newSearchString;
    // Clear filters - if the user is searching for a specific name they probably don't need them, and empty results may be confusing.
    appliedFilters.value = emptyAppliedFilters();
    activeFilters.value = emptyActiveFilters();
}

function setPanelSelection(selection: SidebarPanelSelection) {
    const previous = panelSelection.value;
    // In narrow mode, we want to select None. In wide mode we want to select Weapons.
    // Need to simplify to make this work better
    const next = previous === selection ? SidebarPanelSelection.Default : selection;
    panelSelection.value = next;

    const wasDefault = previous === SidebarPanelSelection.Default;
    const willBeDefault = next === SidebarPanelSelection.Default;
    if (wasDefault && !willBeDefault) {
        emit("sidebarToggled", true);
    } else if (!wasDefault && willBeDefault) {
        emit("sidebarToggled", false);
    }
}

function onFilterToggled() {
    setPanelSelection(SidebarPanelSelection.Filters);
}

function onLanguagesToggled() {
    setPanelSelection(SidebarPanelSelection.Languages);
}

function onWeaponListToggled() {
    setPanelSelection(SidebarPanelSelection.Weapons);
}

function emptyAppliedFilters(): IAppliedFilters {
    return {
        includeSunsetWeapons: false,
        craftedWeapons: false,
        adeptWeapons: false,
        perkFilter: undefined,
        collectionsFilters: [],
        damageFilters: [],
        rarityFilters: [],
        weaponFilters: [],
        perkNames: [],
    };
}
function emptyActiveFilters(): Record<FilterCategory, LookupMap<string, boolean>> {
    return {
        "Archetype": {},
        "Collections": {},
        "Damage Type": {},
        "Perks": {},
        "Rarity": {},
        "Weapon": {},
    }
}
</script>

<template>
    <section class="sidebar right-border" aria-label="Side Bar">
        <header class="filter-search" aria-label="Side Bar Controls">
            <FilterButton class="right-border" :active="viewingFilter" @filter-toggled="onFilterToggled"></FilterButton>
            <Searchbar class="search" @search-changed="onSearchChanged"></Searchbar>
            <LanguageButton
                class="left-border"
                :active="viewingLanguages"
                :selected-language="selectedLanguage"
                @languages-toggled="onLanguagesToggled"
            ></LanguageButton>
            <WeaponListButton class="left-border weapon-list" :active="viewingWeaponList" @weapon-list-toggled="onWeaponListToggled"></WeaponListButton>
        </header>
        <TabBar @tab-selected="onTabSelected"></TabBar>
        <SidebarPanel
            :sidebar-panel-selection="panelSelection"
            :search-string="searchString"
            :applied-filters="appliedFilters"
            :active-filters="activeFilters"
            @weapon-selected="onWeaponSelected"
            @filters-applied="onFiltersApplied"
            @filters-cleared="onFiltersCleared"
            @language-selected="onLanguageSelected"
        ></SidebarPanel>
    </section>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.sidebar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: rgba(5, 7, 10, 0.9254901961);
}

.sidebar-section-border(@side) {
    border-@{side}-width: 1px;
    border-@{side}-style: solid;
    border-@{side}-color: hsla(0, 0%, 98%, 0.25);
    border-radius: 0;
}

.right-border {
    .sidebar-section-border(~"right");
}

.left-border {
    .sidebar-section-border(~"left");
}

.filter-search {
    display: flex;

    .sidebar-section-border(~"bottom");
}

.search {
    flex: 1;
}

@media @large-screen {
    .weapon-list {
        display: none;
    }
}
</style>
