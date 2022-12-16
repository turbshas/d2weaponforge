<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { IPerkOption } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { onMounted, watch } from 'vue';


const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "weaponChanged", weapon: DestinyInventoryItemDefinition | undefined): void,
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
    (e: "masterworkChanged", masterwork: DestinyInventoryItemDefinition | undefined): void,
    (e: "modChanged", mod: DestinyInventoryItemDefinition | undefined): void,
}>();

const weaponName = computed(() => props.weapon?.displayProperties.name);
const weaponHash = computed(() => props.weapon?.hash);
const perkHashes = computed(() => props.selectedPerks.map(p => p?.perk.hash));
const perk1Hash = computed(() => getPerkHashAtIndex(0));
const perk2Hash = computed(() => getPerkHashAtIndex(1));
const perk3Hash = computed(() => getPerkHashAtIndex(2));
const perk4Hash = computed(() => getPerkHashAtIndex(3));
const perk5Hash = computed(() => getPerkHashAtIndex(4));
const masterworkHash = computed(() => props.masterwork ? props.masterwork.hash : 0);
const modHash = computed(() => props.mod ? props.mod.hash : 0);

const path = computed(() => {
    // If no weapon is selected, don't set the path
    if (!weaponHash.value) return undefined;
    const basePath = `/w/${weaponHash.value}`;
    const perkQuery = `s=${perk1Hash.value},${perk2Hash.value},${perk3Hash.value},${perk4Hash.value},${masterworkHash.value},${modHash.value},${perk5Hash.value}`;
    return `${basePath}?${perkQuery}`;
});

onMounted(async () => {
    const url = new URL(window.location.href);
    if (!url.pathname) return;
    const weaponHashString = url.pathname.replace("/w/", "").replace("/", "");
    const urlWeaponHash = Number.parseInt(weaponHashString);

    const urlPerkHashes: number[] = [0, 0, 0, 0, 0, 0, 0]; // Random roll 1, 2, 3, 4, masterwork, mod, origin perk
    const perkQuery = url.searchParams.get("s");
    if (perkQuery) {
        const perkHashStrings = perkQuery.split(",");
        const parsedHashes = perkHashStrings.map(Number.parseInt);
        for (let i = 0; i < urlPerkHashes.length; i++) {
            if (parsedHashes.length > i && parsedHashes[i]) {
                urlPerkHashes[i] = parsedHashes[i];
            }
        }
    }

    await destinyDataService.manifestLoaded;
    const weapon = destinyDataService.getItemDefinition(urlWeaponHash);
    const allPerks = urlPerkHashes.map(h => {
        if (!h) return undefined;
        return destinyDataService.getItemDefinition(h);
    });
    const perks = [allPerks[0], allPerks[1], allPerks[2], allPerks[3], allPerks[6]];
    const masterwork = allPerks[4];
    const mod = allPerks[5];

    emits("weaponChanged", weapon);
    for (let i = 0; i < perks.length; i++) {
        const perk = perks[i];
        if (perk) {
            emits("perkSelected", i, undefined);
        }
    }
    if (masterwork) {
        emits("masterworkChanged", masterwork);
    }
    if (mod) {
        emits("modChanged", mod);
    }
});

watch(() => path.value, onPathChanged);

function onPathChanged() {
    window.history.pushState(path.value, "", path.value);
}

function getPerkHashAtIndex(index: number) {
    if (perkHashes.value.length <= index) return 0;
    const perkHash = perkHashes.value[index];
    return perkHash || 0;
}
</script>

<template>
    <div class="hidden"></div>
</template>

<style scoped>
.hidden {
    display: none;
    width: 0;
    height: 0;
    pointer-events: none;
}
</style>

