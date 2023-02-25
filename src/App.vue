<script setup lang="ts">
import LowResBackgroundImage from "@/assets/background_low_res.jpg";
import MainPage from "@/components/MainSection/MainPage.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import { computed, ref } from "vue";
import UrlManager from "./components/UrlManager.vue";
import { PageSelection, type ILanguageInfo, type IMasterwork, type IMod, type IPerkOption, type ISelectedPerk, type ISelectedPerkMap, type IWeapon, type PerkColumnNumber } from "./data/interfaces";
import { destinyDataService, selectionService } from "./data/services";

const selectedPage = ref(PageSelection.Home);
const showMainPage = ref(false);
const selectedGear = computed(() => selectionService.selectedGear);

const backgroundUrl = computed(() => LowResBackgroundImage);

function onTabSelected(tab: PageSelection) {
    selectedPage.value = tab;
}

function onSidebarToggled(active: boolean) {
    showMainPage.value = !active;
}

function onWeaponSelected(weapon: IWeapon | undefined) {
    selectedPage.value = PageSelection.Weapon;
    selectionService.setWeapon(weapon);
    showMainPage.value = true;
}

function onLanguageSelected(language: ILanguageInfo) {
    selectionService.language = language;
    destinyDataService.refreshGameData(language);
}

function onPerkSelected(column: PerkColumnNumber, perk: IPerkOption | undefined) {
    selectionService.setPerk(column, perk);
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
    onTabSelected(page);
    onWeaponSelected(weapon);
    if (!weapon) {
        return;
    }

    onTabSelected(PageSelection.Weapon);
    selectionService.setPerks(perkOptions);
    onMasterworkChanged(masterwork);
    onModChanged(mod);
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
            :class="{ 'show': showMainPage, }"
            @tab-selected="onTabSelected"
            @weapon-selected="onWeaponSelected"
            @language-selected="onLanguageSelected"
            @sidebar-toggled="onSidebarToggled"
        ></Sidebar>
        <div class="main-wrapper" :class="{ 'show': showMainPage, }">
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

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.app {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-size: cover;

    @media @large-screen {
        flex-direction: row;
    }
}

.sidebar {
    width: 100vw;
    overflow: hidden;

    @media @narrow-desktop {
        width: 360px;
    }
    @media @desktop {
        width: 460px;
    }
    @media @large-screen {
        height: 100vh;
    }
}

.main-wrapper {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;

    @media @small-screen {
        display: none;
        &.show {
            display: initial;
        }
    }
    @media @large-screen {
        margin-left: 16px;
    }
}
</style>
