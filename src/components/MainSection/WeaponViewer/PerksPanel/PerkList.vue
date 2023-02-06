<script setup lang="ts">
import type { IPerkColumn, IPerkOption } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import PerkDisplay from '../../../Common/PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: IPerkColumn[] | undefined,
    selectedPerks: { [column: number]: IPerkOption | undefined },
    hideEnhanced?: boolean,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
}>();

const perkSlots = computed(() => {
    if (!props.perkOptionLists) return [];
    return props.perkOptionLists;
});

function isPerkSelected(column: number, perk: IPerkOption) {
    return !!props.selectedPerks && !!props.selectedPerks[column] && props.selectedPerks[column]!.perk.hash === perk.perk.hash;
}

function onPerkClicked(column: number, perk: IPerkOption) {
    // If perk is already selecting, clicking it again deselects it
    const newPerk = isPerkSelected(column, perk) ? undefined : perk;
    emits("perkSelected", column, newPerk);
}
</script>

<template>
    <div class="grid">
        <div
            class="column"
            v-for="(perks, column) in perkSlots"
            :key="column"
            :class="{ 'first': column === 0, }"
        >
            <PerkDisplay
                class="perk"
                v-for="(perk, index) in perks.perks"
                :key="index"
                :perk="perk.enhancedPerk || perk.perk"
                :is-adept="false"
                :crafting-info="perk.craftingInfo"
                :selected="isPerkSelected(column, perk)"
                :retired="!perk.currentlyCanRoll"
                :enhanced="!!perk.enhancedPerk && !props.hideEnhanced"
                @perk-clicked="onPerkClicked(column, perk)"
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
