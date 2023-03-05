<script setup lang="ts">
import type { FilterCategory, FilterPredicate, IAppliedFilters, IFilterButton, IPerkFilterInfo, ISelectedFilters, ItemHash, IWeapon, LookupMap } from "@/data/interfaces";
import { computed } from "vue";
import DamageTypeFilters from "./DamageTypeFilters.vue";
import RarityFilters from "./RarityFilters.vue";
import CollectionsFilters from "./CollectionsFilters.vue";
import WeaponFilters from "./WeaponFilters.vue";
import MiscFilters from "./MiscFilters.vue";
import PerkFilters from "./PerkFilters.vue";
import FilterWindowHeader from "./FilterWindowHeader.vue";

const props = defineProps<{
    selectedFilters: ISelectedFilters,
}>();

const emits = defineEmits<{
    (e: "filtersApplied", applied: IAppliedFilters): void,
    (e: "filtersCleared"): void,
    (e: "filterToggled", categoryName: FilterCategory, filterText: string, filter: IFilterButton): void,
}>();

const selectedFiltersMap = computed(() => props.selectedFilters.selectedFiltersMap);
const selectedPerksMap = computed(() => props.selectedFilters.selectedPerks);

function onPerkToggled(perkName: string, perk: IPerkFilterInfo | undefined) {
    selectedPerksMap.value[perkName] = perk;
}

function onFilterToggled(categoryName: FilterCategory, filterText: string, filter: IFilterButton | undefined) {
    selectedFiltersMap.value[categoryName][filterText] = filter;
}

function onIncludeSunsetToggled(active: boolean) {
    props.selectedFilters.includeSunset = active;
}

function onClearFilters() {
    emits("filtersCleared");
}

function onApplyFilters() {
    const appliedFilters: IAppliedFilters = {
        includeSunsetWeapons: props.selectedFilters.includeSunset,
        perkFilter: getPerkFilterPredicate(),
        collectionsFilters: getSelectedFilterPredicates("Collections"),
        damageFilters: getSelectedFilterPredicates("Damage Type"),
        miscFilters: getSelectedFilterPredicates("Misc"),
        rarityFilters: getSelectedFilterPredicates("Rarity"),
        weaponFilters: getSelectedFilterPredicates("Weapon"),
        perkNames: [],
    };

    emits("filtersApplied", appliedFilters);
}

function getPerkFilterPredicate() {
    const selectedPerks: ItemHash[][] = [];
    for (const key in selectedPerksMap.value) {
        const filter = selectedPerksMap.value[key];
        if (filter) {
            selectedPerks.push(filter.perkHashes);
        }
    }

    const predicate: FilterPredicate = (weapon: IWeapon) => {
        const perkMap: LookupMap<ItemHash, boolean> = {};
        for (const column of weapon.perks.perkColumns) {
            for (const perkOption of column.perks) {
                perkMap[perkOption.perk] = true;
            }
        }
        return selectedPerks.every(perkHashes => perkHashes.some(h => !!perkMap[h]));
    };
    return predicate;
}

function getSelectedFilterPredicates(category: FilterCategory) {
    const selectedMap = selectedFiltersMap.value[category];
    const predicates: FilterPredicate[] = [];
    for (const key in selectedMap) {
        const filter = selectedMap[key];
        if (!!filter) {
            predicates.push(filter.filter);
        }
    }
    return predicates;
}
</script>

<template>
    <section class="filters" aria-label="Filter Pane">
        <FilterWindowHeader @filters-applied="onApplyFilters" @filters-cleared="onClearFilters"></FilterWindowHeader>

        <PerkFilters
            :selected-filters="props.selectedFilters"
            @perk-toggled="onPerkToggled"
        ></PerkFilters>

        <DamageTypeFilters
            :selected-filters="props.selectedFilters"
            @filter-toggled="onFilterToggled"
        ></DamageTypeFilters>

        <WeaponFilters
            :selected-filters="props.selectedFilters"
            @filter-toggled="onFilterToggled"
        ></WeaponFilters>

        <CollectionsFilters
            :selected-filters="props.selectedFilters"
            :include-sunset="props.selectedFilters.includeSunset"
            @filter-toggled="onFilterToggled"
        ></CollectionsFilters>

        <RarityFilters
            :selected-filters="props.selectedFilters"
            @filter-toggled="onFilterToggled"
        ></RarityFilters>

        <MiscFilters
            :selected-filters="props.selectedFilters"
            @filter-toggled="onFilterToggled"
            @include-sunset-toggled="onIncludeSunsetToggled"
        ></MiscFilters>
    </section>
</template>

<style scoped lang="less">
.filters {
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
    padding-bottom: 32px;
    padding-left: 16px;
    padding-right: 16px;
}
</style>
