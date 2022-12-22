<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { DataSearchString } from '@/data/types';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed, ref } from 'vue';
import PerkDisplay from '../../Common/PerkDisplay.vue';
import BuilderSection from '../../Common/BuilderSection.vue';

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
    return socketCategory && socketCategory.displayProperties.name === DataSearchString.WeaponModsSocketCategoryName;
}));
const weaponModSockets = computed(() => weaponModSocketCategory.value ? weaponModSocketCategory.value.socketIndexes.map(i => weaponSockets.value[i]) : []);
const modSocket = computed(() => weaponModSockets.value.find(s => {
    const type = destinyDataService.getSocketTypeDefinition(s.socketTypeHash);
    return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes(DataSearchString.WeaponModPlugWhitelistCategoryId));
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

function onModClicked(mod: DestinyInventoryItemDefinition) {
    // Selecting the current mod will de-select it
    const newMod = mod.hash === props.mod?.hash ? undefined : mod;
    emits("modChanged", newMod);
}
</script>

<template>
    <BuilderSection class="mods" title="Weapon Mods">
        <div class="list">
            <PerkDisplay
                class="mod"
                v-for="mod of modOptions"
                :key="mod.hash"
                :perk="mod"
                :selected="false"
                :retired="false"
                full-size
                @click="onModClicked(mod)"
            ></PerkDisplay>
        </div>
    </BuilderSection>
</template>

<style scoped>
.list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 48px);
    gap: 8px;
    justify-content: space-between;
}

.mod {
    width: 48px;
    height: 48px;
}
</style>
