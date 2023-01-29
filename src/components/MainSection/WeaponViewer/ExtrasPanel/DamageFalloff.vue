<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import { DataSearchString, type IPerkOption } from '@/data/types';
import { hashMapToArray } from '@/data/util';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

// TODO: right now we only display hip-fire/ADS falloff start distance but this stores all relevant info in case that changes
interface IWeaponRangeValues {
    baseFalloffStart: number;
    hipFireRangePerStat: number;
    zoomAdjustment: number;
}

// TODO: find a better way to identify specific items in the manifest, perhaps index? unsure if that is consistent across languages
const RangeStatName = DataSearchString.RangeStatName;
const ZoomStatName = DataSearchString.ZoomStatName;
const RangefinderPerkName = DataSearchString.RangefinderPerkName;

// Numbers from: https://docs.google.com/spreadsheets/d/1B2zWeT99SksMzmptNeIt66Mv8YZu38R7t-KR50BJ0p0/view#gid=817864056
// TODO: numbers for exotics are different, like vex that acts as an auto rifle
const weaponCategoryRangeValuesMap: { [itemRegex: string]: IWeaponRangeValues } = {
    // TODO: hand cannons are different for 120s, include that somehow
    // TODO: some weapons have a "zoom scalar" that is added to the base zoom?
    [DataSearchString.AutoRifleTypeRegex]: { baseFalloffStart: 10.8, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },
    [DataSearchString.HandCannonTypeRegex]: { baseFalloffStart: 16, hipFireRangePerStat: 0.096, zoomAdjustment: 0.25, },
    // TODO: pulse rifles are all over the place in zoom/"modified zoom multiplier"
    [DataSearchString.PulseRifleTypeRegex]: { baseFalloffStart: 15, hipFireRangePerStat: 0.0685, zoomAdjustment: 0.25, },
    [DataSearchString.ScoutRifleTypeRegex]: { baseFalloffStart: 29.2, hipFireRangePerStat: 0.169, zoomAdjustment: 1.25, },
    [DataSearchString.SidearmTypeRegex]: { baseFalloffStart: 11.6, hipFireRangePerStat: 0.034, zoomAdjustment: 0.25, },
    [DataSearchString.SubmachinegunTypeRegex]: { baseFalloffStart: 8.19, hipFireRangePerStat: 0.09576, zoomAdjustment: 1.25, },

    [DataSearchString.FusionRifleTypeRegex]: { baseFalloffStart: 8.2, hipFireRangePerStat: 0.036, zoomAdjustment: 2, },
    [DataSearchString.TraceRifleTypeRegex]: { baseFalloffStart: 10.05, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },

    [DataSearchString.MachineGunTypeRegex]: { baseFalloffStart: 10.05, hipFireRangePerStat: 0.107, zoomAdjustment: 0.25, },

    /*
    // TODO: what to do with these? ignore them?
    ".*_fusion_rifle_line": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
    // TODO: shotgun just has 1 number, presumably it's not affected by zoom
    ".*_shotgun": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
    ".*_sniper_rifle": { baseFalloffStart: 0, hipFireRangePerStat: 0, zoomAdjustment: 0, },
    */
};

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const weaponCategory = computed(() => {
    if (!props.weapon || !props.weapon.itemCategoryHashes) return undefined;
    console.log("weapon stats", hashMapToArray(props.weapon.stats!.stats).map(s => destinyDataService.getStatDefinition(s.statHash)));
    return destinyDataService.itemCategories
        .filter(c => !!c.itemTypeRegex && !!weaponCategoryRangeValuesMap[c.itemTypeRegex])
        .find(c => props.weapon!.itemCategoryHashes!.includes(c.hash));
});

const weaponCategoryRegex = computed(() => {
    return weaponCategory.value ? weaponCategory.value.itemTypeRegex : "";
});

const rangeValues = computed(() => {
    return weaponCategoryRangeValuesMap[weaponCategoryRegex.value];
});

const hasRangeValues = computed(() => !!rangeValues.value);

const allStats = computed(() => {
    const weaponStats = getStatsForItem(props.weapon);
    const perkStats = props.selectedPerks.map(p => getStatsForItem(p?.perk)).reduce((total, current) => total.concat(current), []);
    const masterworkStats = getStatsForItem(props.masterwork).filter(s => selectionService.showCraftedBonus || !s.isConditionallyActive);
    const modStats = getStatsForItem(props.mod);
    console.log("damage falloff props", props);
    console.log("all stats", weaponStats, weaponStats.map(s => destinyDataService.getStatDefinition(s.statTypeHash)), perkStats, masterworkStats, modStats);
    return [...weaponStats, ...perkStats, ...masterworkStats, ...modStats];
});

const range = computed(() => {
    return allStats.value
        .filter(s => {
            const statDef = destinyDataService.getStatDefinition(s.statTypeHash);
            return !!statDef && statDef.displayProperties.name === RangeStatName;
        })
        .reduce((total, current) => total + current.value, 0);
});

const zoom = computed(() => {
    return allStats.value
        .filter(s => {
            const statDef = destinyDataService.getStatDefinition(s.statTypeHash);
            return !!statDef && statDef.displayProperties.name === ZoomStatName;
        })
        .reduce((total, current) => total + current.value, 0);
});

const rangefinderMultiplier = computed(() => {
    const rangefinderPerk = props.selectedPerks.find(p => p?.perk.displayProperties.name === RangefinderPerkName);
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

function getStatsForItem(item: DestinyInventoryItemDefinition | undefined) {
    if (!item) return [];
    if (item.stats) {
        return hashMapToArray(item.stats.stats)
            .map(s => {
                return {
                    isConditionallyActive: false,
                    statTypeHash: s.statHash,
                    value: s.value,
                };
            });
    } else if (item.investmentStats) {
        return item.investmentStats;
    }
    return [];
}
</script>

<template>
    <ExtrasListItem label="Damage Falloff" v-if="hasRangeValues">
        <span>{{ text }}</span>
    </ExtrasListItem>
</template>

<style scoped>
</style>
