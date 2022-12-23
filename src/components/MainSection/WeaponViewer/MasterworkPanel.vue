<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed, ref, watch } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { DataSearchString, type IWeapon } from '@/data/types';
import BuilderSection from '../../Common/BuilderSection.vue';
import OptionButton from '@/components/Common/OptionButton.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    masterwork: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "masterworkChanged", masterwork: DestinyInventoryItemDefinition | undefined): void
}>();

const weaponCategories = computed(() => {
    if (!props.weapon || !props.weapon.weapon.itemCategoryHashes) return [];
    return destinyDataService.itemCategories
        .filter(c => !!c.itemTypeRegex)
        .filter(c => props.weapon!.weapon.itemCategoryHashes!.includes(c.hash));
});

const weaponStats = computed(() => {
    if (!props.weapon || !props.weapon.weapon.stats) return [];
    return props.weapon.weapon.stats.stats;
});

const filteredMasterworkOptions = computed(() => {
    if (!props.weapon) return [];

    const categoryRegexList = weaponCategories.value.map(c => c.itemTypeRegex);
    const isSword = categoryRegexList.includes(DataSearchString.SwordTypeRegex);
    const isBow = categoryRegexList.includes(DataSearchString.BowTypeRegex);

    return props.weapon.masterworks
        .filter(mwItem => mwItem && mwItem.investmentStats.every(stat => !!weaponStats.value[stat.statTypeHash] || stat.isConditionallyActive))
        .filter(mwItem => {
            const name = getStatNameForMasterwork(mwItem);
            if (categoryRegexList.length === 0) return true;
            // Impact only applies to swords.
            if (name === DataSearchString.ImpactStatName) return isSword;
            // Swords can only have impact.
            if (isSword) return name === DataSearchString.ImpactStatName;
            // Bows have both draw time and charge time, and should only display draw time.
            if (name === DataSearchString.ChargeTimeStatName) return !isBow;
            return true;
        });
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
    console.log("masterwork is", props.masterwork);
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
    <BuilderSection class="masterwork" title="Weapon Masterwork">
        <div class="types">
            <OptionButton
                class="type"
                v-for="name of masterworkStatNames"
                :key="name"
                :text="name"
                :active="selectedMasterworkStatName === name"
                @toggled="() => onMasterworkChanged(name)"
            ></OptionButton>
        </div>
        <div class="level">
            <span class="text">{{ masterworkLevel }}</span>
            <div class="slider-wrapper">
                <input class="slider" type="range" min="0" max="10" v-model="masterworkLevel" @change="onMasterworkLevelChanged">
            </div>
        </div>
    </BuilderSection>

</template>

<style scoped>
.types {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 8px;
}

.type {
    margin-bottom: 8px;
    margin-right: 8px;
}

.level {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
}

.text {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 24px;
    height: 24px;
    box-sizing: content-box;
    margin-right: 8px;
    padding: 8px;

    background-color: hsla(0, 0%, 100%, 0.05);
    box-shadow: inset 0 0 0 1px #f5f5f5;

    font-size: 20px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    color: #fafafa;
}

.slider-wrapper {
    flex-grow: 1;

    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    padding-left: 16px;
    padding-right: 16px;
    box-shadow: inset 0 0 0 1px #f5f5f5;
}
.slider-wrapper::before, .slider-wrapper::after {
    content: "";
    pointer-events: none;
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;

    background-color: #1d1c25;
    border-width: 1px;
    border-style: solid;
    border-color: #fafafa;
    transform: translateY(-50%) rotate(45deg);
}
.slider-wrapper::before {
    left: calc(16px + 2px);
}
.slider-wrapper::after {
    right: calc(16px + 2px);
}

.slider {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 100%;
    padding-top: 1.6px;
    padding-bottom: 1.6px;
    cursor: pointer;
}
.slider::-webkit-slider-runnable-track, .slider::-moz-range-track {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: #fafafa;
    height: 2px
}
.slider::-webkit-slider-thumb, .slider::-moz-range-thumb {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    width: 16px;
    height: 16px;
    position: relative;
    background-color: #1d1c25;
    border-width: 1px;
    border-style: solid;
    border-color: #fafafa;
    cursor: grab;
    transform: rotate(45deg);
}
</style>
