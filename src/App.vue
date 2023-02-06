<script setup lang="ts">
import BackgroundImage from "@/assets/background.jpg";
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import { computed } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import UrlManager from "./components/UrlManager.vue";
import { destinyDataService } from "./data/destinyDataService";
import { selectionService } from "./data/selectionService";
import { PageSelection, type ILanguageInfo, type IMasterwork, type IMod, type IPerkOption, type IWeapon } from "./data/interfaces";

const selectedPage = ref(PageSelection.Home);
const selectedWeapon = ref<IWeapon | undefined>(undefined);
const selectedPerksMap = ref<{ [column: number]: IPerkOption | undefined }>({ });
const selectedMasterwork = ref<IMasterwork | undefined>(undefined);
const selectedMod = ref<IMod | undefined>(undefined);

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

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    selectedPerksMap.value[column] = perk;
    console.log("perk selected", perk);
    if (perk) {
        perk.useEnhanced = false;
    }
}

function onMasterworkChanged(masterwork: IMasterwork | undefined) {
    selectedMasterwork.value = masterwork;
}

function onModChanged(mod: IMod | undefined) {
    selectedMod.value = mod;
}

function onUrlParsed(
    page: PageSelection,
    weapon: IWeapon | undefined,
    perkOptions: (IPerkOption | undefined)[],
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined
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
            :weapon="selectedWeapon"
            :selected-perks="selectedPerks"
            :masterwork="selectedMasterwork"
            :mod="selectedMod"
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
