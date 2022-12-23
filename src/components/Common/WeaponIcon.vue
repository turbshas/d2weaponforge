<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const baseIcon = computed(() => {
    return props.weapon
        && props.weapon.displayProperties
        && props.weapon.displayProperties.icon
        && destinyDataService.getImageUrl(props.weapon.displayProperties.icon);
});

const watermark = computed(() => {
    // Priority here: weapon.quality.displayVersionWatermarkIcons -> weapon.iconWatermarkShelved -> weapon.iconWatermark
    return props.weapon
        && (
            (
                props.weapon.quality
                && props.weapon.quality.displayVersionWatermarkIcons.length > 0
                && props.weapon.quality.displayVersionWatermarkIcons[0]
                && destinyDataService.getImageUrl(props.weapon.quality.displayVersionWatermarkIcons[0])
            )
            || (props.weapon.iconWatermarkShelved && destinyDataService.getImageUrl(props.weapon.iconWatermarkShelved))
            || (props.weapon.iconWatermark && destinyDataService.getImageUrl(props.weapon.iconWatermark))
        );
});
</script>

<template>
    <div class="base" :style="{ 'background-image': 'url(' + baseIcon + ')' }">
        <img :src="watermark">
    </div>
</template>

<style scoped>
.base {
    display: flex;
    background-size: contain;
}
</style>
