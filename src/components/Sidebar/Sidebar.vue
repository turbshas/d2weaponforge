<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import Searchbar from "./Searchbar.vue";
import TabBar from "./TabBar.vue";
import SidebarPanel from "./SidebarPanel/SidebarPanel.vue";

import type { PageSelection } from "@/data/enums";
import { ref } from "@vue/reactivity";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

const emit = defineEmits(["tab-selected", "weapon-selected"]);

const viewingFilter = ref(false);

function onTabSelected(tab: PageSelection) {
    emit("tab-selected", tab);
}

function onWeaponSelected(weapon: DestinyInventoryItemDefinition) {
    emit("weapon-selected", weapon);
}
</script>

<template>
    <div class="sidebar">
        <div class="filter-search">
            <FilterButton></FilterButton>
            <Searchbar></Searchbar>
        </div>
        <TabBar @tab-selected="onTabSelected"></TabBar>
        <SidebarPanel :viewing-filter="viewingFilter" @weapon-selected="onWeaponSelected"></SidebarPanel>
    </div>
</template>

<style scoped>
.sidebar {
    width: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.filter-search {
    display: flex;
}
</style>
