<script setup lang="ts">
import type { IPerkSlotOptions } from '@/data/types';
import { computed, ref } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkDisplay from '../../PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: IPerkSlotOptions[] | null,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: DestinyInventoryItemDefinition | undefined): void,
}>();

const selectedPerksMap = ref<{ [column: number]: DestinyInventoryItemDefinition | undefined }>({ 1: undefined, 2: undefined, 3: undefined, 4: undefined, });

const perkSlots = computed(() => {
    if (!props.perkOptionLists) return [];
    return props.perkOptionLists;
});

function onPerkClicked(column: number, perk: DestinyInventoryItemDefinition) {
    if (selectedPerksMap.value[column] && selectedPerksMap.value[column]!.hash === perk.hash) {
        // This perk is already selected - unselect it.
        selectedPerksMap.value[column] = undefined;
    } else {
        // New perk was selected
        selectedPerksMap.value[column] = perk;
    }
    emits("perkSelected", column, selectedPerksMap.value[column]);
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
                :retired="!perk.currentlyCanRoll"
                :enhanced="!!perk.enhancedPerk"
                @click="perk => onPerkClicked(column, perk)"
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
