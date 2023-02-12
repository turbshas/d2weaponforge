<script setup lang="ts">
import BackgroundImage from "@/assets/background.jpg";
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import { computed } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import UrlManager from "./components/UrlManager.vue";
import { destinyDataService } from "./data/destinyDataService";
import { selectionService } from "./data/selectionService";
import { PageSelection, type ILanguageInfo, type IMasterwork, type IMod, type IPerkOption, type IWeapon, type PerkColumnNumber, type ISelectedPerkMap } from "./data/interfaces";

const selectedPage = ref(PageSelection.Home);
const selectedGear = computed(() => selectionService.selectedGear);

onMounted(() => {
    destinyDataService.initialize();
});

const backgroundUrl = computed(() => BackgroundImage);

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onWeaponSelected(weapon: IWeapon | undefined) {
    selectedPage.value = PageSelection.Weapon;
    selectionService.setWeapon(weapon);

    console.log("weapon selected", weapon);
    if (weapon) {
        console.log("weapon stats", weapon.statBlock.statInfos.map(s => {
            return {
                name: s.statName,
                hash: s.statHash,
                value: s.investmentValue,
            };
        }));
    }
}

function onLanguageSelected(language: ILanguageInfo) {
    selectionService.language = language;
    destinyDataService.refreshGameData();
}

function onPerkSelected(column: PerkColumnNumber, perk: IPerkOption | undefined) {
    selectionService.setPerk(column, perk);

    console.log("perk selected", perk);
    if (perk) {
        perk.useEnhanced = false;
    }
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
    perkOptions: ISelectedPerkMap<IPerkOption>,
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
        <MainPage
            class="main"
            :page="selectedPage"
            :selected-gear="selectedGear"
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
