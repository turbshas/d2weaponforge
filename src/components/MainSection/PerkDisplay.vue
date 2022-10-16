<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    perk: DestinyInventoryItemDefinition | undefined,
    fullSize?: boolean,
}>();

const emits = defineEmits<{
    (e: "click", perk: DestinyInventoryItemDefinition): void
}>();

function getPerkIcon(perk: DestinyInventoryItemDefinition | undefined) {
    if (!perk) return undefined;
    return destinyDataService.getImageUrl(perk.displayProperties.icon);
}

function onPerkClick() {
    if (!props.perk) return;
    emits("click", props.perk);
}
</script>

<template>
    <div
        class="perk"
        :class="{ 'random-roll': !fullSize }"
        :style="{ 'background-image': 'url(' + getPerkIcon(perk) +')' }"
        @click="onPerkClick"
    ></div>
</template>

<style scoped>
.perk {
    width: 48px;
    height: 48px;
    background-size: contain;
}

.random-roll {
    background-size: 75%;
    background-position-x: 50%;
    background-position-y: center;
    background-repeat: no-repeat;
    box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.4);
    border-radius: 50%;
}
</style>
