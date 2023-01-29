<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const baseIconPath = computed(() => props.weapon && props.weapon.displayProperties && props.weapon.displayProperties.icon);
const baseIcon = computed(() => baseIconPath.value && destinyDataService.getImageUrl(baseIconPath.value));

const watermarkPath = computed(() => {
    // Priority here: weapon.quality.displayVersionWatermarkIcons -> weapon.iconWatermarkShelved -> weapon.iconWatermark
    return props.weapon
        && (
            (
                props.weapon.quality
                && props.weapon.quality.displayVersionWatermarkIcons.length > 0
                && props.weapon.quality.displayVersionWatermarkIcons[0]
                && props.weapon.quality.displayVersionWatermarkIcons[0]
            )
            || props.weapon.iconWatermarkShelved
            || props.weapon.iconWatermark
        );
});
const watermark = computed(() => watermarkPath.value && destinyDataService.getImageUrl(watermarkPath.value));

const iconLabel = computed(() => props.weapon ? `Weapon Icon: ${props.weapon.displayProperties.name}` : "");
const watermarkLabel = "Watermark: Season of release";
</script>

<template>
    <div class="wrapper">
        <img class="base-icon" :src="baseIcon" :alt="iconLabel">
        <img class="watermark" :src="watermark" :alt="watermarkLabel">
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    position: relative;
}

.base-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.watermark {
    z-index: 2;
}
</style>
