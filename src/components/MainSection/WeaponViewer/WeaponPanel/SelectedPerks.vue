<script setup lang="ts">
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, ICraftingInfo, IMasterwork, IMod, IPerk, PerkColumnNumber, ISelectedPerkMap, IPerkOption } from '@/data/interfaces';

// Remove this if I refactor this component
interface ISelectedPerkDisplay {
    perk: IPerk | undefined;
    column: PerkColumnNumber | undefined,
    craftingInfo: ICraftingInfo | undefined;
    enhanced: boolean;
    fullSize: boolean;
    hideHover: boolean;
    onPerkClicked: () => void;
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
    const perkOption3 = props.selectedPerks[3];
    const perk3 = (perkOption3?.useEnhanced) ? perkOption3.enhancedPerk : (perkOption3?.perk);
    const perkOption4 = props.selectedPerks[4];
    const perk4 = (perkOption4?.useEnhanced) ? perkOption4.enhancedPerk : (perkOption4?.perk);

    const perkList: ISelectedPerkDisplay[] = [
        { perk: props.intrinsic, column: undefined, craftingInfo: undefined, fullSize: true,  hideHover: true,  enhanced: false, onPerkClicked: () => {}, },
        { perk: props.selectedPerks[1]?.perk, column: 1, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, },
        { perk: props.selectedPerks[2]?.perk, column: 2, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, },
        { perk: perk3, column: 3, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: !!(perkOption3?.useEnhanced), onPerkClicked: () => onPerkClicked(3), },
        { perk: perk4, column: 4, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: !!(perkOption4?.useEnhanced), onPerkClicked: () => onPerkClicked(4), },
    ];
    const originPerk = props.selectedPerks[5];
    if (originPerk) {
        perkList.push({ perk: originPerk.perk, column: 5, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    if (props.mod) {
        perkList.push({ perk: props.mod, column: undefined, craftingInfo: undefined, fullSize: true, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    if (props.masterwork) {
        perkList.push({ perk: props.masterwork, column: undefined, craftingInfo: undefined, fullSize: true, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    return perkList;
});

function onPerkClicked(column: PerkColumnNumber) {
    emits("perkClicked", column);
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <PerkDisplay
            v-for="perk of perks"
            :key="perk.perk?.hash"
            class="perk"
            :perk="perk.perk"
            :is-adept="props.isAdept"
            :crafting-info="perk.craftingInfo"
            :column="perk.column"
            :enhanced="perk.enhanced"
            :full-size="perk.fullSize"
            :hide-hover="perk.hideHover"
            :selected="false"
            :retired="false"
            @perk-clicked="perk.onPerkClicked()"
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
