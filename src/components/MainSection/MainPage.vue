<script setup lang="ts">
import { PageSelection, type IMasterwork, type IMod, type IPerkOption, type ISelectedGear, type PerkColumnNumber } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import { defineAsyncComponent } from 'vue';
import HomePage from './HomePage.vue';
import WeaponViewer from './WeaponViewer/WeaponViewer.vue';

const Glossary = defineAsyncComponent(() => import("./Glossary/Glossary.vue"));
const ComparePage = defineAsyncComponent(() => import("./ComparePage.vue"));

const props = defineProps<{
    page: PageSelection,
    selectedGear: ISelectedGear,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: PerkColumnNumber, perk: IPerkOption | undefined): void,
    (e: "masterworkChanged", masterwork: IMasterwork | undefined): void,
    (e: "modChanged", mod: IMod | undefined): void,
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
    <main class="main" aria-label="Main Page">
        <HomePage class="item" v-if="isHomeSelected"></HomePage>
        <Glossary class="item" v-else-if="isGlossarySelected"></Glossary>
        <ComparePage class="item" v-else-if="isCompareSelected"></ComparePage>
        <WeaponViewer
            class="item"
            v-else-if="isWeaponSelected"
            :selected-gear="props.selectedGear"
            @perk-selected="onPerkSelected"
            @masterwork-changed="onMasterworkChanged"
            @mod-changed="onModChanged"
        ></WeaponViewer>
    </main>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.main {
    display: flex;
    justify-content: center;
    padding: 1rem;

    @media @narrow-phone {
        padding: 0;
    }
}

.item {
    flex-grow: 1;
}
</style>
