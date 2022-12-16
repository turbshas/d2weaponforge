<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed, ref, watch } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    masterwork: DestinyInventoryItemDefinition | undefined,
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
        const name = getStatNameForMasterwork(plugItem);
        if (!name) continue;
        if (!masterworks[name]) {
            masterworks[name] = [];
        }
        masterworks[name].push(plugItem);
    }
    return masterworks;
});

function getStatNameForMasterwork(masterwork: DestinyInventoryItemDefinition) {
    const increasedStat = masterwork.investmentStats.find(stat => stat.value > 0);
    if (!increasedStat) return undefined;
    const statDefinition = destinyDataService.getStatDefinition(increasedStat.statTypeHash);
    if (!statDefinition) return undefined;
    return statDefinition.displayProperties.name
}

const masterworkStatNames = computed(() => Object.keys(masterworkOptionsByStatName.value));

const selectedMasterworkStatName = ref(initSelectedStatName());
const masterworkLevel = ref(initSelectedMasterworkLevel());
watch(() => props.masterwork, () => {
    selectedMasterworkStatName.value = initSelectedStatName();
    masterworkLevel.value = initSelectedMasterworkLevel();
});

function initSelectedStatName() {
    if (!props.masterwork) {
        return masterworkStatNames.value.length > 0 ? masterworkStatNames.value[0] : undefined;
    } else {
        return getStatNameForMasterwork(props.masterwork);
    }
}

function initSelectedMasterworkLevel() {
    if (!props.masterwork || !selectedMasterworkStatName.value) return 0;
    const masterworkOptions = masterworkOptionsByStatName.value[selectedMasterworkStatName.value];
    const masterworkIndex = masterworkOptions.findIndex(mw => mw.hash === props.masterwork!.hash);
    // Masterworks are 1-indexed, and level 0 masterworks don't actually exist, so would return -1 anyway.
    return masterworkIndex + 1;
}

function emitMasterworkChange(statName: string, level: number) {
    const masterworkList = masterworkOptionsByStatName.value[statName];
    // A value of 0 basically disables the masterwork, set to undefined
    const masterwork = level > 0 ? masterworkList[level - 1] : undefined;
    emits("masterworkChanged", masterwork);
}

function onMasterworkChanged(statName: string) {
    if (selectedMasterworkStatName.value === statName) return;
    // Needed in the case the MW is changed when the level is still 0.
    selectedMasterworkStatName.value = statName;
    emitMasterworkChange(statName, masterworkLevel.value);
}

function onMasterworkLevelChanged(event: Event) {
    if (!selectedMasterworkStatName.value) return;
    if (!event || !event.target) return;
    const target = event.target as HTMLInputElement;
    if (!target.value || (!target.valueAsNumber && target.valueAsNumber !== 0)) return;
    const newValue = target.valueAsNumber;
    emitMasterworkChange(selectedMasterworkStatName.value, newValue);
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
