<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyInventoryItemStatDefinition, DestinyItemSocketEntryDefinition, DestinySandboxPerkDefinition } from 'bungie-api-ts/destiny2';
import WeaponStatDisplay from './WeaponStatDisplay.vue';
import PerksPanel from '../PerksPanel.vue';
import PerkDisplay from '../../PerkDisplay.vue';
import SelectedPerks from './SelectedPerks.vue';

const shownStats: { [statName: string]: boolean } = {
    "Accuracy": true,
    "Aim Assistance": true,
    "Airborne Effectiveness": true,
    "Charge Time": true,
    "Impact": true,
    "Handling": true,
    "Magazine": true,
    "Range": true,
    "Recoil Direction": true,
    "Reload Speed": true,
    "Stability": true,
    "Velocity": true,
    "Zoom": true,
}

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
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
    if (!props.weapon || !props.weapon.stats) return [];
    return hashMapToArray(props.weapon.stats.stats);
});

// TODO make this not as gross, should probably do some data processing in destinyDataService so fewer lookups are required by vue components
const filteredStats = computed(() => {
    return stats.value.filter(s => {
        const statDef = destinyDataService.getStatDefinition(s.statHash);
        return statDef && shownStats[statDef.displayProperties.name];
    });
});

const selectedPerks = computed(() => {
    return [{ socketTypeHash: 1 }, { socketTypeHash: 2 }, { socketTypeHash: 3 }, { socketTypeHash: 4 }] as (Partial<DestinyItemSocketEntryDefinition>)[];
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
                <span>{{ name }}</span>
                <span>{{ type }}</span>
            </div>
            <img class="element" :src="element">
        </div>
        <div class="stats">
            <WeaponStatDisplay
                v-for="stat in filteredStats"
                :key="stat.statHash"
                :definition="getStatDefinition(stat)"
                :value="stat"
            ></WeaponStatDisplay>
        </div>
        <SelectedPerks
            class="perks"
            :weapon="weapon"
            :perk1="undefined"
            :perk2="undefined"
            :perk3="undefined"
            :perk4="undefined"
            :masterwork="undefined"
        ></SelectedPerks>
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

.perks {
    margin-top: auto;
    margin-right: auto;
}
</style>
