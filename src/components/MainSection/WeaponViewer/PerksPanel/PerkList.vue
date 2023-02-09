<script setup lang="ts">
import type { IPerkColumn, IPerkOption, PerkColumnNumber } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import PerkDisplay from '../../../Common/PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: IPerkColumn[] | undefined,
    selectedPerks: { [column in PerkColumnNumber]: IPerkOption | undefined },
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

function isPerkSelected(column: PerkColumnNumber, perk: IPerkOption) {
    const selectedPerk = props.selectedPerks[column];
    return !!selectedPerk && selectedPerk.perk.hash === perk.perk.hash;
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
            :class="{ 'first': perkColumn.column === 1, }"
        >
            <PerkDisplay
                class="perk"
                v-for="(perk, index) in perkColumn.perks.perks"
                :key="index"
                :perk="perk.enhancedPerk || perk.perk"
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

<style scoped>
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
}
.column::before {
    content: "";
    position: absolute;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: hsla(0,0%,100%,.15);
}
@media screen and (min-width: 560px) {
    .column::before {
        left: -10px;
    }
}
.column:first-child {
    margin-left: 0;
}
.column:first-child::before {
    content: none;
}

.perk {
    margin-top: 10.8px;
}
.perk:first-child {
    margin-top: 0;
}
</style>
