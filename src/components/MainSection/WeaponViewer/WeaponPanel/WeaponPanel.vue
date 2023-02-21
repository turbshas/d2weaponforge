<script setup lang="ts">
import Tooltip from '@/components/Common/Tooltip.vue';
import WeaponIcon from '@/components/Common/WeaponIcon.vue';
import { destinyDataService } from '@/data/services';
import type { ISelectedGear, PerkColumnNumber } from '@/data/interfaces';
import { computed, ref } from '@vue/reactivity';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';
import EyeIcon from "@/assets/eye_icon.svg";

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const showUiElements = ref(true);

const weapon = computed(() => props.selectedGear.weapon.value);

const screenshot = computed(() => {
    return weapon.value ? destinyDataService.getImageUrl(weapon.value.screenshotUrl) : undefined;
});

const name = computed(() => weapon.value ? weapon.value.name : "");
const type = computed(() => weapon.value ? weapon.value.itemTypeDisplayName : "");
const description = computed(() => weapon.value ? weapon.value.description : "");
const elementName = computed(() => weapon.value ? weapon.value.damageType.name : "None");
const elementIcon = computed(() => weapon.value ? destinyDataService.getImageUrl(weapon.value.damageType.iconUrl) : undefined);
const elementLabel = computed(() => `Element Type: ${elementName.value}`);
const statInfos = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);
const hideElementsUrl = computed(() => EyeIcon);
const hideElementsAltText = "Show/hide UI elements.";

const weaponNameElement = ref<HTMLElement | null>(null);

function onHideElementsClicked() {
    showUiElements.value = !showUiElements.value;
}
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }" :class="{ 'hide-ui': !showUiElements, }">
        <div class="summary hidable">
            <div class="summary" :ref="(el) => { weaponNameElement = el as HTMLElement | null; }">
                <WeaponIcon class="icon" with-border :weapon="weapon"></WeaponIcon>
                <div class="description">
                    <h1>{{ name }}</h1>
                    <h3>{{ type }}</h3>
                </div>
            </div>
            <img class="element" :src="elementIcon" :alt="elementLabel">
            <Tooltip
                :target-element="weaponNameElement"
                title=""
                subtitle=""
                :description="description"
                :crafting-info="undefined"
                :effect="null"
                :bonuses="[]"
                :enhanced-bonuses="[]"
            ></Tooltip>
        </div>
        <WeaponStatBlock
            class="stats hidable"
            :display-stats="statInfos"
        ></WeaponStatBlock>
        <div class="selected-perks">
            <button class="hide-ui-button" @click="onHideElementsClicked">
                <img
                    class="eye"
                    :src="hideElementsUrl"
                    :alt="hideElementsAltText"
                   
                >
            </button>
            <SelectedPerks
                class="perks hidable"
                :intrinsic="weapon?.archetype"
                :selected-perks="props.selectedGear.perkOptionsMap.value"
                :masterwork="props.selectedGear.masterwork.value"
                :mod="props.selectedGear.mod.value"
                :is-adept="!!(weapon?.isAdept)"
            ></SelectedPerks>
        </div>
    </div>
</template>

<style scoped lang="less">
.panel {
    display: flex;
    flex-direction: column;
    aspect-ratio: 16 / 9;
    background-size: cover;
    padding: 16px;
    
    .hidable {
        transition-property: opacity;
        transition-duration: 0.3s;
        transition-timing-function: ease-in;
    }
    &.hide-ui {
        .hidable {
            opacity: 0;
        }
    }
}

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 52px;
    height: 52px;
    margin-right: 16px;
}

.description {
    display: flex;
    flex-direction: column;
    h1, h3 {
        margin: 0;
    }
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

.selected-perks {
    display: flex;
    margin-top: auto;
}

.hide-ui-button {
    cursor: pointer;
    align-self: flex-end;
    padding-left: 16px;

    background-color: transparent;
    color: transparent;
    border: none;

    .eye {
        width: 48px;
        height: 48px;
    }
}

.perks {
    margin-left: auto;
}
</style>
