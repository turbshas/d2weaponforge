<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';
import WeaponPanel from './WeaponPanel.vue';
import ExtrasPanel from './ExtrasPanel.vue';
import MasterworkPanel from './MasterworkPanel.vue';
import ModsPanel from './ModsPanel.vue';
import PerksPanel from './PerksPanel.vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | null
}>();
</script>

<template>
    <div class="grid">
        {{ weapon?.displayProperties?.name }}
        <WeaponPanel class="weapon"></WeaponPanel>
        <ExtrasPanel class="extras"></ExtrasPanel>
        <MasterworkPanel class="masterwork"></MasterworkPanel>
        <ModsPanel class="mods"></ModsPanel>
        <PerksPanel class="perks"></PerksPanel>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(13, 1fr);
}

.weapon {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 1;
    grid-row-end: 7;
}

.extras {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 8;
    grid-row-end: 10;
}

.masterwork {
    grid-column-start: 4;
    grid-column-end: 7;
    grid-row-start: 8;
    grid-row-end: 9;
}

.mods {
    grid-column-start: 4;
    grid-column-end: 8;
    grid-row-start: 10;
    grid-row-end: 13;
}

.perks {
    grid-column-start: 8;
    grid-column-end: 10;
    grid-row-start: 1;
    grid-row-end: 12;
}
</style>
