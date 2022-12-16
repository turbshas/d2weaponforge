<script setup lang="ts">
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { onMounted, ref } from "vue";
import UrlManager from "./components/UrlManager.vue";
import { destinyDataService } from "./data/destinyDataService";
import { PageSelection, type IPerkOption } from "./data/types";

const selectedPage = ref(PageSelection.Home);
const selectedWeapon = ref<DestinyInventoryItemDefinition | undefined>(undefined);
const selectedPerks = ref<(IPerkOption | undefined)[]>([undefined, undefined, undefined, undefined, undefined]);
const selectedMasterwork = ref<DestinyInventoryItemDefinition | undefined>(undefined);
const selectedMod = ref<DestinyInventoryItemDefinition | undefined>(undefined);

onMounted(() => {
    destinyDataService.initialize();
})

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onWeaponSelected(weapon: DestinyInventoryItemDefinition) {
    // TODO: Putting weapon/perk info in url
    // Put this somewhere better, capture weapon, perk, mw, and mod?
    // Can probably put it in a component and parse url during initialization, then fire events when the manifest finishes loading
    const path = `/w/${weapon.hash}`;
    window.history.pushState({ pageTitle: `D2Gunsmith - ${weapon.displayProperties.name}`, path: path, }, "", path);
    selectedPage.value = PageSelection.Weapon;
    selectedWeapon.value = weapon;
}

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    selectedPerks.value[column] = perk;
}

function onMasterworkChanged(masterwork: DestinyInventoryItemDefinition | undefined) {
    selectedMasterwork.value = masterwork;
}

function onModChanged(mod: DestinyInventoryItemDefinition | undefined) {
    selectedMod.value = mod;
}
</script>

<template>
    <div class="app">
        <UrlManager
            :weapon="selectedWeapon"
            :selected-perks="selectedPerks"
            :masterwork="selectedMasterwork"
            :mod="selectedMod"
        ></UrlManager>
        <Sidebar class="sidebar" @tab-selected="onTabSelected" @weapon-selected="onWeaponSelected"></Sidebar>
        <MainPage
            class="main"
            :page="selectedPage"
            :weapon="selectedWeapon"
            @perk-selected="onPerkSelected"
            @masterwork-changed="onMasterworkChanged"
            @mod-changed="onModChanged"
        ></MainPage>
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
