<script setup lang="ts">
import { computed } from 'vue';
import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition } from 'bungie-api-ts/destiny2';
import PerkList from './PerkList.vue';
import { destinyDataService } from '@/data/destinyDataService';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: DestinyInventoryItemDefinition | undefined): void,
}>();

const weaponSocketCategories = computed(() => props.weapon?.sockets?.socketCategories || []);
const weaponSockets = computed(() => props.weapon?.sockets?.socketEntries || []);

const weaponPerkSockets = computed(() => {
    const weaponPerkSocketCategory = weaponSocketCategories.value.find(c => destinyDataService.isWeaponPerkSocketCategory(c.socketCategoryHash));
    if (!weaponPerkSocketCategory) return [];
    return weaponPerkSocketCategory.socketIndexes.map(i => weaponSockets.value[i]);
});

const perkSocketsNoTracker = computed(() => {
    return weaponPerkSockets.value.filter(s => {
        const type = destinyDataService.getSocketTypeDefinition(s.socketTypeHash);
        return type && !type.plugWhitelist.some(destinyDataService.isTrackerPlugCategory);
    });
});

const perkPlugSets = computed(() => {
    // Either one of the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
    return perkSocketsNoTracker.value.map(ps => destinyDataService.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
});

const perkOptionListsPerSlot = computed(() => {
    return perkPlugSets.value.map(ps => {
        const uniquePlugItems: (DestinyInventoryItemDefinition | undefined)[] = [];
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};
        for (const plugItem of ps?.reusablePlugItems || []) {
            if (!seenPlugItems[plugItem.plugItemHash]) {
                uniquePlugItems.push(destinyDataService.getItemDefinition(plugItem.plugItemHash));
                seenPlugItems[plugItem.plugItemHash] = true;
            }
        }
        return uniquePlugItems;
    });
});

const curatedPerks = computed(() => perkSocketsNoTracker.value.map(s => [destinyDataService.getItemDefinition(s.singleInitialItemHash)]));
const hasCuratedPerks = computed(() => curatedPerks.value.length > 0);

function onPerkSelected(column: number, perk: DestinyInventoryItemDefinition | undefined) {
    emits("perkSelected", column, perk);
}
</script>

<template>
    <div class="perks">
        <span class="title">Weapon Perks</span>
        <PerkList :perk-option-lists="perkOptionListsPerSlot" @perk-selected="onPerkSelected"></PerkList>
        <span class="description">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <div v-if="hasCuratedPerks">
            <span class="title">Curated Roll</span>
            <PerkList :perk-option-lists="curatedPerks"></PerkList>
        </div>
    </div>
</template>

<style scoped>
.perks {
    display: flex;
    flex-direction: column;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Cpath fill='%23fff' opacity='.03' d='M21.747 19.5H30V21h-8.253zm-2.253 2.246h1.5V30h-1.5z'/%3E%3Cpath fill='%23fff' opacity='.15' d='M21.001 21v-1.5h-1.507V21h1.507z'/%3E%3Cpath fill='%23fff' opacity='.03' d='M19.494 0h1.5v3.752h-1.5zm2.253 4.498H30v1.5h-8.253zm-2.253 2.246h1.5v12.01h-1.5zM6.748 4.5H18.75V6H6.748zM4.494 0h1.5v3.754h-1.5zM0 4.5h3.749V6H0z'/%3E%3Cpath fill='%23fff' opacity='.15' d='M5.994 4.5h-1.5V6h1.508V4.5h-.008zm14.996 0h-1.5V6h1.508V4.5h-.008z'/%3E%3Cpath fill='%23fff' opacity='.03' d='M6.738 19.5h12.01V21H6.738zM4.494 6.746h1.5v12.009h-1.5zM0 19.5h3.749V21H0z'/%3E%3Cpath fill='%23fff' opacity='.15' d='M4.494 19.5h1.499V21H4.494z'/%3E%3Cpath fill='%23fff' opacity='.03' d='M4.494 21.746h1.5V30h-1.5z'/%3E%3C/svg%3E");
    background-size: auto;
}

.title {
    flex-grow: 0;
    border-color: white;
    border-style: solid;
    border-width: 0 0 1px 0;
}
</style>
