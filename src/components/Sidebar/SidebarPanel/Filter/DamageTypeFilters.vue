<script setup lang="ts">
import type { FilterCategory, IFilterButton, ISelectedFilters, IWeapon, LookupMap } from "@/data/interfaces";
import { destinyDataService } from "@/data/services";
import { computed, ref } from "vue";
import CollapsibleSection from "@/components/Common/CollapsibleSection.vue";
import FilterGroup from "./FilterGroup.vue";

const props = defineProps<{
    selectedFilters: ISelectedFilters,
}>();

const emits = defineEmits<{
    (e: "filterToggled", categoryName: FilterCategory, filterText: string, filter: IFilterButton | undefined): void,
}>();

const collapsed = ref(false)

const Category: FilterCategory = "Damage Type";

const selectedFiltersInCategory = computed(() => {
    return props.selectedFilters.selectedFiltersMap[Category];
});

const damageTypeFilters = computed(() => {
    return destinyDataService.damageTypes
        .filter(d => d.displayProperties.hasIcon)
        .map(d => {
            const filter: IFilterButton = {
                text: d.displayProperties.name,
                iconUrl: destinyDataService.getImageUrl(d.displayProperties.icon),
                filter: (item: IWeapon) => {
                    return item.damageType.hash === d.hash;
                },
            };
            return filter;
        });
});

function toggleCollapsed() {
    collapsed.value = !collapsed.value;
}

function onFilterToggled(filter: IFilterButton, active: boolean) {
    emits("filterToggled", Category, filter.text, active ? filter : undefined);
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
            :filters="damageTypeFilters"
            @filter-toggled="onFilterToggled"
        ></FilterGroup>
    </CollapsibleSection>
</template>

<style scoped lang="less">
</style>
