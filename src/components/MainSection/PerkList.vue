<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkDisplay from './PerkDisplay.vue';

const props = defineProps<{
    perkOptionLists: ((DestinyInventoryItemDefinition | undefined)[] | undefined)[] | null,
}>();

const perkSlots = computed(() => {
    if (!props.perkOptionLists) return [];
    return props.perkOptionLists;
});
</script>

<template>
    <div class="grid">
        <div
            class="column"
            v-for="(slot, index) in perkSlots"
            :key="index"
        >
            <PerkDisplay
                v-for="(perk, index) in slot"
                :key="index"
                :perk="perk"
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
