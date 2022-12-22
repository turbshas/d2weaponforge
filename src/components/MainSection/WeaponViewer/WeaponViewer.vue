<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';
import WeaponPanel from './WeaponPanel/WeaponPanel.vue';
import ExtrasPanel from './ExtrasPanel/ExtrasPanel.vue';
import MasterworkPanel from './MasterworkPanel.vue';
import ModsPanel from './ModsPanel.vue';
import PerksPanel from './PerksPanel/PerksPanel.vue';
import type { IPerkOption } from '@/data/types';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkSelected", column: number, perk: IPerkOption | undefined): void,
    (e: "masterworkChanged", masterwork: DestinyInventoryItemDefinition | undefined): void,
    (e: "modChanged", mod: DestinyInventoryItemDefinition | undefined): void,
}>();

function onPerkSelected(column: number, perk: IPerkOption | undefined) {
    emits("perkSelected", column, perk);
}

function onMasterworkChanged(masterwork: DestinyInventoryItemDefinition | undefined) {
    emits("masterworkChanged", masterwork);
}

function onModChanged(mod: DestinyInventoryItemDefinition | undefined) {
    emits("modChanged", mod);
}
</script>

<template>
    <div class="viewer">
        <div class="weapon">
            <WeaponPanel
                :weapon="props.weapon"
                :selected-perks="props.selectedPerks"
                :masterwork="props.masterwork"
                :mod="props.mod"
            ></WeaponPanel>
            <div class="extras-mws-mods">
                <ExtrasPanel
                    :weapon="props.weapon"
                    :selected-perks="props.selectedPerks"
                    :masterwork="props.masterwork"
                    :mod="props.mod"
                ></ExtrasPanel>
                <div class="mods-masterwork">
                    <MasterworkPanel
                        class="mw"
                        :weapon="props.weapon"
                        :masterwork="props.masterwork"
                        @masterwork-changed="onMasterworkChanged"
                    ></MasterworkPanel>
                    <ModsPanel
                        :weapon="props.weapon"
                        :mod="props.mod"
                        @mod-changed="onModChanged"
                    ></ModsPanel>
                </div>
            </div>
        </div>
        <PerksPanel
            :weapon="props.weapon"
            :selected-perks="props.selectedPerks"
            :masterwork="props.masterwork"
            :mod="props.mod"
            @perk-selected="onPerkSelected"
        ></PerksPanel>
    </div>
</template>

<style scoped>
.viewer {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 964.55fr 414.467fr;
    gap: 16px;
}

.weapon {
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    margin-bottom: 16px;
}

.extras-mws-mods {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 414.467fr 534.083fr;
    gap: 16px;
    flex-direction: row;
    margin-top: 16px;
}

.mods-masterwork {
    display: flex;
    flex-direction: column;
}

.mw {
    margin-bottom: 16px;
}
</style>
