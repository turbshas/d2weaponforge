<script setup lang="ts">
import WeaponIcon from '@/components/WeaponIcon.vue';
import { destinyDataService } from '@/data/destinyDataService';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

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
    selectedPerks: (DestinyInventoryItemDefinition | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const screenshot = computed(() => {
    return props.weapon ? destinyDataService.getImageUrl(props.weapon.screenshot) : undefined;
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

const firstColumnPerk = computed(() => props.selectedPerks.length > 0 ? props.selectedPerks[0] : undefined);
const secondColumnPerk = computed(() => props.selectedPerks.length > 1 ? props.selectedPerks[1] : undefined);
const thirdColumnPerk = computed(() => props.selectedPerks.length > 2 ? props.selectedPerks[2] : undefined);
const fourthColumnPerk = computed(() => props.selectedPerks.length > 3 ? props.selectedPerks[3] : undefined);
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }">
        <div class="summary">
            <WeaponIcon class="icon" :weapon="weapon"></WeaponIcon>
            <div class="description">
                <span>{{ name }}</span>
                <span>{{ type }}</span>
            </div>
            <img class="element" :src="element">
        </div>
        <WeaponStatBlock
            class="stats"
            :stats="filteredStats"
            :selected-perks="selectedPerks"
            :masterwork="masterwork"
            :mod="mod"
        ></WeaponStatBlock>
        <SelectedPerks
            class="perks"
            :weapon="weapon"
            :perk1="firstColumnPerk"
            :perk2="secondColumnPerk"
            :perk3="thirdColumnPerk"
            :perk4="fourthColumnPerk"
            :masterwork="masterwork"
            :mod="mod"
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

.stats {
    max-width: 50%;
}

.perks {
    margin-top: auto;
    margin-right: auto;
}
</style>
