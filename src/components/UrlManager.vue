<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import type { IPerkOption } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { watch } from 'vue';


const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

// TODO: might need to convert these to one big event with all data at once
const emits = defineEmits<{
    (e: "urlParsed",
        weapon: DestinyInventoryItemDefinition | undefined,
        perks: (IPerkOption | undefined)[],
        masterwork: DestinyInventoryItemDefinition | undefined,
        mod: DestinyInventoryItemDefinition | undefined,
    ): void,
}>();

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

watch(() => destinyDataService.gameData, onGameDataChanged);

function onGameDataChanged() {
    const url = new URL(window.location.href);
    if (!url.pathname) return;
    const weaponHashString = url.pathname.replace("/w/", "").replace("/", "");
    const urlWeaponHash = Number.parseInt(weaponHashString);

    const urlPerkHashes: number[] = [0, 0, 0, 0, 0, 0, 0]; // Random roll 1, 2, 3, 4, masterwork, mod, origin perk
    const perkQuery = url.searchParams.get("s");
    if (perkQuery) {
        const perkHashStrings = perkQuery.split(",");
        const parsedHashes = perkHashStrings.map(s => Number.parseInt(s, 10));
        for (let i = 0; i < urlPerkHashes.length; i++) {
            if (parsedHashes.length > i && parsedHashes[i]) {
                urlPerkHashes[i] = parsedHashes[i];
            }
        }
    }

    const weapon = destinyDataService.getItemDefinition(urlWeaponHash);
    // If weapon doesn't exist, the other values aren't valid.
    if (!weapon) return

    const allPerks = urlPerkHashes.map(h => {
        if (!h) return undefined;
        return destinyDataService.getItemDefinition(h);
    });
    // Perk 1, 2, 3, 4, Origin
    const perks = [allPerks[0], allPerks[1], allPerks[2], allPerks[3], allPerks[6]];
    const masterwork = allPerks[4];
    const mod = allPerks[5];

    const perkSlotOptions = destinyDataService.getPerkOptionsForWeapon(weapon);
    const allPerkOptions = perkSlotOptions.reduce<IPerkOption[]>((total, current) => { total.push(...current.options); return total; }, []);

    const perkOptionLookup: { [hash: number]: IPerkOption } = {};
    const enhancedPerksLookup: { [hash: number]: boolean } = {};
    for (const perkOption of allPerkOptions) {
        perkOptionLookup[perkOption.perk.hash] = perkOption;
        if (perkOption.enhancedPerk) {
            perkOptionLookup[perkOption.enhancedPerk.hash] = perkOption;
            enhancedPerksLookup[perkOption.enhancedPerk.hash] = true;
        }
    }

    const perkOptions = perks.map((p, i) => {
        if (p && perkOptionLookup[p.hash]) {
            // TODO: need to convert perk to IPerkOption to send event
            const perkOption = perkOptionLookup[p.hash];
            if (enhancedPerksLookup[p.hash]) {
                // TODO: enhanced selection is determined by a different interface - need to figure out what to do here
            }
            return perkOption;
        }
    });
    emits("urlParsed", weapon, perkOptions, masterwork, mod);
}

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

