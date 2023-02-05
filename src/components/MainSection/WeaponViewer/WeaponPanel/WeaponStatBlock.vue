<script setup lang="ts">
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { destinyDataService } from '@/data/destinyDataService';
import { selectionService } from '@/data/selectionService';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition, DestinyItemInvestmentStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import WeaponStatDisplay from './WeaponStatDisplay.vue';

const statOrdering = computed(() => [
    DataSearchStrings.Stats.Impact.value,
    DataSearchStrings.Stats.BlastRadius.value,

    DataSearchStrings.Stats.Range.value,
    DataSearchStrings.Stats.Accuracy.value,
    DataSearchStrings.Stats.Velocity.value,

    DataSearchStrings.Stats.ShieldDuration.value,
    DataSearchStrings.Stats.Stability.value,
    DataSearchStrings.Stats.Handling.value,
    DataSearchStrings.Stats.ReloadSpeed.value,
    DataSearchStrings.Stats.AimAssistance.value,
    DataSearchStrings.Stats.AirborneEffectiveness.value,
    DataSearchStrings.Stats.Zoom.value,
    DataSearchStrings.Stats.RecoilDirection.value,

    DataSearchStrings.Stats.SwingSpeed.value,
    DataSearchStrings.Stats.ChargeRate.value,
    DataSearchStrings.Stats.GuardEfficiency.value,
    DataSearchStrings.Stats.GuardResistance.value,
    DataSearchStrings.Stats.GuardEndurance.value,

    DataSearchStrings.Stats.Rpm.value,
    DataSearchStrings.Stats.DrawTime.value,
    DataSearchStrings.Stats.ChargeTime.value,

    DataSearchStrings.Stats.MagSize.value,
    DataSearchStrings.Stats.AmmoCapacity.value,
    DataSearchStrings.Stats.InventorySize,
]);

const props = defineProps<{
    statGroup: DestinyStatGroupDefinition | undefined,
    investmentStats: DestinyItemInvestmentStatDefinition[],
    selectedPerks: (DestinyInventoryItemDefinition | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
    isAdept: boolean,
}>();

const investmentStatMap = computed(() => {
    const map: { [statHash: number]: DestinyItemInvestmentStatDefinition | undefined } = {};
    for (const stat of props.investmentStats) {
        map[stat.statTypeHash] = stat;
    }
    return map;
});

const scaledStats = computed(() => props.statGroup ? props.statGroup.scaledStats : []);

const orderedInvestmentStats = computed(() => {
    const workingStatList: (DestinyItemInvestmentStatDefinition | undefined)[] = statOrdering.value.map(_ => undefined);

    const stats = hashMapToArray(destinyDataService.stats);
    const x = statOrdering.value.map(y => stats.find(s => s.displayProperties.name == y))
        .map(y => y ? `${y.displayProperties.name}: ${y.index}` : "");
        console.log("stat order", x, props.statGroup);
    for (const stat of scaledStats.value) {
        const statDef = getStatDefinition(stat.statHash);
        if (!statDef) continue;
        const index = statOrdering.value.findIndex(name => name === statDef.displayProperties.name);
        if (index < 0) continue;
        // Some weapons (e.g. swords) have stats that appear in their scaledStats list but not their investmentStats.
        workingStatList[index] = investmentStatMap.value[stat.statHash] || defaultInvestmentStatDefinition(stat.statHash);
    }

    return workingStatList.filter(s => !!s).map(s => s!);
});

function defaultInvestmentStatDefinition(statHash: number): DestinyItemInvestmentStatDefinition {
    return {
        isConditionallyActive: false,
        value: 0,
        statTypeHash: statHash,
    };
}

function getStatDisplayOverride(statHash: number) {
    return props.statGroup && props.statGroup.overrides && props.statGroup.overrides[statHash];
}

function getStatDisplayDefinition(statHash: number) {
    return scaledStats.value.find(s => s.statHash === statHash);
}

function getStatDefinition(statHash: number) {
    return destinyDataService.getStatDefinition(statHash);
}

function getModifierForStat(statHash: number) {
    const bonusFromPerks = props.selectedPerks
        .filter(p => !!p)
        .map(p =>
            p!.investmentStats
                .filter(s => s.statTypeHash === statHash)
                .map(s => s.value)
                .reduce((total, current) => total += current, 0))
        .reduce((total, current) => total += current, 0); 
    const bonusFromMasterwork = props.masterwork
        ? props.masterwork.investmentStats
            .filter(s => s.statTypeHash === statHash)
            .map(s => selectionService.showCraftedBonus || props.isAdept || !s.isConditionallyActive ? s.value : 0)
            .reduce((total, current) => total += current, 0)
        : 0;
    const bonusFromMod = props.mod
        ? props.mod.investmentStats
            .filter(s => s.statTypeHash === statHash)
            .map(s => s.value)
            .reduce((total, current) => total += current, 0)
        : 0;
    return bonusFromPerks + bonusFromMasterwork + bonusFromMod;
}
</script>

<template>
    <div class="list">
        <WeaponStatDisplay
            v-for="investmentStat in orderedInvestmentStats"
            :key="investmentStat.statTypeHash"
            :override="getStatDisplayOverride(investmentStat.statTypeHash)"
            :stat-display="getStatDisplayDefinition(investmentStat.statTypeHash)"
            :stat-group="props.statGroup"
            :definition="getStatDefinition(investmentStat.statTypeHash)"
            :investment-value="investmentStat"
            :modifier="getModifierForStat(investmentStat.statTypeHash)"
        ></WeaponStatDisplay>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>

