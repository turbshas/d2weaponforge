<script setup lang="ts">
import LowResBackgroundImage from "@/assets/background_low_res.jpg";
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import UrlManager from "./components/UrlManager.vue";
import { destinyDataService } from "./data/services";
import { selectionService } from "./data/services";
import { PageSelection, type ILanguageInfo, type IMasterwork, type IMod, type IPerkOption, type IWeapon, type PerkColumnNumber, type ISelectedPerkMap, type ISelectedPerk } from "./data/interfaces";
import { computed, ref } from "vue";

const selectedPage = ref(PageSelection.Home);
const selectedGear = computed(() => selectionService.selectedGear);

const backgroundUrl = computed(() => LowResBackgroundImage);

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onWeaponSelected(weapon: IWeapon | undefined) {
    selectedPage.value = PageSelection.Weapon;
    selectionService.setWeapon(weapon);

    console.log("weapon selected", weapon);
}

function onLanguageSelected(language: ILanguageInfo) {
    selectionService.language = language;
    destinyDataService.refreshGameData(language);
}

function onPerkSelected(column: PerkColumnNumber, perk: IPerkOption | undefined) {
    selectionService.setPerk(column, perk);
    console.log("perk selected", perk);
}

function onMasterworkChanged(masterwork: IMasterwork | undefined) {
    selectionService.setMasterwork(masterwork);
}

function onModChanged(mod: IMod | undefined) {
    selectionService.setMod(mod);
}

function onUrlParsed(
    page: PageSelection,
    weapon: IWeapon | undefined,
    perkOptions: ISelectedPerkMap<ISelectedPerk>,
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined
) {
    selectedPage.value = page;
    selectionService.setWeapon(weapon);
    if (!weapon) {
        return;
    }

    selectedPage.value = PageSelection.Weapon;
    selectionService.setPerks(perkOptions);
    selectionService.setMasterwork(masterwork);
    selectionService.setMod(mod);
}
</script>

<template>
    <div class="app" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <UrlManager
            :page="selectedPage"
            :selected-gear="selectedGear"
            @url-parsed="onUrlParsed"
        ></UrlManager>
        <Sidebar
            class="sidebar"
            @tab-selected="onTabSelected"
            @weapon-selected="onWeaponSelected"
            @language-selected="onLanguageSelected"
        ></Sidebar>
        <div class="main">
            <MainPage
                :page="selectedPage"
                :selected-gear="selectedGear"
                @perk-selected="onPerkSelected"
                @masterwork-changed="onMasterworkChanged"
                @mod-changed="onModChanged"
            ></MainPage>
        </div>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-size: cover;
}

.sidebar {
    width: 460px;
    height: 100vh;
    overflow: hidden;
}
@media screen and (min-width: 1200px) {
    .sidebar {
        width: 360px;
    }
}
@media screen and (min-width: 1920px) {
    .sidebar {
        width: 460px;
    }
}

.main {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
