<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import Searchbar from "./Searchbar.vue";
import TabBar from "./TabBar.vue";
import SidebarPanel from "./SidebarPanel/SidebarPanel.vue";

import type { IWeapon, PageSelection } from "@/data/types";
import { ref } from "@vue/reactivity";

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
    (e: "tabSelected", tab: PageSelection): void,
}>();

const viewingFilter = ref(false);
const searchString = ref("");

function onTabSelected(tab: PageSelection) {
    emit("tabSelected", tab);
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}

function onFilterToggled() {
    viewingFilter.value = !viewingFilter.value;
}

function onSearchChanged(newSearchString: string) {
    searchString.value = newSearchString;
}
</script>

<template>
    <div class="sidebar">
        <div class="filter-search">
            <FilterButton :active="viewingFilter" @filter-toggled="onFilterToggled"></FilterButton>
            <Searchbar @search-changed="onSearchChanged"></Searchbar>
        </div>
        <TabBar @tab-selected="onTabSelected"></TabBar>
        <SidebarPanel :viewing-filter="viewingFilter" :search-string="searchString" @weapon-selected="onWeaponSelected"></SidebarPanel>
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

.filter-search {
    display: flex;

    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: hsla(0, 0%, 98%, 0.25);
}
</style>
