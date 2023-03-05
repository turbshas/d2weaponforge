<script setup lang="ts">
import SidebarPanel from "./SidebarPanel/SidebarPanel.vue";
import TabBar from "./TabBar.vue";

import { SidebarPanelSelection, type IAppliedFilters, type ILanguageInfo, type ISelectedFilters, type IWeapon, type PageSelection } from "@/data/interfaces";
import { ref } from "vue";

import SidebarHeader from "./SidebarHeader/SidebarHeader.vue";

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "tabSelected", tab: PageSelection): void,
    (e: "languageSelected", language: ILanguageInfo): void,
    (e: "sidebarToggled", active: boolean): void,
}>();

const panelSelection = ref(SidebarPanelSelection.Default);
const searchString = ref("");

const appliedFilters = ref<IAppliedFilters>(emptyAppliedFilters());
const selectedFilters = ref<ISelectedFilters>(emptySelectedFilters());

function onTabSelected(tab: PageSelection) {
    emit("tabSelected", tab);
}

function onWeaponSelected(weapon: IWeapon) {
    setPanelSelection(SidebarPanelSelection.Default);
    emit("weaponSelected", weapon);
}

function onLanguageSelected(language: ILanguageInfo) {
    setPanelSelection(SidebarPanelSelection.Default);
    emit("languageSelected", language);
}

function onFiltersApplied(newFilters: IAppliedFilters) {
    appliedFilters.value = newFilters;
    // Clear search bar, may end up with empty results after a filter which may be confusing.
    searchString.value = "";
    setPanelSelection(SidebarPanelSelection.Weapons);
}

function onFiltersCleared() {
    appliedFilters.value = emptyAppliedFilters();
    selectedFilters.value = emptySelectedFilters();
}

function onSearchChanged(newSearchString: string) {
    searchString.value = newSearchString;
    // Clear filters - if the user is searching for a specific name they probably don't need them, and empty results may be confusing.
    appliedFilters.value = emptyAppliedFilters();
    selectedFilters.value = emptySelectedFilters();
    // Always show weapon panel on search changes. Calling setPanelSelection will result in the panel toggling for every letter typed.
    panelSelection.value = SidebarPanelSelection.Weapons;
    emit("sidebarToggled", true);
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

function emptyAppliedFilters(): IAppliedFilters {
    return {
        includeSunsetWeapons: false,
        perkFilter: undefined,
        collectionsFilters: [],
        damageFilters: [],
        miscFilters: [],
        rarityFilters: [],
        weaponFilters: [],
        perkNames: [],
    };
}
function emptySelectedFilters(): ISelectedFilters {
    return {
        includeSunset: false,
        selectedFiltersMap: {
            "Archetype": {},
            "Collections": {},
            "Damage Type": {},
            "Misc": {},
            "Rarity": {},
            "Weapon": {},
        },
        selectedPerks: {},
    };
}
</script>

<template>
    <section class="sidebar right-border" aria-label="Side Bar">
        <SidebarHeader
            :panel-selection="panelSelection"
            @panel-selected="setPanelSelection"
            @search-changed="onSearchChanged"
        ></SidebarHeader>
        <TabBar @tab-selected="onTabSelected"></TabBar>
        <SidebarPanel
            :sidebar-panel-selection="panelSelection"
            :search-string="searchString"
            :applied-filters="appliedFilters"
            :selected-filters="selectedFilters"
            @weapon-selected="onWeaponSelected"
            @filters-applied="onFiltersApplied"
            @filters-cleared="onFiltersCleared"
            @language-selected="onLanguageSelected"
        ></SidebarPanel>
    </section>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";
@import "@/assets/mixins.less";

.sidebar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: rgba(5, 7, 10, 0.9254901961);
}

.right-border {
    .sidebar-section-border(~"right");
}
</style>
