<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';
import WeaponIcon from "@/components/WeaponIcon.vue";

const emit = defineEmits(["entry-clicked"]);

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition,
}>();

function onEntryClicked() {
    emit("entry-clicked", props.weapon);
}
</script>

<template>
    <div class="entry" @click="onEntryClicked">
        <WeaponIcon class="icon" :weapon="weapon"></WeaponIcon>
        <span>{{ weapon.displayProperties.name }}</span>
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
    display: flex;
    flex-direction: row;
}

.icon {
    width: 42px;
    height: 42px;
}
</style>
