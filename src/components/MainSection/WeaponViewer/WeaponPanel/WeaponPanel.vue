<script setup lang="ts">
import WeaponIcon from '@/components/WeaponIcon.vue';
import { destinyDataService } from '@/data/destinyDataService';
import { DataSearchString, type IPerkOption } from '@/data/types';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

const shownStats: { [statName: string]: boolean } = {
    [DataSearchString.AccuracyStatName]: true,
    [DataSearchString.AimAssistanceStatName]: true,
    [DataSearchString.AirborneEffectivenessStatName]: true,
    [DataSearchString.ChargeTimeStatName]: true,
    [DataSearchString.DrawTimeStatName]: true,
    [DataSearchString.ImpactStatName]: true,
    [DataSearchString.HandlingStatName]: true,
    [DataSearchString.MagSizeStatName]: true,
    [DataSearchString.RangeStatName]: true,
    [DataSearchString.RecoilDirectionStatName]: true,
    [DataSearchString.ReloadSpeedStatName]: true,
    [DataSearchString.RpmStatName]: true,
    [DataSearchString.StabilityStatName]: true,
    [DataSearchString.VelocityStatName]: true,
    [DataSearchString.ZoomStatName]: true,
}

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const screenshot = computed(() => {
    console.log("selected weapon", props.weapon);
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

const firstColumnPerk = computed(() => props.selectedPerks.length > 0 ? props.selectedPerks[0]?.perk : undefined);
const secondColumnPerk = computed(() => props.selectedPerks.length > 1 ? props.selectedPerks[1]?.perk : undefined);

const thirdColumnPerkOption = computed(() => props.selectedPerks.length > 2 ? props.selectedPerks[2] : undefined);
const isThirdEnhanced = computed(() => !!thirdColumnPerkOption.value && thirdColumnPerkOption.value.useEnhanced);
const thirdColumnPerk = computed(() => {
    console.log("selected perks", props.weapon, props.selectedPerks, props.masterwork, props.mod);
    if (!thirdColumnPerkOption.value) return undefined;
    return isThirdEnhanced.value ? thirdColumnPerkOption.value.enhancedPerk : thirdColumnPerkOption.value.perk;
});

const fourthColumnPerkOption = computed(() => props.selectedPerks.length > 3 ? props.selectedPerks[3] : undefined);
const isFourthEnhanced = computed(() => !!fourthColumnPerkOption.value && fourthColumnPerkOption.value.useEnhanced);
const fourthColumnPerk = computed(() => {
    if (!fourthColumnPerkOption.value) return undefined;
    return isFourthEnhanced.value ? fourthColumnPerkOption.value.enhancedPerk : fourthColumnPerkOption.value.perk;
});

const fifthColumnPerk = computed(() => props.selectedPerks.length > 4 ? props.selectedPerks[4]?.perk : undefined);

const currentSelectedPerks = computed(() => {
    return [firstColumnPerk.value, secondColumnPerk.value, thirdColumnPerk.value, fourthColumnPerk.value, fifthColumnPerk.value];
});

function onPerkClicked(column: number) {
    if (!props.selectedPerks || props.selectedPerks.length <= column) return;
    const perk = props.selectedPerks[column];
    if (!perk) return;
    perk.useEnhanced = !perk.useEnhanced;
}
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }">
        <div class="summary">
            <WeaponIcon class="icon" :weapon="weapon"></WeaponIcon>
            <div class="description">
                <h1>{{ name }}</h1>
                <h3>{{ type }}</h3>
            </div>
            <img class="element" :src="element">
        </div>
        <WeaponStatBlock
            class="stats"
            :stats="filteredStats"
            :selected-perks="currentSelectedPerks"
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
            :is-perk3-enhanced="isThirdEnhanced"
            :is-perk4-enhanced="isFourthEnhanced"
            :origin-perk="fifthColumnPerk"
            :masterwork="masterwork"
            :mod="mod"
            @perk-clicked="onPerkClicked"
        ></SelectedPerks>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    /* aspect ratio of image is 16:9 */
    /* width: 800px; */
    /* height: 570px; */
    aspect-ratio: 16 / 9;
    background-size: cover;
    padding: 16px;
}

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 52px;
    height: 52px;
    box-shadow: inset 0 0 0 2px #f5f5f5;
    margin-right: 16px;
}

.description {
    display: flex;
    flex-direction: column;
}
.description h1 {
    font-size: 32px;
    font-weight: 600;
    line-height: 32px;
    text-transform: uppercase;
}
.description h3 {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
}

.element {
    margin-left: auto;
    width: 42px;
    height: 42px;
}

.stats {
    margin-top: 16px;
    margin-bottom: 6px;
    max-width: 50%;
}

.perks {
    justify-content: flex-end;
    margin-top: auto;
    margin-left: auto;
}
</style>
