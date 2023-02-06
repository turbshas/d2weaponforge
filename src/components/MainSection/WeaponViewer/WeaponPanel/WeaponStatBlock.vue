<script setup lang="ts">
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { destinyDataService } from '@/data/destinyDataService';
import type { IMasterwork, IMod, IPerk, IPerkBonus, IStatInfo } from '@/data/interfaces';
import { selectionService } from '@/data/selectionService';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
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
    statInfos: IStatInfo[],
    selectedPerks: (IPerk | undefined)[],
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
    isAdept: boolean,
}>();

const statInfoMap = computed(() => {
    const map: { [statHash: number]: IStatInfo | undefined } = {};
    for (const stat of props.statInfos) {
        map[stat.statHash] = stat;
    }
    return map;
});

const orderedStatInfos = computed(() => {
    const workingStatList: (IStatInfo | undefined)[] = statOrdering.value.map(_ => undefined);

    const stats = hashMapToArray(destinyDataService.stats);
    const x = statOrdering.value.map(y => stats.find(s => s.displayProperties.name == y))
        .map(y => y ? `${y.displayProperties.name}: ${y.index}` : "");
    for (const statInfo of props.statInfos) {
        const index = statOrdering.value.findIndex(name => name === statInfo.statName);
        if (index < 0) continue;
        // Some weapons (e.g. swords) have stats that appear in their scaledStats list but not their investmentStats.
        workingStatList[index] = statInfoMap.value[statInfo.statHash] || defaultStatInfo(statInfo.statHash);
    }

    return workingStatList.filter(s => !!s).map(s => s!);
});

const perkBonuses = computed(() => props.selectedPerks.reduce((total, current) => total.concat(getBonusesForPerk(current)), [] as IPerkBonus[]));
const masterworkBonuses = computed(() => getBonusesForPerk(props.masterwork));
const modBonuses = computed(() => getBonusesForPerk(props.mod));

function defaultStatInfo(statHash: number): IStatInfo {
    return {
        statHash: statHash,
        statName: "",
        investmentValue: 0,
        statDisplay: undefined,
    };
}

function getBonusesForPerk(perk: IPerk | undefined) {
    if (!perk) return [];
    const bonuses = perk.mainBonuses;
    return (selectionService.showCraftedBonus || props.isAdept)
        ? bonuses.concat(perk.adeptOrCraftedBonuses)
        : bonuses;
}

function getModifierForStat(statHash: number) {
    const bonusFromPerks = perkBonuses.value
        .filter(s => s.statHash === statHash)
        .map(s => s.value)
        .reduce((total, current) => total += current, 0);
    const bonusFromMasterwork = masterworkBonuses.value
        .filter(s => s.statHash === statHash)
        .map(s => s.value)
        .reduce((total, current) => total += current, 0)
    const bonusFromMod = modBonuses.value
        .filter(s => s.statHash === statHash)
        .map(s => s.value)
        .reduce((total, current) => total += current, 0)
    return bonusFromPerks + bonusFromMasterwork + bonusFromMod;
}
</script>

<template>
    <div class="list">
        <WeaponStatDisplay
            v-for="statInfo in orderedStatInfos"
            :key="statInfo.statHash"
            :stat-info="statInfo"
            :modifier="getModifierForStat(statInfo.statHash)"
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

