<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import WeaponListEntry from './WeaponListEntry.vue';

const emit = defineEmits(["entry-clicked"]);

const props = defineProps<{
    weapons: DestinyInventoryItemDefinition[],
}>();

function onEntryClicked(weapon: DestinyInventoryItemDefinition) {
    emit("entry-clicked", weapon);
}
</script>

<template>
    <div class="list">
        <WeaponListEntry
            v-for="weapon of props.weapons"
            :key="weapon.hash"
            :weapon="weapon"
            @entry-clicked="onEntryClicked"
        ></WeaponListEntry>
    </div>
</template>

<style scoped>
.list {
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}
</style>
