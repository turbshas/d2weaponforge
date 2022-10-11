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
    <div>
        <WeaponListEntry
            v-for="weapon of weapons"
            :key="weapon.hash"
            :weapon="weapon"
            @entry-clicked="onEntryClicked"
        ></WeaponListEntry>
    </div>
</template>

<style scoped>
</style>
