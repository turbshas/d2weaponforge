<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import { selectionService } from '@/data/selectionService';
import type { IPerkOption, IWeapon } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import BuilderSection from '../../../Common/BuilderSection.vue';
import AddToComparisons from './AddToComparisons.vue';
import DamageFalloff from './DamageFalloff.vue';
import DimWishlist from './DimWishlist.vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';
import ReloadSpeed from './ReloadSpeed.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
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
        <DimWishlist :weapon="props.weapon" :selected-perks="props.selectedPerks"></DimWishlist>
        <ExtrasListItem label="Hide Retired Perks">
            <OptionButton :text="hideRetiredText" :active="selectionService.hideRetiredPerks" @click="onHideRetiredClicked"></OptionButton>
        </ExtrasListItem>
        <!-- TODO: add tooltip here that explains what this means - +3 stat bonus for lvl 10 crafted with enhanced intrinsic -->
        <ExtrasListItem label="Show Crafted Bonus" v-if="!props.weapon?.isAdept">
            <OptionButton :text="showCraftedBonusText" :active="selectionService.showCraftedBonus" @click="onShowCraftedBonusClicked"></OptionButton>
        </ExtrasListItem>
        <AddToComparisons></AddToComparisons>
        <DamageFalloff :weapon="props.weapon" :selected-perks="props.selectedPerks" :masterwork="props.masterwork" :mod="props.mod"></DamageFalloff>
        <ReloadSpeed></ReloadSpeed>
    </BuilderSection>
</template>

<style scoped>
</style>
