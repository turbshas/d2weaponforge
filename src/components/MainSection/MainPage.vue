<script setup lang="ts">
import { PageSelection, type IPerkOption } from '@/data/types';
import { computed } from '@vue/reactivity';
import HomePage from './HomePage.vue';
import Glossary from './Glossary.vue';
import ComparePage from './ComparePage.vue';
import WeaponViewer from './WeaponViewer/WeaponViewer.vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    page: PageSelection,
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
    (e: "masterworkChanged", masterwork: DestinyInventoryItemDefinition | undefined): void,
    (e: "modChanged", mod: DestinyInventoryItemDefinition | undefined): void,
}>();

const isHomeSelected = computed(() => {
    return props && props.page === PageSelection.Home;
});

const isGlossarySelected = computed(() => {
    return props && props.page === PageSelection.Glossary;
});

const isCompareSelected = computed(() => {
    return props && props.page === PageSelection.Compare;
});

const isWeaponSelected = computed(() => {
    return props && props.page === PageSelection.Weapon;
});

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    emits("perkSelected", column, perk);
}

function onMasterworkChanged(masterwork: DestinyInventoryItemDefinition | undefined) {
    emits("masterworkChanged", masterwork);
}

function onModChanged(mod: DestinyInventoryItemDefinition | undefined) {
    emits("modChanged", mod);
}
</script>

<template>
    <div class="main">
        <HomePage class="item" v-if="isHomeSelected"></HomePage>
        <Glossary class="item" v-else-if="isGlossarySelected"></Glossary>
        <ComparePage class="item" v-else-if="isCompareSelected"></ComparePage>
        <WeaponViewer
            class="item"
            v-else-if="isWeaponSelected"
            :weapon="weapon"
            @perk-selected="onPerkSelected"
            @masterwork-changed="onMasterworkChanged"
            @mod-changed="onModChanged"
        ></WeaponViewer>
    </div>
</template>

<style scoped>
.main {
    display: flex;
}

.item {
    flex-grow: 1;
}
</style>
