<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';
import WeaponPanel from './WeaponPanel/WeaponPanel.vue';
import ExtrasPanel from './ExtrasPanel.vue';
import MasterworkPanel from './MasterworkPanel.vue';
import ModsPanel from './ModsPanel.vue';
import PerksPanel from './PerksPanel.vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | null
}>();
</script>

<template>
    <div class="viewer">
        {{ weapon?.displayProperties?.name }}
        <div class="weapon">
            <WeaponPanel :weapon="weapon"></WeaponPanel>
            <div class="extras">
                <ExtrasPanel></ExtrasPanel>
                <div>
                    <MasterworkPanel></MasterworkPanel>
                    <ModsPanel></ModsPanel>
                </div>
            </div>
        </div>
        <div>
            <PerksPanel></PerksPanel>
        </div>
    </div>
</template>

<style scoped>
.viewer {
    display: flex;
    flex-direction: row;
}

.weapon {
    display: flex;
    flex-direction: column;
}

.extras {
    display: flex;
    flex-direction: row;
}
</style>
