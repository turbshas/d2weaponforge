<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyInventoryItemStatDefinition } from 'bungie-api-ts/destiny2';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | null,
}>();

const screenshot = computed(() => {
    return props.weapon ? destinyDataService.getImageUrl(props.weapon.screenshot) : undefined;
});

const icon = computed(() => {
    return props.weapon ? destinyDataService.getImageUrl(props.weapon.displayProperties.icon) : undefined;
});

const name = computed(() => {
    return props.weapon ? props.weapon.displayProperties.name : undefined;
});

const type = computed(() => {
    return props.weapon ? props.weapon.itemTypeDisplayName : undefined;
});

const element = computed(() => {
    if (!props.weapon) return undefined;
    const damageTypeHash = props.weapon.defaultDamageTypeHash;
    if (!damageTypeHash) return undefined;
    const damageType = destinyDataService.getDamageType(damageTypeHash);
    if (!damageType) return undefined;
    return destinyDataService.getImageUrl(damageType.displayProperties.icon);
});

const stats = computed(() => {
    return props.weapon && props.weapon.stats && props.weapon.stats.stats;
});

function getStatDefinition(stat: DestinyInventoryItemStatDefinition) {
    return destinyDataService.getStatDefinition(stat.statHash);
}
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }">
        <div class="summary">
            <img class="icon" :src="icon">
            <div class="description">
                {{ name }}
                {{ type }}
            </div>
            <img class="element" :src="element">
        </div>
        <div class="stats">
            <WeaponStatDisplay
                v-for="stat in stats"
                :key="stat.statHash"
                :definition="getStatDefinition(stat)"
                :value="stat"
            ></WeaponStatDisplay>
        </div>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    /* aspect ratio of image is 16:9 */
    width: 800px;
    height: 450px;
    background-size: contain;
}

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 50px;
    height: 50px;
    border-radius: 0;
    border-top: 2px;
    border-bottom: 2px;
    border-left: 2px;
    border-right: 2px;
    border-style: solid;
    border-color: white;
}

.description {
    display: flex;
    flex-direction: column;
}

.element {
    margin-left: auto;
    width: 50px;
    height: 50px;
}
</style>
