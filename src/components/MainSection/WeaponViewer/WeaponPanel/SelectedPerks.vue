<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import PerkDisplay from '../../PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";


const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
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

const backgroundUrl = computed(() => PerkPanelBackground);

function onPerkClicked(column: number) {
    emits("perkClicked", column);
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <PerkDisplay class="perk" :perk="intrinsicPerk" :selected="false" :retired="false" full-size></PerkDisplay>
        <PerkDisplay class="perk" :perk="perk1" :selected="false" :retired="false"></PerkDisplay>
        <PerkDisplay class="perk" :perk="perk2" :selected="false" :retired="false"></PerkDisplay>
        <PerkDisplay class="perk" :perk="perk3" :selected="false" :retired="false" :enhanced="isPerk3Enhanced" @click="onPerkClicked(2)"></PerkDisplay>
        <PerkDisplay class="perk" :perk="perk4" :selected="false" :retired="false" :enhanced="isPerk4Enhanced" @click="onPerkClicked(3)"></PerkDisplay>
        <PerkDisplay class="perk" :perk="originPerk" :selected="false" :retired="false" v-if="!!originPerk"></PerkDisplay>
        <PerkDisplay class="perk" :perk="mod" :selected="false" :retired="false" full-size v-if="!!mod"></PerkDisplay>
        <PerkDisplay class="perk" :perk="masterwork" :selected="false" :retired="false" full-size v-if="!!masterwork"></PerkDisplay>
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
