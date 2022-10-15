<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import PerkDisplay from '../../PerkDisplay.vue';


const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    perk1: DestinyInventoryItemDefinition | undefined,
    perk2: DestinyInventoryItemDefinition | undefined,
    perk3: DestinyInventoryItemDefinition | undefined,
    perk4: DestinyInventoryItemDefinition | undefined,
    masterwork: undefined,
}>();

const weaponSocketCategories = computed(() => {
    if (!props.weapon || !props.weapon.sockets) return [];
    return props.weapon.sockets.socketCategories;
});

const weaponSockets = computed(() => {
    if (!props.weapon || !props.weapon.sockets) return [];
    return props.weapon.sockets.socketEntries;
});

const intrinsicPerkSocketEntry = computed(() => {
    const intrinsicSocketCategory = weaponSocketCategories.value.find(c => destinyDataService.isIntrinsicPerkSocketCategory(c.socketCategoryHash));
    if (!intrinsicSocketCategory || intrinsicSocketCategory.socketIndexes.length === 0) return undefined;
    return weaponSockets.value[intrinsicSocketCategory.socketIndexes[0]];
});

const intrinsicPlugSet = computed(() => {
    if (!intrinsicPerkSocketEntry.value || !intrinsicPerkSocketEntry.value.reusablePlugSetHash) return undefined;
    return destinyDataService.getPlugSetDefinition(intrinsicPerkSocketEntry.value.reusablePlugSetHash);
});

const intrinsicPerk = computed(() => {
    if (!intrinsicPlugSet.value || intrinsicPlugSet.value.reusablePlugItems.length === 0) return undefined;
    return destinyDataService.getItemDefinition(intrinsicPlugSet.value.reusablePlugItems[0].plugItemHash);
});
</script>

<template>
    <div class="selected">
        <PerkDisplay :perk="intrinsicPerk"></PerkDisplay>
        <PerkDisplay :perk="perk1"></PerkDisplay>
        <PerkDisplay :perk="perk2"></PerkDisplay>
        <PerkDisplay :perk="perk3"></PerkDisplay>
        <PerkDisplay :perk="perk4"></PerkDisplay>
        <PerkDisplay :perk="masterwork"></PerkDisplay>
    </div>
</template>

<style scoped>
.selected {
    display: flex;
    flex-direction: row;
}
</style>
