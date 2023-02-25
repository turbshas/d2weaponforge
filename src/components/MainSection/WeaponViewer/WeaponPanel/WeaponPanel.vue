<script setup lang="ts">
import EyeIcon from "@/assets/eye_icon.svg";
import Tooltip from '@/components/Common/Tooltip.vue';
import WeaponIcon from '@/components/Common/WeaponIcon.vue';
import type { ISelectedGear } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed, ref } from '@vue/reactivity';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

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
    <section class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }" :class="{ 'hide-ui': !showUiElements, }">
        <header class="summary hidable" aria-label="Weapon Description">
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
        </header>
        <WeaponStatBlock
            class="stats hidable"
            :display-stats="statInfos"
        ></WeaponStatBlock>
        <footer class="selected-perks">
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
        </footer>
    </section>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.panel {
    display: flex;
    flex-direction: column;
    background-size: cover;
    background-position-x: 100%;
    background-position-y: center;
    padding: 1rem;
    
    .hidable {
        transition-property: opacity;
        transition-duration: 0.6s;
        transition-timing-function: var(--easingCubic);
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
    width: 3.25rem;
    height: 3.25rem;
    margin-right: 1rem;
}

.description {
    display: flex;
    flex-direction: column;

    h1, h3 {
        margin: 0;
        text-transform: uppercase;
    }
    h1 {
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.4rem;

        @media @large-screen {
            font-size: 2rem;
            line-height: 2rem;
        }
    }
    h3 {
        font-size: 1rem;
        font-weight: 500;
        text-transform: uppercase;
    }
}

.element {
    margin-left: auto;
    width: 2.625rem;
    height: 2.625rem;
}

.stats {
    margin-top: 1rem;
    margin-bottom: 0.375rem;

    @media @large-screen {
        max-width: 50%;
    }
}

.selected-perks {
    display: flex;
    margin-top: auto;
}

.hide-ui-button {
    cursor: pointer;
    margin-right: auto;
    padding-top: 0.375rem;
    padding-left: 1rem;

    background-color: transparent;
    color: transparent;
    border: none;

    .eye {
        width: 3rem;
        height: 3rem;
    }
}

.perks {
    margin-right: auto;

    @media @large-screen {
        margin-right: 0;
    }
}
</style>
