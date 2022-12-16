<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed, ref } from 'vue';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "modChanged", mod: DestinyInventoryItemDefinition | undefined): void
}>();

const weaponSocketCategories = computed(() => props.weapon?.sockets?.socketCategories || []);
const weaponSockets = computed(() => props.weapon?.sockets?.socketEntries || []);

const weaponModSocketCategory = computed(() => weaponSocketCategories.value.find(c => {
    const socketCategory = destinyDataService.getSocketCategoryDefinition(c.socketCategoryHash);
    return socketCategory && socketCategory.displayProperties.name === "WEAPON MODS";
}));
const weaponModSockets = computed(() => weaponModSocketCategory.value ? weaponModSocketCategory.value.socketIndexes.map(i => weaponSockets.value[i]) : []);
const modSocket = computed(() => weaponModSockets.value.find(s => {
    const type = destinyDataService.getSocketTypeDefinition(s.socketTypeHash);
    return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes("v400.weapon.mod_empty"));
}));

const modOptions = computed(() => {
    if (!modSocket.value) return [];
    const plugSet = destinyDataService.getPlugSetDefinition(modSocket.value.reusablePlugSetHash!);
    const x = plugSet!.reusablePlugItems
        .map(pi => destinyDataService.getItemDefinition(pi.plugItemHash))
        .filter(pi => !!pi)
        .map(pi => pi!)
    return x;
});

function getModIconUrl(mod: DestinyInventoryItemDefinition) {
    return destinyDataService.getImageUrl(mod.displayProperties.icon);
}

function onModClicked(mod: DestinyInventoryItemDefinition) {
    // Selecting the current mod will de-select it
    const newMod = mod.hash === props.mod?.hash ? undefined : mod;
    emits("modChanged", newMod);
}
</script>

<template>
    <div class="mods">
        <span>Weapon Mods</span>
        <div class="list">
            <img
                class="mod"
                v-for="mod of modOptions"
                :key="mod.hash"
                :src="getModIconUrl(mod)"
                @click="onModClicked(mod)"
            >
        </div>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.mod {
    width: 48px;
    height: 48px;
}
</style>
