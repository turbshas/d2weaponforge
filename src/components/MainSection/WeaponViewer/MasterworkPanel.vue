<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { hashMapToArray } from '@/data/util';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
}>();

const defaultAllowedMasterworks = [
        "v400.plugs.weapons.masterworks.stat.range",
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
];
const allowedMasterworksPerWeaponType: { [weaponType: string]: string[] } = {
    "": [
        "v400.plugs.weapons.masterworks.stat.range",
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.damage",
        "v400.plugs.weapons.masterworks.stat.blast_radius",
        "v400.plugs.weapons.masterworks.stat.charge_time",
        "v400.plugs.weapons.masterworks.stat.draw_time",
        "v400.plugs.weapons.masterworks.stat.projectile_speed",
        "v400.plugs.weapons.masterworks.stat.accuracy",
        "v600.plugs.weapons.masterworks.stat.shield_duration",
    ],
    "auto": defaultAllowedMasterworks,
    "handCannon": defaultAllowedMasterworks,
    "pulse": defaultAllowedMasterworks,
    "scout": defaultAllowedMasterworks,
    "sidearm": defaultAllowedMasterworks,
    "smg": defaultAllowedMasterworks,
    "shotgun": defaultAllowedMasterworks,
    "sniper": defaultAllowedMasterworks,
    "trace": defaultAllowedMasterworks,
    "machine": defaultAllowedMasterworks,
    "fusion": [
        "v400.plugs.weapons.masterworks.stat.range",
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.charge_time",
    ],
    "lfr": [
        "v400.plugs.weapons.masterworks.stat.range",
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.charge_time",
    ],
    "sword": [
        "v400.plugs.weapons.masterworks.stat.damage",
    ],
    "glaive": [
        "v400.plugs.weapons.masterworks.stat.range",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
    ],
    "bow": [
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.draw_time",
        "v400.plugs.weapons.masterworks.stat.accuracy",
    ],
    "gl": [
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.blast_radius",
        "v400.plugs.weapons.masterworks.stat.projectile_speed",
    ],
    "rocket": [
        "v400.plugs.weapons.masterworks.stat.stability",
        "v400.plugs.weapons.masterworks.stat.reload",
        "v400.plugs.weapons.masterworks.stat.handling",
        "v400.plugs.weapons.masterworks.stat.blast_radius",
        "v400.plugs.weapons.masterworks.stat.projectile_speed",
    ],
};

const weaponSocketCategories = computed(() => props.weapon?.sockets?.socketCategories || []);
const weaponSockets = computed(() => props.weapon?.sockets?.socketEntries || []);

const weaponModSocketCategory = computed(() => weaponSocketCategories.value.find(c => {
    const socketCategory = destinyDataService.getSocketCategoryDefinition(c.socketCategoryHash);
    return socketCategory && socketCategory.displayProperties.name === "WEAPON MODS";
}));
const weaponModSockets = computed(() => weaponModSocketCategory.value ? weaponModSocketCategory.value.socketIndexes.map(i => weaponSockets.value[i]) : []);
const masterworkSocket = computed(() => weaponModSockets.value.find(s => {
    const type = destinyDataService.getSocketTypeDefinition(s.socketTypeHash);
    return type && type.plugWhitelist.some(p => p.categoryIdentifier.includes("v400.plugs.weapons.masterworks"));
}));

const weaponStats = computed(() => {
    if (!props.weapon || !props.weapon.stats) return [];
    return props.weapon.stats.stats;
});

const filteredMasterworkOptions = computed(() => {
    if (!masterworkSocket.value) return [];
    return masterworkSocket.value.reusablePlugItems
        .map(pi => destinyDataService.getItemDefinition(pi.plugItemHash))
        // TODO: the conditionally active thing is for adepts or crafted weapon > lvl 20, maybe find a better way to do this?
        .filter(mwItem => mwItem && mwItem.investmentStats.every(stat => !!weaponStats.value[stat.statTypeHash] || stat.isConditionallyActive))
        .map(i => i!);
});

const masterworkOptionsByStatName = computed(() => {
    const masterworks: { [statName: string]: DestinyInventoryItemDefinition[] } = {};
    for (const plugItem of filteredMasterworkOptions.value) {
        const increasedStat = plugItem.investmentStats.find(stat => stat.value > 0);
        if (!increasedStat) continue;
        const statDefinition = destinyDataService.getStatDefinition(increasedStat.statTypeHash);
        if (!statDefinition) continue;
        const name = statDefinition.displayProperties.name
        if (!masterworks[name]) {
            masterworks[name] = [];
        }
        masterworks[name].push(plugItem);
    }
    return masterworks;
});

const masterworkOptionsByStat = computed(() => {
    const masterworks: { [categoryId: string]: DestinyInventoryItemDefinition[] } = {};
    for (const plugItem of filteredMasterworkOptions.value) {
        if (!plugItem.plug) continue;
        const id = plugItem.plug.plugCategoryIdentifier;
        if (!masterworks[id]) {
            masterworks[id] = [];
        }
        masterworks[id].push(plugItem);
    }
    return masterworks;
})

const masterworkStats = computed(() => Object.keys(masterworkOptionsByStatName.value));

const text = computed(() => {
    console.log(
        weaponModSockets.value.map(s => s.reusablePlugItems.map(item => destinyDataService.getItemDefinition(item.plugItemHash))),
        weaponModSockets.value.map(s => destinyDataService.getSocketTypeDefinition(s.socketTypeHash)),
        masterworkSocket.value,
        masterworkSocket.value ? destinyDataService.getPlugSetDefinition(masterworkSocket.value.reusablePlugSetHash!) : undefined,
        masterworkOptionsByStat.value,
    );
    return "test";
})
</script>

<template>
    <div class="masterwork">
        <span>Weapon Masterwork</span>
        {{ text }}
        <div v-for="mw in masterworkStats" :key="mw">
            {{ mw + masterworkOptionsByStatName[mw].length }}
        </div>
        <input type="range" min="0" max="10">
    </div>

</template>

<style scoped>
.masterwork {
    display: flex;
    flex-direction: column;
}
</style>
