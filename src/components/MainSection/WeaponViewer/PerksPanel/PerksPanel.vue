<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkList from './PerkList.vue';
import { destinyDataService } from '@/data/destinyDataService';
import { ItemTierIndex, type IPerkOption, type IPerkSlotOptions } from '@/data/types';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";
import { selectionService } from '@/data/selectionService';
import BuilderSection from '../BuilderSection.vue';

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

const perkPlugSets = computed(() => {
    // Either one of the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
    return perkSocketsNoTracker.value.map(ps => destinyDataService.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
});

const perkOptionListsPerSlot = computed(() => {
    return perkPlugSets.value.map(ps => {
        const perkOptionsByName: { [name: string]: DestinyInventoryItemDefinition[] } = {};
        const currentlyCanRollMap: { [plugItemHash: number]: boolean } = {};
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of ps?.reusablePlugItems || []) {
            if (seenPlugItems[plugItem.plugItemHash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[plugItem.plugItemHash] = plugItem.currentlyCanRoll;

            const definition = destinyDataService.getItemDefinition(plugItem.plugItemHash);
            if (!definition) continue;

            const name = definition.displayProperties.name;
            if (!perkOptionsByName[name]) {
                perkOptionsByName[name] = [definition];
            } else {
                perkOptionsByName[name].push(definition);
            }
        }

        const perkOptions: IPerkOption[] = [];
        for (const key in perkOptionsByName) {
            const options = perkOptionsByName[key];
            const perk = options.find(o => {
                const tier = destinyDataService.getItemTierDefinition(o.inventory!.tierTypeHash);
                return !!tier && (tier.index === ItemTierIndex.Common);
            });
            if (!perk) continue; // If no non-enhanced version, just ignore.

            const perkOption: IPerkOption = {
                perk: perk,
                enhancedPerk: options.find(o => {
                    const tier = destinyDataService.getItemTierDefinition(o.inventory!.tierTypeHash);
                    return !!tier && tier.index === ItemTierIndex.Uncommon;
                }),
                currentlyCanRoll: currentlyCanRollMap[perk.hash],
                useEnhanced: false,
            };
            if (perkOption.currentlyCanRoll || !selectionService.hideRetiredPerks) {
                perkOptions.push(perkOption);
            }
        }

        const slotOptions: IPerkSlotOptions = {
            options: perkOptions,
        };
        return slotOptions;
    });
});

const curatedPerks = computed(() => {
    return perkSocketsNoTracker.value
        .map(s => {
            if (s.singleInitialItemHash) {
                return destinyDataService.getItemDefinition(s.singleInitialItemHash);
            } else if (s.randomizedPlugSetHash) {
                // Origin perk doesn't have an initial item for some reason, have to use the randomized plug set.
                const plugSet = destinyDataService.getPlugSetDefinition(s.randomizedPlugSetHash);
                return !!plugSet && plugSet.reusablePlugItems.length > 0
                    ? destinyDataService.getItemDefinition(plugSet.reusablePlugItems[0].plugItemHash)
                    : undefined;
            }
        })
        .map(i => i!)
        .map<IPerkOption>(i => { return { perk: i, currentlyCanRoll: true, useEnhanced: false, }; })
        .map<IPerkSlotOptions>(o => { return { options: [o] }; });
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
