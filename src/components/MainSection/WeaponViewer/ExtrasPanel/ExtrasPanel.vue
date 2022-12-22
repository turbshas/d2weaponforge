<script setup lang="ts">
import { selectionService } from '@/data/selectionService';
import type { IPerkOption } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import BuilderSection from '../BuilderSection.vue';
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

const hideRetiredText = computed(() => selectionService.hideRetiredPerks ? "Active" : "Inactive");
const showCraftedBonusText = computed(() => selectionService.showCraftedBonus ? "Active" : "Inactive");


function onHideRetiredClicked() {
    selectionService.hideRetiredPerks = !selectionService.hideRetiredPerks;
}

function onShowCraftedBonusClicked() {
    selectionService.showCraftedBonus = !selectionService.showCraftedBonus;
}
</script>

<template>
    <BuilderSection title="Extras">
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
    </BuilderSection>
</template>

<style scoped>
</style>
