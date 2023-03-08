<script setup lang="ts">
import EyeIcon from "@/assets/eye_icon.svg";
import type { ISelectedGear } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed, ref } from '@vue/reactivity';
import SelectedPerks from './SelectedPerks.vue';
import WeaponHeader from "./WeaponHeader.vue";
import WeaponStatBlock from './WeaponStatBlock.vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const showUiElements = ref(true);

const weapon = computed(() => props.selectedGear.weapon.value);

const screenshot = computed(() => {
    return weapon.value ? destinyDataService.getImageUrl(weapon.value.screenshotUrl) : undefined;
});

const statInfos = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);
const hideElementsAltText = "Show/hide UI elements.";

function onHideElementsClicked() {
    showUiElements.value = !showUiElements.value;
}
</script>

<template>
    <section class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }" :class="{ 'hide-ui': !showUiElements, }">
        <WeaponHeader class="hidable" :selected-gear="props.selectedGear"></WeaponHeader>
        <WeaponStatBlock class="stats hidable" :display-stats="statInfos"></WeaponStatBlock>
        <footer class="weapon-footer">
            <button class="hide-ui-button" @click="onHideElementsClicked">
                <img
                    class="eye"
                    :src="EyeIcon"
                    :alt="hideElementsAltText"
                   
                >
            </button>
            <SelectedPerks
                class="perks hidable"
                :intrinsic="weapon?.archetype"
                :selected-perks="props.selectedGear.perkOptionsMap.value"
                :masterwork="props.selectedGear.masterwork.value"
                :mod="props.selectedGear.mod.value"
                :catalyst="props.selectedGear.catalyst.value"
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
    padding: 1rem;

    background-size: cover;
    background-position-x: 100%;
    background-position-y: center;

    @media @narrow-phone {
        padding: 0.5rem;
    }
}

.hidable {
    transition-property: opacity;
    transition-duration: 0.6s;
    transition-timing-function: var(--easingCubic);

    .hide-ui & {
        opacity: 0;
    }
}

.stats {
    margin-top: 1rem;
    margin-bottom: 0.375rem;

    @media @large-screen {
        max-width: 50%;
    }
}

.weapon-footer {
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
