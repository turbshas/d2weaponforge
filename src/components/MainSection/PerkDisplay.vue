<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    perk: DestinyInventoryItemDefinition | undefined,
}>();

function getPerkIcon(perk: DestinyInventoryItemDefinition | undefined) {
    if (!perk) return undefined;
    return destinyDataService.getImageUrl(perk.displayProperties.icon);
}
</script>

<template>
    <div
        class="perk"
        :style="{ 'background-image': 'url(' + getPerkIcon(perk) +')' }"
    ></div>
</template>

<style scoped>
.perk {
    width: 48px;
    height: 48px;
    background-size: contain;
}
</style>
