<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { IWeapon } from '@/data/interfaces';
import { computed } from '@vue/reactivity';

const props = defineProps<{
    weapon: IWeapon | undefined,
}>();

const baseIconPath = computed(() => props.weapon && props.weapon.iconUrl);
const baseIcon = computed(() => baseIconPath.value && destinyDataService.getImageUrl(baseIconPath.value));

const watermarkPath = computed(() => props.weapon && props.weapon.iconWatermarkUrl);
const watermark = computed(() => watermarkPath.value && destinyDataService.getImageUrl(watermarkPath.value));

const iconLabel = computed(() => props.weapon ? `Weapon Icon: ${props.weapon.name}` : "");
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
