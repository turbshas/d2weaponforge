<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkList from '../PerkList.vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const weaponSocketCategories = computed(() => {
    if (!props.weapon || !props.weapon.sockets) return [];
    return props.weapon.sockets.socketCategories;
});

const weaponSockets = computed(() => {
    if (!props.weapon || !props.weapon.sockets) return [];
    return props.weapon.sockets.socketEntries;
});

const weaponPerkSockets = computed(() => {
    const weaponPerkSocketCategory = weaponSocketCategories.value.find(c => destinyDataService.isWeaponPerkSocketCategory(c.socketCategoryHash));
    if (!weaponPerkSocketCategory) return [];
    return weaponPerkSocketCategory.socketIndexes.map(i => weaponSockets.value[i]);
});

const randomPerksSockets = computed(() => {
    return weaponPerkSockets.value.filter(se => !!se.randomizedPlugSetHash);
});

const originPerkSocketEntry = computed(() => {
    if (weaponPerkSockets.value.length === 0) return undefined;
    return weaponPerkSockets.value
        // Filter for weapon perk sockets that have a reusable plug set (random roll perks have a randomized plug set)
        .filter(s => !!s.reusablePlugSetHash)
        // Get the plug set from each socket entry, get the list of items from each plug set, filter for the sockets where at least 1 item is an origin perk
        .filter(s => {
            const plugSet = destinyDataService.getPlugSetDefinition(s.reusablePlugSetHash!);
            return plugSet
                && plugSet.reusablePlugItems.some(pi => {
                    const item = destinyDataService.getItemDefinition(pi.plugItemHash);
                    return item && item.itemCategoryHashes && item.itemCategoryHashes.some(destinyDataService.isOriginPerkItemCategory);
                });
        });
});

const allPerkSockets = computed(() => {
    const sockets = [...randomPerksSockets.value];
    if (originPerkSocketEntry.value) {
        sockets.push(...originPerkSocketEntry.value);
    }
    return sockets;
});

const perkPlugSets = computed(() => {
    // Either one of the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
    return allPerkSockets.value.map(ps => destinyDataService.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
});

const perkOptionListsPerSlot = computed(() => {
    return perkPlugSets.value.map(ps => ps?.reusablePlugItems.map(pi => destinyDataService.getItemDefinition(pi.plugItemHash)));
});

const curatedPerks = computed(() => {
    const sockets = [...randomPerksSockets.value];
    if (originPerkSocketEntry.value) {
        sockets.push(...originPerkSocketEntry.value);
    }
    return sockets.map(s => [destinyDataService.getItemDefinition(s.singleInitialItemHash)]);
});
</script>

<template>
    <div class="perks">
        <span class="title">Weapon Perks</span>
        <PerkList :perk-option-lists="perkOptionListsPerSlot"></PerkList>
        <span class="description">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <span class="title">Curated Roll</span>
        <PerkList :perk-option-lists="curatedPerks"></PerkList>
    </div>
</template>

<style scoped>
.perks {
    display: flex;
    flex-direction: column;
}

.title {
    flex-grow: 0;
    border-color: white;
    border-style: solid;
    border-width: 0 0 1px 0;
}
</style>
