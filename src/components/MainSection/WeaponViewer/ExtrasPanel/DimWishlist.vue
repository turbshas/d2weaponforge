<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import type { IPerkOption, IWeapon } from '@/data/interfaces';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';
import DimIcon from '@/assets/dim_icon.svg';
import { ref } from 'vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    selectedPerks: (IPerkOption | undefined)[],
}>();

const buttonOn = ref(false);

function copyWishlistItem() {
    buttonOn.value = true;

    const weaponString = props.weapon ? props.weapon.hash.toString() : "";
    const perksString = props.selectedPerks.filter(p => !!p).map(p => p!.perk.hash).join(",");
    const itemString = `dimwishlist:item=${weaponString}&perks=${perksString}`;
    navigator.clipboard.writeText(itemString);

    setTimeout(() => { buttonOn.value = false; }, 2000);
}
</script>

<template>
    <ExtrasListItem label="DIM Wishlist" :icon-url="DimIcon" icon-alt-text="Icon: Destiny Item Manager">
        <OptionButton text="Copy Wishlist Item" :active="buttonOn" @click="copyWishlistItem"></OptionButton>
    </ExtrasListItem>
</template>

<style scoped>
</style>
