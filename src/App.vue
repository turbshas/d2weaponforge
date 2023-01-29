<script setup lang="ts">
import BackgroundImage from "@/assets/background.jpg";
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import { computed } from "@vue/reactivity";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { onMounted, ref } from "vue";
import UrlManager from "./components/UrlManager.vue";
import { destinyDataService } from "./data/destinyDataService";
import { PageSelection, type IPerkOption, type IWeapon } from "./data/types";

const selectedPage = ref(PageSelection.Home);
const selectedWeapon = ref<IWeapon | undefined>(undefined);
const selectedPerksMap = ref<{ [column: number]: IPerkOption | undefined }>({ });
const selectedMasterwork = ref<DestinyInventoryItemDefinition | undefined>(undefined);
const selectedMod = ref<DestinyInventoryItemDefinition | undefined>(undefined);

const selectedPerks = computed(() => [selectedPerksMap.value[0], selectedPerksMap.value[1], selectedPerksMap.value[2], selectedPerksMap.value[3], selectedPerksMap.value[4]]);

onMounted(() => {
    destinyDataService.initialize();
});

const backgroundUrl = computed(() => BackgroundImage);

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onWeaponSelected(weapon: IWeapon | undefined) {
    selectedPage.value = PageSelection.Weapon;
    selectedWeapon.value = weapon;
    selectedPerksMap.value = {};
    selectedMasterwork.value = undefined;
    selectedMod.value = undefined;
    if (weapon && weapon.weapon.sockets) {
        console.log("weapon selected", weapon, weapon.weapon.sockets.socketEntries.map(se => se.reusablePlugItems.map(pi => destinyDataService.getItemDefinition(pi.plugItemHash))));
    }
}

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    selectedPerksMap.value[column] = perk;
    if (perk) {
        perk.useEnhanced = false;
    }
}

function onMasterworkChanged(masterwork: DestinyInventoryItemDefinition | undefined) {
    selectedMasterwork.value = masterwork;
}

function onModChanged(mod: DestinyInventoryItemDefinition | undefined) {
    selectedMod.value = mod;
}

function onUrlParsed(
    page: PageSelection,
    weapon: IWeapon | undefined,
    perkOptions: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined
) {
    selectedPage.value = page;
    selectedWeapon.value = weapon;
    selectedPerksMap.value = {};
    selectedMasterwork.value = undefined;
    selectedMod.value = undefined;
    if (!weapon) {
        return;
    }

    selectedPage.value = PageSelection.Weapon;
    for (let i = 0; i < perkOptions.length; i++) {
        selectedPerksMap.value[i] = perkOptions[i];
    }
    selectedMasterwork.value = masterwork;
    selectedMod.value = mod;
}
</script>

<template>
    <div class="app" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <UrlManager
            :page="selectedPage"
            :weapon="selectedWeapon?.weapon"
            :selected-perks="selectedPerks"
            :masterwork="selectedMasterwork"
            :mod="selectedMod"
            @url-parsed="onUrlParsed"
        ></UrlManager>
        <Sidebar class="sidebar" @tab-selected="onTabSelected" @weapon-selected="onWeaponSelected"></Sidebar>
        <MainPage
            class="main"
            :page="selectedPage"
            :weapon="selectedWeapon"
            :selected-perks="selectedPerks"
            :masterwork="selectedMasterwork"
            :mod="selectedMod"
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
    width: 460px;
}

.main {
    flex: 1;
}
</style>
