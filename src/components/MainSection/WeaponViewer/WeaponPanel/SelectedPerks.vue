<script setup lang="ts">
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, IMasterwork, IMod, ISelectedPerk, ISelectedPerkMap } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';

const props = defineProps<{
    intrinsic: IArchetype | undefined,
    selectedPerks: ISelectedPerkMap<ISelectedPerk>,
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
    isAdept: boolean,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

const intrinsicPerk = computed(() => destinyDataService.getPerkDefinition(props.intrinsic?.intrinsicPerkHash));
const originPerk = computed(() => destinyDataService.getPerkDefinition(props.selectedPerks[5]?.perkOption.perk));
const masterworkPerk = computed(() => destinyDataService.getMasterworkDefinition(props.masterwork?.hash));
const modPerk = computed(() => destinyDataService.getModDefinition(props.mod?.hash));

const perk1 = computed(() => destinyDataService.getPerkDefinition(props.selectedPerks[1]?.perkOption.perk));
const perk1Crafting = computed(() => props.selectedPerks[1]?.perkOption.craftingInfo);
const perk2 = computed(() => destinyDataService.getPerkDefinition(props.selectedPerks[2]?.perkOption.perk));
const perk2Crafting = computed(() => props.selectedPerks[2]?.perkOption.craftingInfo);

const perk3Normal = computed(() => destinyDataService.getPerkDefinition(props.selectedPerks[3]?.perkOption.perk));
const perk3Enhanced = computed(() => destinyDataService.getEnhancedPerkDefinition(props.selectedPerks[3]?.perkOption.enhancedPerk));
const perk3CanBeEnhanced = computed(() => !!props.selectedPerks[3] && !!props.selectedPerks[3].perkOption.enhancedPerk);
const isPerk3Enhanced = computed(() => !!props.selectedPerks[3] && !!props.selectedPerks[3].perkOption.enhancedPerk && props.selectedPerks[3].useEnhanced);
const perk3 = computed(() => isPerk3Enhanced.value ? perk3Enhanced.value : perk3Normal.value);
const perk3Crafting = computed(() => props.selectedPerks[3]?.perkOption.craftingInfo);

const perk4Normal = computed(() => destinyDataService.getPerkDefinition(props.selectedPerks[4]?.perkOption.perk));
const perk4Enhanced = computed(() => destinyDataService.getEnhancedPerkDefinition(props.selectedPerks[4]?.perkOption.enhancedPerk));
const perk4CanBeEnhanced = computed(() => !!props.selectedPerks[4] && !!props.selectedPerks[4].perkOption.enhancedPerk);
const isPerk4Enhanced = computed(() => !!props.selectedPerks[4] && !!props.selectedPerks[4].perkOption.enhancedPerk && props.selectedPerks[4].useEnhanced);
const perk4 = computed(() => isPerk4Enhanced.value ? perk4Enhanced.value : perk4Normal.value);
const perk4Crafting = computed(() => props.selectedPerks[4]?.perkOption.craftingInfo);

function onPerk3Clicked() {
    if (!props.selectedPerks[3] || !perk3CanBeEnhanced.value) return;
    props.selectedPerks[3].useEnhanced = !props.selectedPerks[3].useEnhanced;
}

function onPerk4Clicked() {
    if (!props.selectedPerks[4] || !perk4CanBeEnhanced.value) return;
    props.selectedPerks[4].useEnhanced = !props.selectedPerks[4].useEnhanced;
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }" aria-label="Selected Perks">
        <PerkDisplay
            class="perk"
            :perk="intrinsicPerk"
            :is-adept="props.isAdept"
            :crafting-info="undefined"
            :selected="false"
            :retired="false"
            full-size
            hide-hover
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            :perk="perk1"
            :crafting-info="perk1Crafting"
            :column="1"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            :perk="perk2"
            :crafting-info="perk2Crafting"
            :column="2"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            :perk="perk3"
            :enhanced="isPerk3Enhanced"
            :crafting-info="perk3Crafting"
            :column="3"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
            @perk-clicked="onPerk3Clicked"
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            :perk="perk4"
            :enhanced="isPerk4Enhanced"
            :crafting-info="perk4Crafting"
            :column="4"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
            @perk-clicked="onPerk4Clicked"
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            v-if="!!originPerk"
            :perk="originPerk"
            :crafting-info="undefined"
            :column="5"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            v-if="!!masterworkPerk"
            :perk="masterworkPerk"
            :crafting-info="undefined"
            :column="undefined"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
            full-size
        ></PerkDisplay>

        <PerkDisplay
            class="perk"
            v-if="!!modPerk"
            :perk="modPerk"
            :crafting-info="undefined"
            :column="undefined"
            :is-adept="props.isAdept"
            :selected="false"
            :retired="false"
            full-size
        ></PerkDisplay>
    </div>
</template>

<style scoped>
.selected {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 8px;
}

.perk {
    margin-left: 16px;
}
.perk:first-child {
    margin-left: 0;
}
</style>
