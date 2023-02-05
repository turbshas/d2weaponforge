<script setup lang="ts">
import { WeaponCategoryRangeValuesMap } from '@/data/constants';
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import type { IPerkOption, IWeapon } from '@/data/interfaces';
import { hashMapToArray } from '@/data/util';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

// TODO: find a better way to identify specific items in the manifest, perhaps index? unsure if that is consistent across languages
const RangeStatName = computed(() => DataSearchStrings.Stats.Range.value);
const ZoomStatName = computed(() => DataSearchStrings.Stats.Zoom.value);
const RangefinderPerkName = computed(() => DataSearchStrings.Misc.RangefinderPerkName.value);

const weaponCategory = computed(() => {
    if (!props.weapon || !props.weapon.weapon.itemCategoryHashes) return undefined;
    console.log("weapon stats", hashMapToArray(props.weapon.weapon.stats!.stats).map(s => destinyDataService.getStatDefinition(s.statHash)));
    const categoryHashes = props.weapon.weapon.itemCategoryHashes;
    return destinyDataService.itemCategories
        .filter(c => !!c.itemTypeRegex && !!WeaponCategoryRangeValuesMap.value[c.itemTypeRegex])
        .find(c => categoryHashes.includes(c.hash));
});

const weaponCategoryRegex = computed(() => {
    return weaponCategory.value ? weaponCategory.value.itemTypeRegex : "";
});

const rangeValues = computed(() => {
    return WeaponCategoryRangeValuesMap.value[weaponCategoryRegex.value];
});

const hasRangeValues = computed(() => !!rangeValues.value);

const allStats = computed(() => {
    const weaponStats = getStatsForItem(props.weapon?.weapon);
    const perkStats = props.selectedPerks.map(p => getStatsForItem(p?.perk)).reduce((total, current) => total.concat(current), []);
    const masterworkStats = getStatsForItem(props.masterwork)
        .filter(s => selectionService.showCraftedBonus
            || (props.weapon && props.weapon.isAdept)
            || !s.isConditionallyActive);
    const modStats = getStatsForItem(props.mod);
    console.log("damage falloff props", props);
    console.log("all stats", weaponStats, weaponStats.map(s => destinyDataService.getStatDefinition(s.statTypeHash)), perkStats, masterworkStats, modStats);
    return [...weaponStats, ...perkStats, ...masterworkStats, ...modStats];
});

const range = computed(() => {
    return allStats.value
        .filter(s => {
            const statDef = destinyDataService.getStatDefinition(s.statTypeHash);
            return !!statDef && statDef.displayProperties.name === RangeStatName.value;
        })
        .reduce((total, current) => total + current.value, 0);
});

const zoom = computed(() => {
    return allStats.value
        .filter(s => {
            const statDef = destinyDataService.getStatDefinition(s.statTypeHash);
            return !!statDef && statDef.displayProperties.name === ZoomStatName.value;
        })
        .reduce((total, current) => total + current.value, 0);
});

const rangefinderMultiplier = computed(() => {
    const rangefinderPerk = props.selectedPerks.find(p => p?.perk.displayProperties.name === RangefinderPerkName.value);
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
