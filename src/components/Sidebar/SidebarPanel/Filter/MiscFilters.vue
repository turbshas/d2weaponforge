<script setup lang="ts">
import type { FilterCategory, IFilterButton, ISelectedFilters, IWeapon, LookupMap } from "@/data/interfaces";
import { computed, ref } from "vue";
import CollapsibleSection from "@/components/Common/CollapsibleSection.vue";
import FilterGroup from "./FilterGroup.vue";

const props = defineProps<{
    selectedFilters: ISelectedFilters,
}>();

const emits = defineEmits<{
    (e: "filterToggled", categoryName: FilterCategory, filterText: string, filter: IFilterButton | undefined): void,
    (e: "includeSunsetToggled", active: boolean): void,
}>();

const collapsed = ref(false)

const IncludeSunsetText = "Include Sunset Weapons";

const Category: FilterCategory = "Misc";

const selectedFiltersInCategory = computed(() => props.selectedFilters.selectedFiltersMap[Category]);

const miscFilters = computed(() => {
    const filters: IFilterButton[] = [
        {
            text: IncludeSunsetText,
            iconUrl: "",
            // This only filters when inactive (excludes sunset weapons).
            filter: (item: IWeapon) => !item.isSunset,
        },
        {
            text: "Crafted",
            iconUrl: "",
            filter: (item: IWeapon) => item.isCraftable,
        },
        {
            text: "Adept",
            iconUrl: "",
            filter: (item: IWeapon) => item.isAdept,
        },
    ];
    return filters;
});

function toggleCollapsed() {
    collapsed.value = !collapsed.value;
}

function onFilterToggled(filter: IFilterButton, active: boolean) {
    emits("filterToggled", Category, filter.text, active ? filter : undefined);
    if (filter.text === IncludeSunsetText) {
        emits("includeSunsetToggled", active);
    }
}
</script>

<template>
    <CollapsibleSection
        :name="Category"
        :collapsed="collapsed"
        @toggled="toggleCollapsed()"
    >
        <FilterGroup
            :selected-filters="selectedFiltersInCategory"
            :category-name="Category"
            :filters="miscFilters"
            @filter-toggled="onFilterToggled"
        ></FilterGroup>
    </CollapsibleSection>
</template>

<style scoped lang="less">
</style>
