<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import { computed } from "@vue/reactivity";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import FilterWindow from "./Filter/FilterWindow.vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const emit = defineEmits(["weapon-selected"]);

const props = defineProps<{
    viewingFilter: boolean,
    searchString: string,
}>();

const weapons = computed(() => {
    return destinyDataService.weapons;
});

function onWeaponSelected(weapon: DestinyInventoryItemDefinition) {
    emit("weapon-selected", weapon);
}
</script>

<template>
    <div class="panel">
        <FilterWindow v-if="viewingFilter"></FilterWindow>
        <WeaponList v-else :weapons="weapons" :search-string="searchString" @entry-clicked="onWeaponSelected"></WeaponList>
    </div>
</template>

<style scoped>
.panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
