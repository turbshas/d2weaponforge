<script setup lang="ts">
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import WeaponListEntry from './WeaponListEntry.vue';

const emit = defineEmits(["entry-clicked"]);

const props = defineProps<{
    weapons: DestinyInventoryItemDefinition[],
    searchString: string,
}>();

const truncatedWeapons = computed(() => {
    // If no search, return first 22 items
    if (!props.searchString) return props.weapons.slice(0, 22);
    return props.weapons.filter(s => s.displayProperties.name.includes(props.searchString));
});

function onEntryClicked(weapon: DestinyInventoryItemDefinition) {
    emit("entry-clicked", weapon);
}
</script>

<template>
    <div class="list">
        <WeaponListEntry
            v-for="weapon of truncatedWeapons"
            :key="weapon.hash"
            :weapon="weapon"
            @entry-clicked="onEntryClicked"
        ></WeaponListEntry>
    </div>
</template>

<style scoped>
.list {
    overflow: auto;
}
</style>
