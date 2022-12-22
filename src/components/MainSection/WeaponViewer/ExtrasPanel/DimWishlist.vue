<script setup lang="ts">
import OptionButton from '@/components/OptionButton.vue';
import type { IPerkOption } from '@/data/types';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import ExtrasListItem from './ExtrasListItem.vue';
import DimIcon from '@/assets/dim_icon.svg';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
}>();

function copyWishlistItem() {
    const weaponString = props.weapon ? props.weapon.hash.toString() : "";
    const perksString = props.selectedPerks.filter(p => !!p).map(p => p!.perk.hash).join(",");
    const itemString = `dimwishlist:item=${weaponString}&perks=${perksString}`;
    navigator.clipboard.writeText(itemString);
}
</script>

<template>
    <ExtrasListItem label="DIM Wishlist" :icon-url="DimIcon">
        <OptionButton text="Copy Wishlist Item" @click="copyWishlistItem"></OptionButton>
    </ExtrasListItem>
</template>

<style scoped>
</style>
