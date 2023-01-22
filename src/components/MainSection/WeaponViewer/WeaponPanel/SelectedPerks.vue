<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import type { ICraftingInfo } from '@/data/types';

// Remove this if I refactor this component
interface ISelectedPerkDisplay {
    perk: DestinyInventoryItemDefinition | undefined;
    craftingInfo: ICraftingInfo | undefined;
    enhanced: boolean;
    fullSize: boolean;
    hideHover: boolean;
    onPerkClicked: () => void;
}

const props = defineProps<{
    intrinsic: DestinyInventoryItemDefinition | undefined,
    perk1: DestinyInventoryItemDefinition | undefined,
    perk2: DestinyInventoryItemDefinition | undefined,
    perk3: DestinyInventoryItemDefinition | undefined,
    perk4: DestinyInventoryItemDefinition | undefined,
    isPerk3Enhanced: boolean,
    isPerk4Enhanced: boolean,
    originPerk: DestinyInventoryItemDefinition | undefined,
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
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
