<script setup lang="ts">
import type { IPerkOption, IPerkSlotOptions } from '@/data/types';
import { computed } from '@vue/reactivity';
import PerkDisplay from '../../PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: IPerkSlotOptions[] | null,
    selectedPerks: { [column: number]: IPerkOption | undefined },
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
    const newPerk = props.selectedPerks[column] && props.selectedPerks[column]!.perk.hash === perk.perk.hash ? undefined : perk;
    emits("perkSelected", column, newPerk);
}
</script>

<template>
    <div class="grid">
        <div
            class="column"
            v-for="(slot, column) in perkSlots"
            :key="column"
        >
            <PerkDisplay
                v-for="(perk, index) in slot.options"
                :key="index"
                :perk="perk.enhancedPerk || perk.perk"
                :selected="isPerkSelected(column, perk)"
                :retired="!perk.currentlyCanRoll"
                :enhanced="!!perk.enhancedPerk"
                @click="onPerkClicked(column, perk)"
            ></PerkDisplay>
        </div>
    </div>
</template>

<style scoped>
.grid {
    display: flex;
    flex-direction: row;
}

.column {
    display: flex;
    flex-direction: column;
}
</style>
