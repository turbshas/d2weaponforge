<script setup lang="ts">
import { destinyDataService } from '@/data/services';
import { PageSelection, type ISelectedGear, type IWeapon, type PerkColumnNumber, type ISelectedPerkMap, type ItemHash, type ISelectedPerk, type IMasterwork, type IMod } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import { watch } from 'vue';

const rootBasePath = import.meta.env.BASE_URL;
const useHash = import.meta.env.VITE_USE_HASH;

const hashSuffixText = "/#!";
const weaponSuffixText = "/w/";

const props = defineProps<{
    page: PageSelection,
    selectedGear: ISelectedGear,
}>();

// TODO: might need to convert these to one big event with all data at once
const emits = defineEmits<{
    (e: "urlParsed",
        page: PageSelection,
        weapon: IWeapon | undefined,
        perks: ISelectedPerkMap<ISelectedPerk>,
        masterwork: IMasterwork | undefined,
        mod: IMod | undefined,
    ): void,
}>();

const weaponHash = computed(() => props.selectedGear.weapon.value?.hash);
const perk1Hash = computed(() => getPerkHashAtIndex(1));
const perk2Hash = computed(() => getPerkHashAtIndex(2));
const perk3Hash = computed(() => getPerkHashAtIndex(3));
const perk4Hash = computed(() => getPerkHashAtIndex(4));
const perk5Hash = computed(() => getPerkHashAtIndex(5));
const masterworkHash = computed(() => props.selectedGear.masterwork.value ? props.selectedGear.masterwork.value.hash : 0);
const modHash = computed(() => props.selectedGear.mod.value ? props.selectedGear.mod.value.hash : 0);

const hashSuffix = computed(() => useHash ? hashSuffixText : "");
const basePath = computed(() => `${rootBasePath}${hashSuffix.value}`)
const path = computed(() => {
    if (props.page === PageSelection.Home) {
        return `${basePath.value}`;
    } else if (props.page === PageSelection.Glossary) {
        return `${basePath.value}/glossary`;
    } else if (props.page === PageSelection.Compare) {
        return `${basePath.value}/compare`;
    } else if (props.page === PageSelection.Weapon) {
        // If no weapon is selected, don't set the path
        if (!weaponHash.value) return undefined;
        const weaponBasePath = `${basePath.value}${weaponSuffixText}${weaponHash.value}`;
        const perkQuery = `s=${perk1Hash.value},${perk2Hash.value},${perk3Hash.value},${perk4Hash.value},${masterworkHash.value},${modHash.value},${perk5Hash.value}`;
        return `${weaponBasePath}?${perkQuery}`;
    }
});

watch(() => destinyDataService.gameData, onGameDataChanged);
watch(() => path.value, onPathChanged);

function onGameDataChanged() {
    const perkMap: ISelectedPerkMap<ISelectedPerk> = {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
    };
    const normalizedUrlString = window.location.href.replace(hashSuffixText, "");
    const url = new URL(normalizedUrlString);
    if (!url.pathname) {
        emits("urlParsed", PageSelection.Home, undefined, perkMap, undefined, undefined);
        return;
    }

    const lowerCasePath = url.pathname.toLocaleLowerCase();
    if (lowerCasePath.includes("glossary")) {
        emits("urlParsed", PageSelection.Glossary, undefined, perkMap, undefined, undefined);
        return;
    } else if (lowerCasePath.includes("compare")) {
        emits("urlParsed", PageSelection.Compare, undefined, perkMap, undefined, undefined);
        return;
    }

    const weaponHashDelimiterIndex = lowerCasePath.indexOf(weaponSuffixText);
    if (weaponHashDelimiterIndex < 0) {
        // No weapon hash
        return;
    }
    const weaponHashStringIndex = weaponHashDelimiterIndex + weaponSuffixText.length;
    const weaponHashString = lowerCasePath.substring(weaponHashStringIndex);
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

    const weapon = destinyDataService.getWeapon(urlWeaponHash);
    // If weapon doesn't exist, the other values aren't valid.
    if (!weapon) return

    const perkHashes: [number, number, number, number, number] = [urlPerkHashes[0], urlPerkHashes[1], urlPerkHashes[2], urlPerkHashes[3], urlPerkHashes[6]];
    const masterworkHash = urlPerkHashes[4];
    const modHash = urlPerkHashes[5];

    const perks = perkHashes.map((hash, index) => {
        const perkColumn = weapon.perks.perkColumns[index];
        const perk = !!perkColumn && perkColumn.perks.find(p => (p.enhancedPerk === hash) || (p.perk === hash));

        if (!perk) return undefined;
        const selectedPerk: ISelectedPerk = {
            perkOption: perk,
            useEnhanced: !!perk && (hash === perk.enhancedPerk),
        };
        return selectedPerk;
    });
    perkMap[1] = perks[0];
    perkMap[2] = perks[1];
    perkMap[3] = perks[2];
    perkMap[4] = perks[3];
    perkMap[5] = perks[4];
    const masterwork = destinyDataService.getMasterworkDefinition(masterworkHash);
    const mod = destinyDataService.getModDefinition(modHash);

    emits("urlParsed", PageSelection.Weapon, weapon, perkMap, masterwork, mod);
}

function onPathChanged() {
    window.history.pushState(path.value, "", path.value);
}

function getPerkHashAtIndex(column: PerkColumnNumber) {
    const selectedPerk = props.selectedGear.perkOptionsMap.value[column];
    if (!selectedPerk) return 0;
    const perk = selectedPerk.useEnhanced ? selectedPerk.perkOption.enhancedPerk : selectedPerk.perkOption.perk;
    return perk || 0;
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

