<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import { selectionService } from '@/data/services';
import type { ISelectedGear } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import BuilderSection from '../../../Common/BuilderSection.vue';
import AddToComparisons from './AddToComparisons.vue';
import DamageFalloff from './DamageFalloff.vue';
import DimWishlist from './DimWishlist.vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';
import ReloadSpeed from './ReloadSpeed.vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const hideRetiredText = computed(() => selectionService.hideRetiredPerks ? "Active" : "Inactive");
const showCraftedBonusText = computed(() => selectionService.showCraftedBonus ? "Active" : "Inactive");
const rawStatValuesText = computed(() => selectionService.rawStatValues ? "Active" : "Inactive");

const weapon = computed(() => props.selectedGear.weapon.value);
const isWeaponAdept = computed(() => !!weapon.value && weapon.value.isAdept);
const isWeaponCraftable = computed(() => !!weapon.value && weapon.value.isCraftable);
const selectedPerks = computed(() => props.selectedGear.perkOptionsList.value)

function onHideRetiredClicked() {
    selectionService.hideRetiredPerks = !selectionService.hideRetiredPerks;
}

function onShowCraftedBonusClicked() {
    selectionService.showCraftedBonus = !selectionService.showCraftedBonus;
}

function onRawStatValuesClicked() {
    selectionService.rawStatValues = !selectionService.rawStatValues;
}
</script>

<template>
    <BuilderSection title="Extras">
        <DimWishlist :weapon="weapon" :selected-perks="selectedPerks"></DimWishlist>
        <ExtrasListItem label="Hide Retired Perks">
            <OptionButton :text="hideRetiredText" :active="selectionService.hideRetiredPerks" @click="onHideRetiredClicked"></OptionButton>
        </ExtrasListItem>
        <!-- TODO: add tooltip here that explains what this means - +3 stat bonus for lvl 10 crafted with enhanced intrinsic -->
        <ExtrasListItem label="Show Crafted Bonus" v-if="!isWeaponAdept && isWeaponCraftable">
            <OptionButton :text="showCraftedBonusText" :active="selectionService.showCraftedBonus" @click="onShowCraftedBonusClicked"></OptionButton>
        </ExtrasListItem>
        <ExtrasListItem label="Raw Stat Bonus Values">
            <OptionButton :text="rawStatValuesText" :active="selectionService.rawStatValues" @click="onRawStatValuesClicked"></OptionButton>
        </ExtrasListItem>
        <AddToComparisons></AddToComparisons>
        <DamageFalloff :selected-gear="props.selectedGear"></DamageFalloff>
        <ReloadSpeed></ReloadSpeed>
    </BuilderSection>
</template>

<style scoped>
</style>
