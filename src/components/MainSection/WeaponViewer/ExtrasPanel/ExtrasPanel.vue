<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import type { ISelectedGear } from '@/data/interfaces';
import { selectionService } from '@/data/services';
import { computed } from '@vue/reactivity';
import { defineAsyncComponent } from 'vue';
import BuilderSection from '../../../Common/BuilderSection.vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';
import AddToComparisons from './AddToComparisons.vue';
import DimWishlist from './DimWishlist.vue';

// Async because they load the weapon formulas which is a lot of data.
const DamageFalloff = defineAsyncComponent(() => import("./DamageFalloff.vue"));
const ReloadSpeed = defineAsyncComponent(() => import("./ReloadSpeed.vue"));
const HandlingSpeed = defineAsyncComponent(() => import("./HandlingSpeed.vue"));
const AmmoSize = defineAsyncComponent(() => import("./AmmoSize.vue"));

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
        <ul class="list">
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
            <ReloadSpeed :selected-gear="props.selectedGear"></ReloadSpeed>
            <HandlingSpeed :selected-gear="props.selectedGear"></HandlingSpeed>
            <AmmoSize :selected-gear="props.selectedGear"></AmmoSize>
        </ul>
    </BuilderSection>
</template>

<style scoped lang="less">
.list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
}
</style>
