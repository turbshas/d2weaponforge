<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import WeaponPanel from './WeaponPanel/WeaponPanel.vue';
// import ExtrasPanel from './ExtrasPanel/ExtrasPanel.vue';
// import MasterworkPanel from './MasterworkPanel.vue';
// import ModsPanel from './ModsPanel.vue';
import PerksPanel from './PerksPanel/PerksPanel.vue';
import type { IMasterwork, IMod, IPerkOption, ISelectedGear, PerkColumnNumber } from '@/data/interfaces';
import { computed } from 'vue';

// const WeaponPanel = defineAsyncComponent(() => import("./WeaponPanel/WeaponPanel.vue"));
const ExtrasPanel = defineAsyncComponent(() => import("./ExtrasPanel/ExtrasPanel.vue"));
const MasterworkPanel = defineAsyncComponent(() => import("./MasterworkPanel.vue"));
const ModsPanel = defineAsyncComponent(() => import("./ModsPanel.vue"));
// const PerksPanel = defineAsyncComponent(() => import("./PerksPanel/PerksPanel.vue"));

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

const masterworkList = computed(() => weapon.value ? weapon.value.masterworks : []);
const modList = computed(() => weapon.value ? weapon.value.mods : []);

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
    <div class="viewer">
        <div class="weapon">
            <WeaponPanel
                :selected-gear="props.selectedGear"
            ></WeaponPanel>
            <div class="extras-mws-mods">
                <ExtrasPanel
                    :selected-gear="props.selectedGear"
                ></ExtrasPanel>
                <div class="mods-masterwork">
                    <MasterworkPanel
                        class="mw"
                        :masterwork-list="masterworkList"
                        :masterwork="props.selectedGear.masterwork.value"
                        @masterwork-changed="onMasterworkChanged"
                    ></MasterworkPanel>
                    <ModsPanel
                        :mod-list="modList"
                        :mod="props.selectedGear.mod.value"
                        @mod-changed="onModChanged"
                    ></ModsPanel>
                </div>
            </div>
        </div>
        <PerksPanel
            :random-roll-perks="randomRollPerks"
            :curated-perks="curatedPerks"
            :selected-perks="props.selectedGear.perkOptionsMap.value"
            @perk-selected="onPerkSelected"
        ></PerksPanel>
    </div>
</template>

<style scoped>
.viewer {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 964.55fr 414.467fr;
    gap: 16px;
}

.weapon {
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    padding-bottom: 160px;
}

.extras-mws-mods {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 414.467fr 534.083fr;
    gap: 16px;
    flex-direction: row;
    margin-top: 16px;
}

.mods-masterwork {
    display: flex;
    flex-direction: column;
}

.mw {
    margin-bottom: 16px;
}
</style>
