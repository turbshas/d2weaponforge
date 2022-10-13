<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';

const emit = defineEmits(["entry-clicked"]);

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition,
}>();

function getIconUrl(imgFileName: string) {
    return destinyDataService.getImageUrl(imgFileName);
}

function onEntryClicked() {
    emit("entry-clicked", props.weapon);
}
</script>

<template>
    <div class="entry" @click="onEntryClicked">
        <img class="icon" :src="getIconUrl(weapon.displayProperties.icon)">
        {{ weapon.displayProperties.name }}
    </div>
</template>

<style scoped>
.entry {
    border-radius: 0;
    border-color: white;
    border-width: 1px;
    border-style: solid;
    margin: 5px;
    cursor: pointer;
}

.icon {
    width: 36px;
    height: 36px;
}
</style>
