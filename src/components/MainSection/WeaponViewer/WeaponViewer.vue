<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';
import WeaponPanel from './WeaponPanel/WeaponPanel.vue';
import ExtrasPanel from './ExtrasPanel/ExtrasPanel.vue';
import MasterworkPanel from './MasterworkPanel.vue';
import ModsPanel from './ModsPanel.vue';
import PerksPanel from './PerksPanel/PerksPanel.vue';
import { ref, watch } from 'vue';
import { computed } from '@vue/reactivity';
import type { IPerkOption } from '@/data/types';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined
}>();

watch(() => props.weapon, () => { selectedPerksMap.value = {}; })

const selectedPerksMap = ref<{ [column: number]: IPerkOption | undefined }>({ });
const selectedMasterwork = ref<DestinyInventoryItemDefinition | undefined>(undefined);
const selectedMod = ref<DestinyInventoryItemDefinition | undefined>(undefined);

const selectedPerks = computed(() => [selectedPerksMap.value[0], selectedPerksMap.value[1], selectedPerksMap.value[2], selectedPerksMap.value[3], selectedPerksMap.value[4]]);

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    selectedPerksMap.value[column] = perk;
}

function onMasterworkChanged(masterwork: DestinyInventoryItemDefinition | undefined) {
    selectedMasterwork.value = masterwork;
}

function onModChanged(mod: DestinyInventoryItemDefinition | undefined) {
    selectedMod.value = mod;
}
</script>

<template>
    <div class="viewer">
        <div class="weapon">
            <WeaponPanel
                :weapon="weapon"
                :selected-perks="selectedPerks"
                :masterwork="selectedMasterwork"
                :mod="selectedMod"
            ></WeaponPanel>
            <div class="extras">
                <ExtrasPanel
                    :weapon="weapon"
                    :selected-perks="selectedPerks"
                    :masterwork="selectedMasterwork"
                    :mod="selectedMod"
                ></ExtrasPanel>
                <div class="mods-masterwork">
                    <MasterworkPanel :weapon="weapon" @masterwork-changed="onMasterworkChanged"></MasterworkPanel>
                    <ModsPanel :weapon="weapon" @mod-changed="onModChanged"></ModsPanel>
                </div>
            </div>
        </div>
        <PerksPanel :weapon="weapon" @perk-selected="onPerkSelected"></PerksPanel>
    </div>
</template>

<style scoped>
.viewer {
    display: flex;
    flex-direction: row;
}

.weapon {
    display: flex;
    flex-direction: column;
}

.extras {
    display: flex;
    flex-direction: row;
}

.mods-masterwork {
    display: flex;
    flex-direction: column;
    width: 500px;
}
</style>
