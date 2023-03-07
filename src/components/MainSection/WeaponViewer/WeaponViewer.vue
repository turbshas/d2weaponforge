<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import WeaponPanel from './WeaponPanel/WeaponPanel.vue';
import type { IMasterwork, IMod, IPerkOption, ISelectedGear, PerkColumnNumber } from '@/data/interfaces';
import { computed } from 'vue';
import PerksPanel from './PerksPanel/PerksPanel.vue';
import CatalystPanel from './CatalystPanel/CatalystPanel.vue';

const ExtrasPanel = defineAsyncComponent(() => import("./ExtrasPanel/ExtrasPanel.vue"));
const MasterworkPanel = defineAsyncComponent(() => import("./MasterworkPanel.vue"));
const ModsPanel = defineAsyncComponent(() => import("./ModsPanel.vue"));

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: PerkColumnNumber, perk: IPerkOption | undefined): void,
    (e: "masterworkChanged", masterwork: IMasterwork | undefined): void,
    (e: "modChanged", mod: IMod | undefined): void,
}>();

const weapon = computed(() => props.selectedGear.weapon.value);

const randomRollPerks = computed(() => weapon.value ? weapon.value.perks.perkColumns : []);
const curatedPerks = computed(() => weapon.value ? weapon.value.curated.perkColumns : []);

const catalysts = computed(() => weapon.value ? weapon.value.catalysts : []);
const masterworkList = computed(() => weapon.value ? weapon.value.masterworks : []);
const modList = computed(() => weapon.value ? weapon.value.mods : []);

const showCatalystPanel = computed(() => catalysts.value.length > 0);
const showMasterworkPanel = computed(() => masterworkList.value.length > 0);
const showModsPanel = computed(() => modList.value.length > 0);

function onPerkSelected(column: PerkColumnNumber, perk: IPerkOption | undefined) {
    emits("perkSelected", column, perk);
}

function onMasterworkChanged(masterwork: IMasterwork | undefined) {
    emits("masterworkChanged", masterwork);
}

function onModChanged(mod: IMod | undefined) {
    emits("modChanged", mod);
}
</script>

<template>
    <div class="viewer" aria-label="Weapon Viewer">
        <WeaponPanel
            class="weapon-panel"
            :selected-gear="props.selectedGear"
        ></WeaponPanel>
        <PerksPanel
            class="perks-panel"
            :random-roll-perks="randomRollPerks"
            :curated-perks="curatedPerks"
            :selected-perks="props.selectedGear.perkOptionsMap.value"
            @perk-selected="onPerkSelected"
        ></PerksPanel>
        <CatalystPanel
            class="mw-panel"
            v-if="showCatalystPanel"
            :catalysts="catalysts"
        ></CatalystPanel>
        <MasterworkPanel
            class="mw-panel"
            v-if="showMasterworkPanel"
            :masterwork-list="masterworkList"
            :masterwork="props.selectedGear.masterwork.value"
            @masterwork-changed="onMasterworkChanged"
        ></MasterworkPanel>
        <ModsPanel
            class="mods-panel"
            v-if="showModsPanel"
            :mod-list="modList"
            :mod="props.selectedGear.mod.value"
            @mod-changed="onModChanged"
        ></ModsPanel>
        <ExtrasPanel
            class="extras-panel"
            :selected-gear="props.selectedGear"
        ></ExtrasPanel>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.viewer {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media @grid-weapon-viewer {
        display: grid;
        // Rows: Weapon panel -> MW panel -> Mod panel
        grid-template-rows: 1fr 0.25fr 1.75fr;
        // Columns: Extras panel -> MW/Mods panels -> Perk panel
        grid-template-columns: 1fr 1.289fr 1fr;
        grid-template-areas:
            "weapon weapon perks"
            "extras mw     perks"
            "extras mods   perks";
    }
}

.weapon-panel {
    grid-area: weapon;
}
.perks-panel {
    grid-area: perks;
}
.mw-panel {
    grid-area: mw;
}
.mods-panel {
    grid-area: mods;
}
.extras-panel {
    grid-area: extras;
}
</style>
