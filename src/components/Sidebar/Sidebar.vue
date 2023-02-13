<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import Searchbar from "./Searchbar.vue";
import TabBar from "./TabBar.vue";
import SidebarPanel from "./SidebarPanel/SidebarPanel.vue";

import { SidebarPanelSelection, type ILanguageInfo, type IWeapon, type PageSelection } from "@/data/interfaces";
import { computed, ref } from "vue";
import LanguageButton from "./LanguageButton.vue";
import { selectionService } from "@/data/selectionService";

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "tabSelected", tab: PageSelection): void,
    (e: "languageSelected", language: ILanguageInfo): void,
}>();

const panelSelection = ref(SidebarPanelSelection.Weapons);
const searchString = ref("");
const selectedLanguage = computed(() => selectionService.language);

const viewingFilter = computed(() => panelSelection.value === SidebarPanelSelection.Filters);
const viewingLanguages = computed(() => panelSelection.value === SidebarPanelSelection.Languages);

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

function onFiltersApplied() {
    panelSelection.value = SidebarPanelSelection.Weapons;
}

function onFilterToggled() {
    panelSelection.value = viewingFilter.value ? SidebarPanelSelection.Weapons : SidebarPanelSelection.Filters;
}

function onSearchChanged(newSearchString: string) {
    searchString.value = newSearchString;
}

function onLanguagesToggled() {
    panelSelection.value = viewingLanguages.value ? SidebarPanelSelection.Weapons : SidebarPanelSelection.Languages;
}
</script>

<template>
    <div class="sidebar">
        <div class="filter-search">
            <FilterButton class="button" :active="viewingFilter" @filter-toggled="onFilterToggled"></FilterButton>
            <Searchbar class="search" @search-changed="onSearchChanged"></Searchbar>
            <LanguageButton
                class="language"
                :active="viewingLanguages"
                :selected-language="selectedLanguage"
                @languages-toggled="onLanguagesToggled"
            ></LanguageButton>
        </div>
        <TabBar @tab-selected="onTabSelected"></TabBar>
        <SidebarPanel
            :sidebar-panel-selection="panelSelection"
            :search-string="searchString"
            @weapon-selected="onWeaponSelected"
            @filters-applied="onFiltersApplied"
            @language-selected="onLanguageSelected"
        ></SidebarPanel>
    </div>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: hsla(0, 0%, 98%, 0.25);
    background-color: rgba(5, 7, 10, 0.9254901961);
}

.button {
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: hsla(0, 0%, 98%, 0.25);
    border-radius: 0;
}

.filter-search {
    display: flex;

    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: hsla(0, 0%, 98%, 0.25);
}

.search {
    flex: 1;
}

.language {
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: hsla(0, 0%, 98%, 0.25);
    border-radius: 0;
}
</style>
