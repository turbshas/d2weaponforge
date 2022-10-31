<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import PerkList from './PerkList.vue';
import { destinyDataService } from '@/data/destinyDataService';
import { ItemTierIndex, type IPerkOption, type IPerkSlotOptions } from '@/data/types';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
}>();

const selectedPerks = ref<{ [column: number]: IPerkOption | undefined }>({});

watch(() => props.weapon, () => {
    selectedPerks.value = {};
});

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
            };
            perkOptions.push(perkOption);
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
        .map<IPerkOption>(i => { return { perk: i, currentlyCanRoll: true, }; })
        .map<IPerkSlotOptions>(o => { return { options: [o] }; });
});
const hasCuratedPerks = computed(() => curatedPerks.value.length > 0);

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    selectedPerks.value[column] = perk;
    emits("perkSelected", column, perk);
}
</script>

<template>
    <div class="perks">
        <span class="title">Weapon Perks</span>
        <PerkList :perk-option-lists="perkOptionListsPerSlot" :selected-perks="selectedPerks" @perk-selected="onPerkSelected"></PerkList>
        <span class="description">
            TO APPLY THE ENHANCED VERSION OF A PERK, CLICK SAID PERK IN THE AREA WITH THE PICTURE OF THE WEAPON.
        </span>
        <div v-if="hasCuratedPerks">
            <span class="title">Curated Roll</span>
            <PerkList :perk-option-lists="curatedPerks" :selected-perks="selectedPerks" @perk-selected="onPerkSelected"></PerkList>
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
