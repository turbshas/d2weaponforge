<script setup lang="ts">
import { destinyDataService } from '@/data/services';
import type { IWeapon } from '@/data/interfaces';
import { computed } from '@vue/reactivity';

const props = defineProps<{
    weapon: IWeapon | undefined,
    withBorder?: boolean,
}>();

const baseIconPath = computed(() => props.weapon && props.weapon.iconUrl);
const baseIcon = computed(() => baseIconPath.value && destinyDataService.getImageUrl(baseIconPath.value));

const watermarkPath = computed(() => props.weapon && props.weapon.iconWatermarkUrl);
const watermark = computed(() => watermarkPath.value && destinyDataService.getImageUrl(watermarkPath.value));

const iconLabel = computed(() => props.weapon ? `Weapon Icon: ${props.weapon.name}` : "");
const watermarkLabel = "Watermark: Season of release";
</script>

<template>
    <div class="border-container" :class="{ 'border': !!props.withBorder }">
        <div class="wrapper">
            <img class="base-icon" :src="baseIcon" :alt="iconLabel">
            <img class="watermark" :src="watermark" :alt="watermarkLabel">
        </div>
    </div>
</template>

<style scoped lang="less">
.border-container {
    display: flex;
    &.border {
        border-radius: 0;
        border-width: 2px;
        border-color: #f5f5f5;
        border-style: solid;
    }
}

.wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
}

.base-icon {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}

.watermark {
    z-index: 2;
}
</style>
