<script setup lang="ts">
import type { IPerkOption } from '@/data/types';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import ExtrasListItem from './ExtrasListItem.vue';

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
    <ExtrasListItem label="DIM Wishlist">
        <button @click="copyWishlistItem">Copy Wishlist Item</button>
    </ExtrasListItem>
</template>

<style scoped>
</style>
