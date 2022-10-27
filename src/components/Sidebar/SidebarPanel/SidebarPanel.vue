<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { FilterCategory, FilterPredicate } from "@/data/types";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import FilterWindow from "./Filter/FilterWindow.vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const emit = defineEmits(["weapon-selected"]);

const props = defineProps<{
    viewingFilter: boolean,
    searchString: string,
}>();

const filters = ref<Record<FilterCategory, FilterPredicate[]>>({
    "Collections": [],
    "Damage Type": [],
    "Rarity": [],
    "Weapon": [],
});

const weapons = computed(() => {
    return destinyDataService.weapons;
});

const filteredWeapons = computed(() => {
    return weapons.value.filter(w => {
        const collections = filters.value["Collections"];
        const damageTypes = filters.value["Damage Type"];
        const rarity = filters.value["Rarity"];
        const weapon = filters.value["Weapon"];
        return checkFilterCategoryOnWeapon(collections, w)
            && checkFilterCategoryOnWeapon(damageTypes, w)
            && checkFilterCategoryOnWeapon(rarity, w)
            && checkFilterCategoryOnWeapon(weapon, w);
    });
});

function checkFilterCategoryOnWeapon(category: FilterPredicate[], weapon: DestinyInventoryItemDefinition) {
    return !category || category.length === 0 || category.some(predicate => predicate(weapon));
}

function onFiltersApplied(newFilters: Record<FilterCategory, FilterPredicate[]>) {
    filters.value = newFilters;
}

function onWeaponSelected(weapon: DestinyInventoryItemDefinition) {
    emit("weapon-selected", weapon);
}
</script>

<template>
    <div class="panel">
        <FilterWindow v-if="viewingFilter" @filters-applied="onFiltersApplied"></FilterWindow>
        <WeaponList v-else :weapons="filteredWeapons" :search-string="searchString" @entry-clicked="onWeaponSelected"></WeaponList>
    </div>
</template>

<style scoped>
.panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
