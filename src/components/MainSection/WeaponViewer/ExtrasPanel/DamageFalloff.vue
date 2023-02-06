<script setup lang="ts">
import { WeaponCategoryRangeValuesMap } from '@/data/constants';
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import type { IMasterwork, IMod, IPerk, IPerkBonus, IPerkOption, IWeapon } from '@/data/interfaces';
import { computed } from 'vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
}>();

// TODO: find a better way to identify specific items in the manifest, perhaps index? unsure if that is consistent across languages
const RangeStatName = computed(() => DataSearchStrings.Stats.Range.value);
const ZoomStatName = computed(() => DataSearchStrings.Stats.Zoom.value);
const RangefinderPerkName = computed(() => DataSearchStrings.Misc.RangefinderPerkName.value);
const weaponCategoryRegex = computed(() => props.weapon ? props.weapon.weaponCategoryRegex : "");
const rangeValues = computed(() => WeaponCategoryRangeValuesMap.value[weaponCategoryRegex.value]);
const hasRangeValues = computed(() => !!rangeValues.value);

const isAdept = computed(() => props.weapon ? props.weapon.isAdept : false);

const weaponStatInfos = computed(() => props.weapon ? props.weapon.statBlock.statInfos : []);
const weaponStats = computed(() => weaponStatInfos.value.map(s => {
    const stat: IPerkBonus = {
        statHash: s.statHash,
        statName: s.statName,
        value: s.investmentValue,
    };
    return stat;
}));

const allStats = computed(() => {
    const perkStats = props.selectedPerks.map(p => getStatsForItem(p?.perk)).reduce((total, current) => total.concat(current), []);
    const masterworkStats = getStatsForItem(props.masterwork);
    const modStats = getStatsForItem(props.mod);
    console.log("damage falloff props", props);
    console.log("all stats", weaponStats, weaponStats.value.map(s => destinyDataService.getStatDefinition(s.statHash)), perkStats, masterworkStats, modStats);
    return [...weaponStats.value, ...perkStats, ...masterworkStats, ...modStats];
});

const range = computed(() => {
    return allStats.value
        .filter(s => s.statName === RangeStatName.value)
        .reduce((total, current) => total + current.value, 0);
});

const zoom = computed(() => {
    return allStats.value
        .filter(s => s.statName === ZoomStatName.value)
        .reduce((total, current) => total + current.value, 0);
});

const rangefinderMultiplier = computed(() => {
    const rangefinderPerk = props.selectedPerks.find(p => p?.perk.name === RangefinderPerkName.value);
    return rangefinderPerk ? 1.1 : 1;
});

const zoomMultiplier = computed(() => {
    const adjustment = rangeValues.value.zoomAdjustment;
    const adjustedZoom = zoom.value - adjustment;
    return adjustedZoom / 10;
});

const hipFireFalloffStart = computed(() => {
    const baseFalloffStart = rangeValues.value.baseFalloffStart;
    const rangePerStat = rangeValues.value.hipFireRangePerStat;
    console.log("hip fire values", baseFalloffStart, rangePerStat, range.value);
    return baseFalloffStart + (range.value * rangePerStat);
});

const aimDownSightsFalloffStart = computed(() => {
    return hipFireFalloffStart.value * zoomMultiplier.value * rangefinderMultiplier.value;
});

const text = computed(() => {
    console.log("calculated stats", range.value, zoom.value, rangefinderMultiplier.value);
    const roundedHipFire = Math.round((hipFireFalloffStart.value + Number.EPSILON) * 100) / 100;
    const roundedADS = Math.round((aimDownSightsFalloffStart.value + Number.EPSILON) * 100) / 100;
    return `${roundedHipFire}m / ${roundedADS}m`
});

function getStatsForItem(item: IPerk | undefined) {
    if (!item) return [];
    const bonuses = item.mainBonuses;
    return (selectionService.showCraftedBonus || isAdept.value)
        ? bonuses.concat(item.adeptOrCraftedBonuses)
        : bonuses;
}
</script>

<template>
    <ExtrasListItem label="Damage Falloff" v-if="hasRangeValues">
        <span>{{ text }}</span>
    </ExtrasListItem>
</template>

<style scoped>
</style>
