<script setup lang="ts">
import TierIcons from "@/assets/TierIcons";
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

const Category: FilterCategory = "Rarity";

const selectedFiltersInCategory = computed(() => {
    return props.selectedFilters.selectedFiltersMap[Category];
});

const rarityFilters = computed(() => {
    // For some reason, the "Basic" (i.e. white-coloured) tier shows up 3 times, grab uniques and sort them
    const uniqueTiers: IFilterButton[] = [];
    const seenTiers: LookupMap<string, boolean> = {};
    const itemTierDefinitions = destinyDataService.itemTiers;

    for (const tier of itemTierDefinitions) {
        if (!seenTiers[tier.displayProperties.name]) {
            seenTiers[tier.displayProperties.name] = true;
            uniqueTiers.push({
                text: tier.displayProperties.name,
                iconUrl: tierIndexToIcon(tier.index),
                filter: (item: IWeapon) => {
                    return item.tierTypeIndex === tier.index;
                }
            });
        }
    }

    return uniqueTiers;
});

function tierIndexToIcon(tierIndex: number) {
    switch (tierIndex) {
        case 1: return TierIcons.Basic;
        case 2: return TierIcons.Common;
        case 3: return TierIcons.Rare;
        case 4: return TierIcons.Legendary;
        case 5: return TierIcons.Exotic;
        default: return TierIcons.Basic;
    }
}

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
            :filters="rarityFilters"
            @filter-toggled="onFilterToggled"
        ></FilterGroup>
    </CollapsibleSection>
</template>

<style scoped lang="less">
</style>
