<script setup lang="ts">
import Searchbar from "./Searchbar.vue";

import { SidebarPanelSelection } from "@/data/interfaces";
import { selectionService } from "@/data/services";
import { computed } from "vue";
import SidebarToggleButton from "./SidebarToggleButton.vue";

import FilterIcon from '@/assets/filter_icon.svg';
import WeaponListIcon from "@/assets/weapon_list_icon.svg";

const props = defineProps<{
    panelSelection: SidebarPanelSelection,
}>();

const emit = defineEmits<{
    (e: "panelSelected", selection: SidebarPanelSelection): void,
    (e: "searchChanged", searchString: string): void,
}>();

const selectedLanguage = computed(() => selectionService.language);

const viewingFilter = computed(() => props.panelSelection === SidebarPanelSelection.Filters);
const viewingLanguages = computed(() => props.panelSelection === SidebarPanelSelection.Languages);
const viewingWeaponList = computed(() => props.panelSelection === SidebarPanelSelection.Weapons);

function onSearchChanged(newSearchString: string) {
    emit("searchChanged", newSearchString);
}

function onFilterToggled() {
    emit("panelSelected", SidebarPanelSelection.Filters);
}

function onLanguagesToggled() {
    emit("panelSelected", SidebarPanelSelection.Languages);
}

function onWeaponListToggled() {
    emit("panelSelected", SidebarPanelSelection.Weapons);
}
</script>

<template>
    <header class="filter-search" aria-label="Side Bar Controls">
        <SidebarToggleButton
            class="right-border"
            :active="viewingFilter"
            :icon="FilterIcon"
            label="Open Filter Pane"
            icon-label="Filter Icon"
            @toggled="onFilterToggled"
        ></SidebarToggleButton>

        <Searchbar class="search" @search-changed="onSearchChanged"></Searchbar>

        <SidebarToggleButton
            class="left-border"
            :active="viewingLanguages"
            :icon="selectedLanguage.flagIcon"
            label="Open Languages Pane"
            :icon-label="`Language Image: ${selectedLanguage.text}`"
            language
            @toggled="onLanguagesToggled"
        ></SidebarToggleButton>
        <SidebarToggleButton
            class="left-border weapon-list"
            :active="viewingWeaponList"
            :icon="WeaponListIcon"
            label="Open Weapon List"
            icon-label="Weapon List Icon"
            @toggled="onWeaponListToggled"
        ></SidebarToggleButton>
    </header>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";
@import "@/assets/mixins.less";

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
