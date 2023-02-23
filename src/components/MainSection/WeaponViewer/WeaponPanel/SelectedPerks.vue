<script setup lang="ts">
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, IMasterwork, IMod, IPerk, ISelectedPerk, ISelectedPerkMap, ItemHash, PerkColumnNumber } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';

// Remove this if I refactor this component
interface IResolvedSelectedPerk extends ISelectedPerk {
    perkItem: IPerk;
    enhancedPerkItem: IPerk | undefined;
}

interface ISelectedPerkDisplay {
    selectedPerk: IResolvedSelectedPerk | undefined;
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
        { selectedPerk: resolveFromIntrinsic(props.intrinsic?.intrinsicPerkHash), column: undefined, fullSize: true,  hideHover: true, },
        { selectedPerk: resolveFromSelectedPerk(props.selectedPerks[1]), column: 1, fullSize: false, hideHover: false, },
        { selectedPerk: resolveFromSelectedPerk(props.selectedPerks[2]), column: 2, fullSize: false, hideHover: false, },
        { selectedPerk: resolveFromSelectedPerk(props.selectedPerks[3]), column: 3, fullSize: false, hideHover: false, },
        { selectedPerk: resolveFromSelectedPerk(props.selectedPerks[4]), column: 4, fullSize: false, hideHover: false, },
    ];
    const originPerk = props.selectedPerks[5];
    if (originPerk) {
        perkList.push({ selectedPerk: resolveFromSelectedPerk(originPerk), column: 5, fullSize: false, hideHover: false, });
    }
    if (props.mod) {
        perkList.push({ selectedPerk: resolveFromMod(props.mod?.hash), column: undefined, fullSize: true, hideHover: false, });
    }
    if (props.masterwork) {
        perkList.push({ selectedPerk: resolveFromMasterwork(props.masterwork?.hash), column: undefined, fullSize: true, hideHover: false, });
    }
    console.log("getting selected perks", props.selectedPerks, perkList);
    return perkList;
});

function resolveFromIntrinsic(intrinsicPerkHash: ItemHash | undefined) {
    if (!intrinsicPerkHash) return undefined;
    const intrinsic = destinyDataService.getPerkDefinition(intrinsicPerkHash);
    return resolveWithPerkItems(intrinsic);
}

function resolveFromSelectedPerk(selectedPerk: ISelectedPerk | undefined) {
    if (!selectedPerk) return undefined;
    const perk = destinyDataService.getPerkDefinition(selectedPerk.perkOption.perk);
    const enhanced = destinyDataService.getEnhancedPerkDefinition(selectedPerk.perkOption.enhancedPerk || 0);
    return resolveWithPerkItems(perk, enhanced);
}

function resolveFromMasterwork(masterworkHash: ItemHash | undefined) {
    if (!masterworkHash) return undefined;
    const masterwork = destinyDataService.getMasterworkDefinition(masterworkHash);
    return resolveWithPerkItems(masterwork);
}

function resolveFromMod(modHash: ItemHash | undefined) {
    if (!modHash) return undefined;
    const mod = destinyDataService.getModDefinition(modHash);
    return resolveWithPerkItems(mod);
}

function resolveWithPerkItems(perkItem: IPerk | undefined, enhancedPerkItem: IPerk | undefined = undefined) {
    if (!perkItem) return undefined;
    const selectedPerk: IResolvedSelectedPerk = {
        perkOption: {
            perk: perkItem.hash,
            enhancedPerk: undefined,
            craftingInfo: undefined,
            currentlyCanRoll: true,
        },
        useEnhanced: false,
        perkItem: perkItem,
        enhancedPerkItem: enhancedPerkItem,
    };
    return selectedPerk;
}

function getSelectedPerkKey(selectedPerk: ISelectedPerk | undefined, index: number) {
    const hash = selectedPerk ? selectedPerk.perkOption.perk : 0;
    return `${hash}_${index}`;
}

function useEnhancedPerk(selectedPerk: ISelectedPerk | undefined) {
    return !!selectedPerk && selectedPerk.useEnhanced && !!selectedPerk.perkOption.enhancedPerk;
}

function getActivePerk(selectedPerk: IResolvedSelectedPerk | undefined) {
    if (!selectedPerk) return undefined;
    if (useEnhancedPerk(selectedPerk) && !!selectedPerk.enhancedPerkItem) {
        return selectedPerk.enhancedPerkItem;
    } else {
        return selectedPerk.perkItem;
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
            v-for="(perk, index) of perks"
            :key="getSelectedPerkKey(perk.selectedPerk, index)"

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
