<script setup lang="ts">
import { PageSelection } from '@/data/enums';
import { computed } from '@vue/reactivity';
import HomePage from './HomePage.vue';
import Glossary from './Glossary.vue';
import ComparePage from './ComparePage.vue';
import WeaponViewer from './WeaponViewer/WeaponViewer.vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    page: PageSelection,
    weapon: DestinyInventoryItemDefinition | null,
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
</script>

<template>
    <div>
        <HomePage v-if="isHomeSelected"></HomePage>
        <Glossary v-if="isGlossarySelected"></Glossary>
        <ComparePage v-if="isCompareSelected"></ComparePage>
        <WeaponViewer v-if="isWeaponSelected" :weapon="weapon"></WeaponViewer>
    </div>
</template>

<style scoped>
</style>
