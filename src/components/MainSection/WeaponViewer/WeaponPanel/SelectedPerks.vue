<script setup lang="ts">
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { IArchetype, ICraftingInfo, IMasterwork, IMod, IPerk } from '@/data/interfaces';

// Remove this if I refactor this component
interface ISelectedPerkDisplay {
    perk: IPerk | undefined;
    craftingInfo: ICraftingInfo | undefined;
    enhanced: boolean;
    fullSize: boolean;
    hideHover: boolean;
    onPerkClicked: () => void;
}

const props = defineProps<{
    intrinsic: IArchetype | undefined,
    perk1: IPerk | undefined,
    perk2: IPerk | undefined,
    perk3: IPerk | undefined,
    perk4: IPerk | undefined,
    isPerk3Enhanced: boolean,
    isPerk4Enhanced: boolean,
    originPerk: IPerk | undefined,
    masterwork: IMasterwork | undefined,
    mod: IMod | undefined,
    isAdept: boolean,
}>();

const emits = defineEmits<{
    (e: "perkClicked", column: number): void,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

const perks = computed(() => {
    const perkList: ISelectedPerkDisplay[] = [
        { perk: props.intrinsic, craftingInfo: undefined, fullSize: true,  hideHover: true,  enhanced: false, onPerkClicked: () => {}, },
        { perk: props.perk1,     craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, },
        { perk: props.perk2,     craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, },
        { perk: props.perk3,     craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: props.isPerk3Enhanced, onPerkClicked: () => onPerkClicked(2), },
        { perk: props.perk4,     craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: props.isPerk4Enhanced, onPerkClicked: () => onPerkClicked(3), },
    ];
    if (!!props.originPerk) {
        perkList.push({ perk: props.originPerk, craftingInfo: undefined, fullSize: false, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    if (!!props.mod) {
        perkList.push({ perk: props.mod, craftingInfo: undefined, fullSize: true, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    if (!!props.masterwork) {
        perkList.push({ perk: props.masterwork, craftingInfo: undefined, fullSize: true, hideHover: false, enhanced: false, onPerkClicked: () => {}, });
    }
    return perkList;
});

function onPerkClicked(column: number) {
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
