<script setup lang="ts">
import WeaponStatDisplayVue from '@/components/MainSection/WeaponViewer/WeaponPanel/WeaponStatDisplay.vue';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import WeaponListEntry from './WeaponListEntry.vue';

const emit = defineEmits(["entry-clicked"]);

const props = defineProps<{
    weapons: DestinyInventoryItemDefinition[],
}>();

const truncatedWeapons = computed(() => {
    return props.weapons.slice(0, 50);
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
