<script setup lang="ts">
import ElementLabel from '@/components/Common/ElementLabel.vue';
import OptionButton from '@/components/Common/OptionButton.vue';
import type { IMasterwork, ItemHash, LookupMap } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed, ref, watch } from 'vue';
import BuilderSection from '../../Common/BuilderSection.vue';

const props = defineProps<{
    masterworkList: ItemHash[],
    masterwork: IMasterwork | undefined,
}>();

const emits = defineEmits<{
    (e: "masterworkChanged", masterwork: IMasterwork | undefined): void
}>();

const masterworkItems = computed(() => {
    const mwItems: IMasterwork[] = [];
    for (const mwItemHash of props.masterworkList) {
        if (!mwItemHash) continue;
        const mwItem = destinyDataService.getMasterworkDefinition(mwItemHash);
        if (!mwItem) continue;
        mwItems.push(mwItem);
    }
    return mwItems;
})

const masterworkOptionsByStatName = computed(() => {
    const masterworks: LookupMap<string, IMasterwork[]> = {};

    for (const mw of masterworkItems.value) {
        const name = mw.name;
        if (!name) continue;
        if (!masterworks[name]) {
            masterworks[name] = [];
        }
        masterworks[name]!.push(mw);
    }
    return masterworks;
});

const masterworkStatNames = computed(() => Object.keys(masterworkOptionsByStatName.value));

const selectedMasterworkStatName = ref(initSelectedStatName());
const masterworkLevel = ref(initSelectedMasterworkLevel());
watch(() => props.masterworkList, () => {
    // If the masterwork list changed, the weapon changed. Re-initialized masterwork.
    selectedMasterworkStatName.value = initSelectedStatName();
    masterworkLevel.value = initSelectedMasterworkLevel();
});
watch(() => props.masterwork, (newValue) => {
    if (newValue) {
        // Only reset the selected stat name if a new one is selected (has a level > 0).
        // This way, if the user changes the MW name or sets the level back to 0 from a higher value,
        // it doesn't reset to the first stat name in the list.
        selectedMasterworkStatName.value = initSelectedStatName();
    }
    masterworkLevel.value = initSelectedMasterworkLevel();
});

function initSelectedStatName() {
    if (!props.masterwork) {
        return masterworkStatNames.value.length > 0 ? masterworkStatNames.value[0] : undefined;
    } else {
        return props.masterwork.name;
    }
}

function initSelectedMasterworkLevel() {
    if (!props.masterwork || !selectedMasterworkStatName.value) return 0;
    const masterworkOptions = masterworkOptionsByStatName.value[selectedMasterworkStatName.value];
    if (!masterworkOptions) return 0;
    const masterworkIndex = masterworkOptions.findIndex(mw => mw.hash === props.masterwork!.hash);
    // Masterworks are 1-indexed, and level 0 masterworks don't actually exist, so would return -1 anyway.
    return masterworkIndex + 1;
}

function emitMasterworkChange(statName: string, level: number) {
    const masterworkList = masterworkOptionsByStatName.value[statName];
    // A value of 0 basically disables the masterwork, set to undefined
    const masterwork = masterworkList && (level > 0) ? masterworkList[level - 1] : undefined;
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

const masterworkLevelSliderLabel = "Masterwork Level Slider";
</script>

<template>
    <BuilderSection class="masterwork" title="Weapon Masterwork">
        <div class="types" aria-label="Masterwork Type">
            <OptionButton
                class="type"
                v-for="name of masterworkStatNames"
                :key="name"
                :text="name"
                :active="selectedMasterworkStatName === name"
                @toggled="() => onMasterworkChanged(name)"
            ></OptionButton>
        </div>
        <div class="level" aria-label="Masterwork Level">
            <span class="text">{{ masterworkLevel }}</span>
            <ElementLabel class="slider-wrapper" :text="masterworkLevelSliderLabel">
                <input class="slider" type="range" min="0" max="10" v-model="masterworkLevel" @change="onMasterworkLevelChanged">
            </ElementLabel>
        </div>
    </BuilderSection>

</template>

<style scoped lang="less">
.types {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
}

.type {
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
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

    width: 1.5rem;
    height: 1.5rem;
    box-sizing: content-box;
    margin-right: 0.5rem;
    padding: 0.5rem;

    background-color: hsla(0, 0%, 100%, 0.05);
    box-shadow: inset 0 0 0 1px #f5f5f5;

    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.25rem;
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
    padding-left: 1rem;
    padding-right: 1rem;
    box-shadow: inset 0 0 0 1px #f5f5f5;

    &::before, &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        top: 50%;
        width: 0.5rem;
        height: 0.5rem;
        z-index: 1;

        background-color: #1d1c25;
        border-width: 1px;
        border-style: solid;
        border-color: #fafafa;
        transform: translateY(-50%) rotate(45deg);
    }
    &::before {
        left: calc(1rem + 2px);
    }
    &::after {
        right: calc(1rem + 2px);
    }
}

.slider {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 100%;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    cursor: pointer;

    &::-webkit-slider-runnable-track, &::-moz-range-track {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-color: #fafafa;
        height: 0.125rem;
    }
    &::-webkit-slider-thumb, &::-moz-range-thumb {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        width: 1rem;
        height: 1rem;
        position: relative;
        background-color: #1d1c25;
        border-width: 1px;
        border-style: solid;
        border-color: #fafafa;
        cursor: grab;
        transform: rotate(45deg);
    }
}
</style>
