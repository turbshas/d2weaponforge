<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    perk: DestinyInventoryItemDefinition | undefined,
    fullSize?: boolean,
}>();

const emits = defineEmits<{
    (e: "click", perk: DestinyInventoryItemDefinition): void
}>();

const perkIcon = computed(() => {
    if (!props.perk) return undefined;
    return destinyDataService.getImageUrl(props.perk.displayProperties.icon);
});

const perkWatermark = computed(() => {
    if (!props.perk || !props.perk.iconWatermark) return undefined;
    return destinyDataService.getImageUrl(props.perk.iconWatermark);
});

function onPerkClick() {
    if (!props.perk) return;
    emits("click", props.perk);
}
</script>

<template>
    <div
        class="perk"
        :class="{ 'random-roll': !fullSize }"
        :style="{ 'background-image': 'url(' + perkIcon +')' }"
        @click="onPerkClick"
    >
        <img class="perk" v-if="!!perkWatermark" :src="perkWatermark">
    </div>
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
