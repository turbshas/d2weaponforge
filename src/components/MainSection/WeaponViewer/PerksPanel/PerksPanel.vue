<script setup lang="ts">
import { computed } from 'vue';
import PerkList from './PerkList.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import BuilderSection from '../../../Common/BuilderSection.vue';
import type { IPerkColumn, IPerkOption, PerkColumnNumber, SelectedPerkMap } from '@/data/interfaces';

const props = defineProps<{
    randomRollPerks: IPerkColumn[],
    curatedPerks: IPerkColumn[],
    selectedPerks: SelectedPerkMap,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: PerkColumnNumber, perk: IPerkOption | undefined): void,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

const hasCuratedPerks = computed(() => props.curatedPerks.length > 0);

function onPerkSelected(column: PerkColumnNumber, perk: IPerkOption | undefined) {
    emits("perkSelected", column, perk);
}
</script>

<template>
    <div class="perks">
        <BuilderSection title="Weapon Perks" class="no-shadow">
            <PerkList
                :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
                :perk-option-lists="props.randomRollPerks"
                :selected-perks="selectedPerks"
                @perk-selected="onPerkSelected"
            ></PerkList>
        </BuilderSection>
        <span class="note">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <BuilderSection title="Curated Roll" class="no-shadow" v-if="hasCuratedPerks">
            <PerkList
                :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
                :perk-option-lists="curatedPerks"
                :selected-perks="selectedPerks"
                hide-enhanced
                @perk-selected="onPerkSelected"
            ></PerkList>
        </BuilderSection>
    </div>
</template>

<style scoped>
.perks {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 40px 0 rgba(0,0,0,.5);
    background-color: #12171c;
    background-size: auto;
    margin-bottom: auto;
}

.no-shadow {
    box-shadow: none;
}

.note {
    margin-top: -8px;
    margin-bottom: 8px;

    color: #b78c25;
    text-align: center;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    font-size: 12.8px;
    font-weight: bold;
}
</style>
