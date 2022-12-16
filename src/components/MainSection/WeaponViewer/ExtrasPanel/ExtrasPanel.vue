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

// TODO: should probably be in a persistent area so the config stays the same after changing which weapon is selected
const hideRetired = ref(false);
const showCraftedBonus = ref(false);

const hideRetiredText = computed(() => hideRetired.value ? "Active" : "Inactive");
const showCraftedBonusText = computed(() => showCraftedBonus.value ? "Active" : "Inactive");


function onHideRetiredClicked() {
    hideRetired.value = !hideRetired.value;
}

function onShowCraftedBonusClicked() {
    showCraftedBonus.value = !showCraftedBonus.value;
}
</script>

<template>
    <div>
        Extras
        <DimWishlist :weapon="weapon" :selected-perks="selectedPerks"></DimWishlist>
        <ExtrasListItem label="Hide Retired Perks">
            <button @click="onHideRetiredClicked">{{ hideRetiredText }}</button>
        </ExtrasListItem>
        <!-- TODO: add tooltip here that explains what this means - +3 stat bonus for lvl 10 crafted with enhanced intrinsic -->
        <ExtrasListItem label="Show Crafted Bonus">
            <button @click="onShowCraftedBonusClicked">{{ showCraftedBonusText }}</button>
        </ExtrasListItem>
        <AddToComparisons></AddToComparisons>
        <DamageFalloff :weapon="weapon" :selected-perks="selectedPerks" :masterwork="masterwork" :mod="mod"></DamageFalloff>
        <ReloadSpeed></ReloadSpeed>
    </div>
</template>

<style scoped>
</style>
