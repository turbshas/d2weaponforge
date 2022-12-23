<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { FilterCategory, FilterPredicate, IWeapon } from "@/data/types";
import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import FilterWindow from "./Filter/FilterWindow.vue";
import WeaponList from "./WeaponList/WeaponList.vue";

const props = defineProps<{
    viewingFilter: boolean,
    searchString: string,
}>();

const emit = defineEmits<{
    (e: "weaponSelected", weapon: IWeapon): void,
}>();

const filters = ref<Record<FilterCategory, FilterPredicate[]>>({
    "Collections": [],
    "Damage Type": [],
    "Rarity": [],
    "Weapon": [],
    "Archetype": [],
});

const weapons = computed(() => {
    return destinyDataService.weapons;
});

const areFiltersChosen = computed(() => {
    return (!!filters.value["Collections"] && filters.value["Collections"].length > 0)
        || (!!filters.value["Damage Type"] && filters.value["Damage Type"].length > 0)
        || (!!filters.value["Rarity"] && filters.value["Rarity"].length > 0)
        || (!!filters.value["Weapon"] && filters.value["Weapon"].length > 0);
});

const filteredWeapons = computed(() => {
    // If no filter or search, return truncated list
    console.log("filtering weapons", areFiltersChosen.value, !!props.searchString, filters.value);
    if (!areFiltersChosen.value && !props.searchString) return weapons.value.slice(0, 22);
    return weapons.value
        .filter(w => {
            const collections = filters.value["Collections"];
            const damageTypes = filters.value["Damage Type"];
            const rarity = filters.value["Rarity"];
            const weapon = filters.value["Weapon"];
            return checkFilterCategoryOnWeapon(collections, w.weapon)
                && checkFilterCategoryOnWeapon(damageTypes, w.weapon)
                && checkFilterCategoryOnWeapon(rarity, w.weapon)
                && checkFilterCategoryOnWeapon(weapon, w.weapon);
        })
        .filter(s => s.weapon.displayProperties.name.toLocaleLowerCase().includes(props.searchString.toLocaleLowerCase()));
});

function checkFilterCategoryOnWeapon(category: FilterPredicate[], weapon: DestinyInventoryItemDefinition) {
    return !category || category.length === 0 || category.some(predicate => predicate(weapon));
}

function onFiltersApplied(newFilters: Record<FilterCategory, FilterPredicate[]>) {
    filters.value = newFilters;
    console.log("filters are", filters.value);
}

function onWeaponSelected(weapon: IWeapon) {
    emit("weaponSelected", weapon);
}
</script>

<template>
    <div class="panel">
        <FilterWindow v-if="viewingFilter" @filters-applied="onFiltersApplied"></FilterWindow>
        <WeaponList v-else :weapons="filteredWeapons" @entry-clicked="onWeaponSelected"></WeaponList>
    </div>
</template>

<style scoped>
.panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
