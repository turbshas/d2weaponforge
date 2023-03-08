<script setup lang="ts">
import type { IPerkColumn, IPerkOption, ISelectedPerk, ISelectedPerkMap, PerkColumnNumber } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from '@vue/reactivity';
import PerkDisplay from '../../../Common/PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: IPerkColumn[] | undefined,
    selectedPerks: ISelectedPerkMap<ISelectedPerk>,
    hideEnhanced?: boolean,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: PerkColumnNumber, perk: IPerkOption | undefined): void,
}>();

const perkColumns = computed(() => {
    if (!props.perkOptionLists) return [];
    return props.perkOptionLists.map((l, index) => {
        const perkColumn: { column: PerkColumnNumber, perks: IPerkColumn } = {
            column: (index + 1) as PerkColumnNumber,
            perks: l,
        };
        return perkColumn;
    });
});

function getPerkItem(perkOption: IPerkOption) {
    return destinyDataService.getPerkDefinition(perkOption.perk);
}

function getEnhancedPerkItem(perkOption: IPerkOption) {
    if (props.hideEnhanced || !perkOption.enhancedPerk) return undefined;
    return destinyDataService.getEnhancedPerkDefinition(perkOption.enhancedPerk);
}

function isPerkSelected(column: PerkColumnNumber, perk: IPerkOption) {
    const selectedPerk = props.selectedPerks[column];
    return !!selectedPerk && selectedPerk.perkOption.perk === perk.perk;
}

function onPerkClicked(column: PerkColumnNumber, perk: IPerkOption) {
    // If perk is already selecting, clicking it again deselects it
    const newPerk = isPerkSelected(column, perk) ? undefined : perk;
    emits("perkSelected", column, newPerk);
}
</script>

<template>
    <div class="grid">
        <div
            class="column"
            v-for="perkColumn in perkColumns"
            :key="perkColumn.column"
            :class="{ 'first': perkColumn.column === 1, 'empty': perkColumn.perks.perks.length === 0, }"
        >
            <PerkDisplay
                class="perk"
                v-for="(perk, index) in perkColumn.perks.perks"
                :key="index"
                :perk="getPerkItem(perk)"
                :enhanced-perk="getEnhancedPerkItem(perk)"
                :column="perkColumn.column"
                :is-adept="false"
                :crafting-info="perk.craftingInfo"
                :selected="isPerkSelected(perkColumn.column, perk)"
                :retired="!perk.currentlyCanRoll"
                :enhanced="!!perk.enhancedPerk && !props.hideEnhanced"
                @perk-clicked="onPerkClicked(perkColumn.column, perk)"
            ></PerkDisplay>
        </div>
    </div>
</template>

<style scoped lang="less">
.grid {
    display: flex;
    flex-direction: row;
    justify-content: center;

    margin-bottom: 24px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
}

.column {
    display: flex;
    flex-direction: column;
    position: relative;

    margin-left: 20px;

    &.empty {
        display: none;
    }

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 2px;
        height: 100%;
        background-color: hsla(0,0%,100%,.15);
    }

    &:first-child {
        margin-left: 0;

        &::before {
            content: none;
        }
    }
}

.perk {
    margin-top: 10.8px;
}
.perk:first-child {
    margin-top: 0;
}
</style>
