<script setup lang="ts">
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { onMounted, ref } from "vue";
import { destinyDataService } from "./data/destinyDataService";
import { PageSelection } from "./data/enums";

const selectedPage = ref(PageSelection.Home);
const selectedWeapon = ref<DestinyInventoryItemDefinition | undefined>(undefined);

onMounted(() => {
    destinyDataService.initialize();
})

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onWeaponSelected(weapon: DestinyInventoryItemDefinition) {
    selectedPage.value = PageSelection.Weapon;
    selectedWeapon.value = weapon;
}
</script>

<template>
    <div class="app">
        <Sidebar class="sidebar" @tab-selected="onTabSelected" @weapon-selected="onWeaponSelected"></Sidebar>
        <MainPage class="main" :page="selectedPage" :weapon="selectedWeapon"></MainPage>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.sidebar {
    width: 400px;
}

.main {
    flex-grow: 1;
}
</style>
