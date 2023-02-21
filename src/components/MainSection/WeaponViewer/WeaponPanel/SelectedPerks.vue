<script setup lang="ts">
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, IMasterwork, IMod, PerkColumnNumber, ISelectedPerkMap, IPerkOption, ISelectedPerk, ItemHash } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';

// Remove this if I refactor this component
interface ISelectedPerkDisplay {
    selectedPerk: ISelectedPerk | undefined;
    column: PerkColumnNumber | undefined,
    fullSize: boolean;
    hideHover: boolean;
}

const props = defineProps<{
    intrinsic: IArchetype | undefined,
    selectedPerks: ISelectedPerkMap<ISelectedPerk>,
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
    isAdept: boolean,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

const perks = computed(() => {
    const perkList: ISelectedPerkDisplay[] = [
        { selectedPerk: getSelectedPerkFromPerkLike(props.intrinsic?.intrinsicPerkHash), column: undefined, fullSize: true,  hideHover: true, },
        { selectedPerk: props.selectedPerks[1], column: 1, fullSize: false, hideHover: false, },
        { selectedPerk: props.selectedPerks[2], column: 2, fullSize: false, hideHover: false, },
        { selectedPerk: props.selectedPerks[3], column: 3, fullSize: false, hideHover: false, },
        { selectedPerk: props.selectedPerks[4], column: 4, fullSize: false, hideHover: false, },
    ];
    const originPerk = props.selectedPerks[5];
    if (originPerk) {
        perkList.push({ selectedPerk: originPerk, column: 5, fullSize: false, hideHover: false, });
    }
    if (props.mod) {
        perkList.push({ selectedPerk: getSelectedPerkFromPerkLike(props.mod?.hash), column: undefined, fullSize: true, hideHover: false, });
    }
    if (props.masterwork) {
        perkList.push({ selectedPerk: getSelectedPerkFromPerkLike(props.masterwork?.hash), column: undefined, fullSize: true, hideHover: false, });
    }
    return perkList;
});

function getSelectedPerkFromPerkLike(perk: ItemHash | undefined) {
    if (!perk) return undefined;
    const selectedPerk: ISelectedPerk = {
        perkOption: {
            perk: perk,
            enhancedPerk: undefined,
            craftingInfo: undefined,
            currentlyCanRoll: true,
        },
        useEnhanced: false,
    };
    return selectedPerk;
}

function getSelectedPerkHash(selectedPerk: ISelectedPerk | undefined) {
    if (!selectedPerk) return 0;
    return selectedPerk.perkOption.perk;
}

function useEnhancedPerk(selectedPerk: ISelectedPerk | undefined) {
    return !!selectedPerk && selectedPerk.useEnhanced && !!selectedPerk.perkOption.enhancedPerk;
}

function getActivePerk(selectedPerk: ISelectedPerk | undefined) {
    if (!selectedPerk) return undefined;
    if (useEnhancedPerk(selectedPerk) && !!selectedPerk.perkOption.enhancedPerk) {
        return destinyDataService.getEnhancedPerkDefinition(selectedPerk.perkOption.enhancedPerk);
    } else {
        return destinyDataService.getPerkDefinition(selectedPerk.perkOption.perk);
    }
}

function onPerkClicked(selectedPerk: ISelectedPerk | undefined) {
    if (!selectedPerk) return;
    selectedPerk.useEnhanced = !selectedPerk.useEnhanced;
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <PerkDisplay
            class="perk"
            v-for="perk of perks"
            :key="getSelectedPerkHash(perk.selectedPerk)"

            :perk="getActivePerk(perk.selectedPerk)"
            :is-adept="props.isAdept"
            :crafting-info="perk.selectedPerk?.perkOption.craftingInfo"
            :column="perk.column"
            :enhanced="useEnhancedPerk(perk.selectedPerk)"
            :enhanced-bonuses="[]"
            :full-size="perk.fullSize"
            :hide-hover="perk.hideHover"
            :selected="false"
            :retired="false"
            @perk-clicked="onPerkClicked(perk.selectedPerk)"
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
