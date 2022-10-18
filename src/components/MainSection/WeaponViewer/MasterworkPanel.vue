<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { hashMapToArray } from '@/data/util';
import { computed, ref } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { watch } from 'vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "masterworkChanged", masterwork: DestinyInventoryItemDefinition | undefined): void
}>();

const weaponSocketCategories = computed(() => props.weapon?.sockets?.socketCategories || []);
const weaponSockets = computed(() => props.weapon?.sockets?.socketEntries || []);

const weaponModSocketCategory = computed(() => weaponSocketCategories.value.find(c => {
    const socketCategory = destinyDataService.getSocketCategoryDefinition(c.socketCategoryHash);
    return socketCategory && socketCategory.displayProperties.name === "WEAPON MODS";
}));
const weaponModSockets = computed(() => weaponModSocketCategory.value ? weaponModSocketCategory.value.socketIndexes.map(i => weaponSockets.value[i]) : []);
const masterworkSocket = computed(() => weaponModSockets.value.find(s => {
    const type = destinyDataService.getSocketTypeDefinition(s.socketTypeHash);
    return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes("v400.plugs.weapons.masterworks"));
}));

const weaponStats = computed(() => {
    if (!props.weapon || !props.weapon.stats) return [];
    return props.weapon.stats.stats;
});

const filteredMasterworkOptions = computed(() => {
    if (!masterworkSocket.value) return [];
    return masterworkSocket.value.reusablePlugItems
        .map(pi => destinyDataService.getItemDefinition(pi.plugItemHash))
        // TODO: the conditionally active thing is for adepts or crafted weapon > lvl 20, maybe find a better way to do this?
        .filter(mwItem => mwItem && mwItem.investmentStats.every(stat => !!weaponStats.value[stat.statTypeHash] || stat.isConditionallyActive))
        .map(i => i!);
});

const masterworkOptionsByStatName = computed(() => {
    const masterworks: { [statName: string]: DestinyInventoryItemDefinition[] } = {};
    for (const plugItem of filteredMasterworkOptions.value) {
        const increasedStat = plugItem.investmentStats.find(stat => stat.value > 0);
        if (!increasedStat) continue;
        const statDefinition = destinyDataService.getStatDefinition(increasedStat.statTypeHash);
        if (!statDefinition) continue;
        const name = statDefinition.displayProperties.name
        if (!masterworks[name]) {
            masterworks[name] = [];
        }
        masterworks[name].push(plugItem);
    }
    return masterworks;
});

const masterworkStatNames = computed(() => Object.keys(masterworkOptionsByStatName.value));

const selectedMasterworkName = ref(masterworkStatNames.value.length > 0 ? masterworkStatNames.value[0] : undefined);
const masterworkLevel = ref(0);

function emitMasterworkChange(statName: string, level: number) {
    const masterworkList = masterworkOptionsByStatName.value[statName];
    // A value of 0 basically disables the masterwork, set to undefined
    const masterwork = level > 0 ? masterworkList[level - 1] : undefined;
    emits("masterworkChanged", masterwork);
}

function onMasterworkChanged(statName: string) {
    if (selectedMasterworkName.value === statName) return;
    selectedMasterworkName.value = statName;
    emitMasterworkChange(selectedMasterworkName.value, masterworkLevel.value);
}

function onMasterworkLevelChanged() {
    if (!selectedMasterworkName.value) return;
    emitMasterworkChange(selectedMasterworkName.value, masterworkLevel.value);
}
</script>

<template>
    <div class="masterwork">
        <span>Weapon Masterwork</span>
        <div class="types">
            <button v-for="name of masterworkStatNames" :key="name" @click="() => onMasterworkChanged(name)">{{ name }}</button>
        </div>
        <div class="level">
            <span>{{ masterworkLevel }}</span>
            <input class="slider" type="range" min="0" max="10" v-model="masterworkLevel" @change="onMasterworkLevelChanged">
        </div>
    </div>

</template>

<style scoped>
.masterwork {
    display: flex;
    flex-direction: column;
}

.types {
    display: flex;
    flex-direction: row;
}

.level {
    display: flex;
    flex-direction: row;
}

.slider {
    flex-grow: 1;
}
</style>
