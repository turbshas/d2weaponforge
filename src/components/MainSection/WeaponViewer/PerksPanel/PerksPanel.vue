<script setup lang="ts">
import { computed } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkList from './PerkList.vue';
import { destinyDataService } from '@/data/destinyDataService';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import { selectionService } from '@/data/selectionService';
import BuilderSection from '../../../Common/BuilderSection.vue';
import type { IPerkOption, IPerkSlotOptions } from '@/data/types';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

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

const perkOptionListsPerSlot = computed(() => {
    if (!props.weapon) return [];
    return destinyDataService.getPerkOptionsForWeapon(props.weapon);
});

const curatedPerks = computed(() => {
    return perkSocketsNoTracker.value
        .map((s, index) => {
            const perkSlotOptions = perkOptionListsPerSlot.value[index];
            if (s.singleInitialItemHash) {
                const perkOption = perkSlotOptions.options.find(o => o.perk.hash === s.singleInitialItemHash);
                // Sometimes, a curated perk is a perk that the weapon cannot normally roll. Construct a new
                // perk option object in this case, as there's nothing to match up with anyway.
                if (perkOption) return perkOption;
                const perkItem = destinyDataService.getItemDefinition(s.singleInitialItemHash);
                return { perk: perkItem, enhancedPerk: undefined, currentlyCanRoll: true, useEnhanced: false, } as IPerkOption;
            } else if (s.randomizedPlugSetHash) {
                // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                const plugSet = destinyDataService.getPlugSetDefinition(s.randomizedPlugSetHash);
                const itemHash = !!plugSet && plugSet.reusablePlugItems.length > 0 ? plugSet.reusablePlugItems[0].plugItemHash : undefined;
                return perkSlotOptions.options.find(o => o.perk.hash === itemHash);
            }
        })
        .map(i => i!)
        // Checking for undefined here to have better defined behavior, but it really should never be undefined.
        .map<IPerkSlotOptions>(o => { return { options: o ? [o] : [] }; });
});
const hasCuratedPerks = computed(() => curatedPerks.value.length > 0);

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    emits("perkSelected", column, perk);
}
</script>

<template>
    <!--
    <div>
        <BuilderSection title="Weapon Perks">
            <PerkList
                :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
                :perk-option-lists="perkOptionListsPerSlot"
                :selected-perks="selectedPerks"
                @perk-selected="onPerkSelected"
            ></PerkList>
        </BuilderSection>
        <span class="description">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <div v-if="hasCuratedPerks">
            <BuilderSection title="Curated Roll">
                <PerkList
                    :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
                    :perk-option-lists="curatedPerks"
                    :selected-perks="selectedPerks"
                    @perk-selected="onPerkSelected"
                ></PerkList>
            </BuilderSection>
        </div>
    </div>
    -->
    <div class="perks">
        <h2 class="title">Weapon Perks</h2>
        <PerkList
            :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
            :perk-option-lists="perkOptionListsPerSlot"
            :selected-perks="selectedPerks"
            @perk-selected="onPerkSelected"
        ></PerkList>
        <span class="description">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <div v-if="hasCuratedPerks">
            <h2 class="title">Curated Roll</h2>
            <PerkList
                :style="{ 'background-image': 'url(' + backgroundUrl + ')' }"
                :perk-option-lists="curatedPerks"
                :selected-perks="selectedPerks"
                hide-enhanced
                @perk-selected="onPerkSelected"
            ></PerkList>
        </div>
    </div>
</template>

<style scoped>
.perks {
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-shadow: 0 0 40px 0 rgba(0,0,0,.5);
    background-color: #12171c;
    background-size: auto;
}

.title {
    flex-grow: 0;

    position: relative;
    opacity: 0.75;
    margin-top: 0;
    margin-bottom: 16px;
    margin-left: 0;
    margin-right: 0;
    padding-top: 0;
    padding-bottom: 8px;
    padding-left: 0;
    padding-right: 0;

    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
}
.title::before {
    content: "";
    position: absolute;
    display: block;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: #fafafa;
    opacity: 0.75;
}

.description {
    margin-top: -8px;
    margin-bottom: 8px;

    color: #b78c25;
    text-align: center;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    font-size: 12.8px;
    font-weight: bold;
}
</style>
