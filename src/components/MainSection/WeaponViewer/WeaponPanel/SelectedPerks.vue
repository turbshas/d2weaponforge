<script setup lang="ts">
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, ICraftingInfo, IMasterwork, IMod, IPerk, PerkColumnNumber, ISelectedPerkMap, IPerkOption } from '@/data/interfaces';

// Remove this if I refactor this component
interface ISelectedPerkDisplay {
    perkOption: IPerkOption | undefined;
    column: PerkColumnNumber | undefined,
    fullSize: boolean;
    hideHover: boolean;
}

const props = defineProps<{
    intrinsic: IArchetype | undefined,
    selectedPerks: ISelectedPerkMap<IPerkOption>,
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
    isAdept: boolean,
}>();

const emits = defineEmits<{
    (e: "perkClicked", column: PerkColumnNumber): void,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

const perks = computed(() => {
    const perkList: ISelectedPerkDisplay[] = [
        { perkOption: getPerkOptionFromPerkLike(props.intrinsic), column: undefined, fullSize: true,  hideHover: true, },
        { perkOption: props.selectedPerks[1], column: 1, fullSize: false, hideHover: false, },
        { perkOption: props.selectedPerks[2], column: 2, fullSize: false, hideHover: false, },
        { perkOption: props.selectedPerks[3], column: 3, fullSize: false, hideHover: false, },
        { perkOption: props.selectedPerks[4], column: 4, fullSize: false, hideHover: false, },
    ];
    const originPerk = props.selectedPerks[5];
    if (originPerk) {
        perkList.push({ perkOption: originPerk, column: 5, fullSize: false, hideHover: false, });
    }
    if (props.mod) {
        perkList.push({ perkOption: getPerkOptionFromPerkLike(props.mod), column: undefined, fullSize: true, hideHover: false, });
    }
    if (props.masterwork) {
        perkList.push({ perkOption: getPerkOptionFromPerkLike(props.masterwork), column: undefined, fullSize: true, hideHover: false, });
    }
    return perkList;
});

function getPerkOptionFromPerkLike(perk: IPerk | undefined) {
    if (!perk) return undefined;
    const perkOption: IPerkOption = {
        perk: perk,
        enhancedPerk: undefined,
        craftingInfo: undefined,
        currentlyCanRoll: true,
        useEnhanced: false,
    };
    return perkOption;
}

function getPerkOptionHash(perkOption: IPerkOption | undefined) {
    if (!perkOption) return 0;
    return perkOption.perk.hash;
}

function useEnhancedPerk(perkOption: IPerkOption | undefined) {
    return !!perkOption && perkOption.useEnhanced && !!perkOption.enhancedPerk;
}

function getActivePerk(perkOption: IPerkOption | undefined) {
    if (!perkOption) return undefined;
    return useEnhancedPerk(perkOption) ? perkOption.enhancedPerk : perkOption.perk;
}

function onPerkClicked(perkOption: IPerkOption | undefined) {
    if (!perkOption) return;
    perkOption.useEnhanced = !perkOption.useEnhanced;
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <PerkDisplay
            class="perk"
            v-for="perk of perks"
            :key="getPerkOptionHash(perk.perkOption)"

            :perk="getActivePerk(perk.perkOption)"
            :is-adept="props.isAdept"
            :crafting-info="perk.perkOption?.craftingInfo"
            :column="perk.column"
            :enhanced="useEnhancedPerk(perk.perkOption)"
            :enhanced-bonuses="[]"
            :full-size="perk.fullSize"
            :hide-hover="perk.hideHover"
            :selected="false"
            :retired="false"
            @perk-clicked="onPerkClicked(perk.perkOption)"
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
