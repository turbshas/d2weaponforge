<script setup lang="ts">
import type { IPerkOption } from '@/data/types';
import { computed, ref } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import AddToComparisons from './AddToComparisons.vue';
import DamageFalloff from './DamageFalloff.vue';
import DimWishlist from './DimWishlist.vue';
import ExtrasListItem from './ExtrasListItem.vue';
import ReloadSpeed from './ReloadSpeed.vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const hideRetired = ref(false);

const hideRetiredText = computed(() => hideRetired.value ? "Active" : "Inactive");

function onHideRetiredClicked() {
    hideRetired.value = !hideRetired.value;
}
</script>

<template>
    <div>
        Extras
        <DimWishlist :weapon="weapon" :selected-perks="selectedPerks"></DimWishlist>
        <ExtrasListItem label="Hide Retired Perks">
            <button @click="onHideRetiredClicked">{{ hideRetiredText }}</button>
        </ExtrasListItem>
        <AddToComparisons></AddToComparisons>
        <DamageFalloff></DamageFalloff>
        <ReloadSpeed></ReloadSpeed>
    </div>
</template>

<style scoped>
</style>
