<script setup lang="ts">
import WeaponIcon from '@/components/Common/WeaponIcon.vue';
import { destinyDataService } from '@/data/destinyDataService';
import type { IPerkOption, IWeapon } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const screenshot = computed(() => {
    return props.weapon ? destinyDataService.getImageUrl(props.weapon.weapon.screenshot) : undefined;
});

const name = computed(() => {
    return props.weapon ? props.weapon.weapon.displayProperties.name : undefined;
});

const type = computed(() => {
    return props.weapon ? props.weapon.weapon.itemTypeDisplayName : undefined;
});

const element = computed(() => {
    if (!props.weapon) return undefined;
    const damageTypeHash = props.weapon.weapon.defaultDamageTypeHash;
    if (!damageTypeHash) return undefined;
    return destinyDataService.getDamageType(damageTypeHash);
});
const elementName = computed(() => element.value ? element.value.displayProperties.name : "None");
const elementIcon = computed(() => {
    if (!element.value) return undefined;
    return destinyDataService.getImageUrl(element.value.displayProperties.icon);
});
const elementLabel = computed(() => `Element Type: ${elementName.value}`);

const investmentStats = computed(() => {
    if (!props.weapon || !props.weapon.weapon.investmentStats) return [];
    return props.weapon.weapon.investmentStats;
});

const statGroup = computed(() => {
    if (!props.weapon || !props.weapon.weapon.stats) return undefined;
    const statGroupHash = props.weapon.weapon.stats.statGroupHash;
    if (!statGroupHash) return undefined;
    return destinyDataService.getStatGroupDefinition(statGroupHash);
})

const firstColumnPerk = computed(() => props.selectedPerks.length > 0 ? props.selectedPerks[0]?.perk : undefined);
const secondColumnPerk = computed(() => props.selectedPerks.length > 1 ? props.selectedPerks[1]?.perk : undefined);

const thirdColumnPerkOption = computed(() => props.selectedPerks.length > 2 ? props.selectedPerks[2] : undefined);
const isThirdEnhanced = computed(() => !!thirdColumnPerkOption.value && thirdColumnPerkOption.value.useEnhanced);
const thirdColumnPerk = computed(() => {
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
            <WeaponIcon class="icon" :weapon="props.weapon?.weapon"></WeaponIcon>
            <div class="description">
                <h1>{{ name }}</h1>
                <h3>{{ type }}</h3>
            </div>
            <img class="element" :src="elementIcon" :alt="elementLabel">
        </div>
        <WeaponStatBlock
            class="stats"
            :stat-group="statGroup"
            :investment-stats="investmentStats"
            :selected-perks="currentSelectedPerks"
            :masterwork="masterwork"
            :mod="mod"
            :is-adept="!!(props.weapon?.isAdept)"
        ></WeaponStatBlock>
        <SelectedPerks
            class="perks"
            :intrinsic="weapon?.intrinsic"
            :perk1="firstColumnPerk"
            :perk2="secondColumnPerk"
            :perk3="thirdColumnPerk"
            :perk4="fourthColumnPerk"
            :is-perk3-enhanced="isThirdEnhanced"
            :is-perk4-enhanced="isFourthEnhanced"
            :origin-perk="fifthColumnPerk"
            :masterwork="masterwork"
            :mod="mod"
            :is-adept="!!(props.weapon?.isAdept)"
            @perk-clicked="onPerkClicked"
        ></SelectedPerks>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
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
