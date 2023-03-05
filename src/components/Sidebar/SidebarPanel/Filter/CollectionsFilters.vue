<script setup lang="ts">
import { OriginFilterInfos, SeasonIconMap, SeasonToCollectionMap } from "@/data/constants";
import type { Collection, FilterCategory, IFilterButton, ISelectedFilters, IWeapon, LookupMap, SeasonNumber } from "@/data/interfaces";
import { destinyDataService } from "@/data/services";
import { computed, ref } from "vue";
import CollapsibleSection from "@/components/Common/CollapsibleSection.vue";
import FilterGroup from "./FilterGroup.vue";

const props = defineProps<{
    selectedFilters: ISelectedFilters,
    includeSunset: boolean,
}>();

const emits = defineEmits<{
    (e: "filterToggled", categoryName: FilterCategory, filterText: string, filter: IFilterButton | undefined): void,
}>();

const collapsed = ref(false)

const Category: FilterCategory = "Collections";

const selectedFiltersInCategory = computed(() => {
    return props.selectedFilters.selectedFiltersMap[Category];
});

const originFilters = computed(() => {
    return OriginFilterInfos.value.map(info => {
        const collectionsMap = getCollectionsWeaponMap(info.collection);

        const filter: IFilterButton = {
            text: info.text,
            iconUrl: info.iconUrl,
            filter: (weapon: IWeapon) => !!collectionsMap[weapon.hash],
        }
        return filter;
    });
});

const seasonFilters = computed(() => {
    // The list of seasons seems to include the upcoming, yet-to-be-released one.
    const currentDate = new Date(Date.now());

    return destinyDataService.seasons
        .filter(s => props.includeSunset || !destinyDataService.isSeasonSunset(s))
        .filter(s => !s.startDate || (new Date(s.startDate) <= currentDate))
        .map(s => {
            const seasonNumber = s.seasonNumber as SeasonNumber;
            const iconUrl = s.displayProperties.hasIcon
                ? destinyDataService.getImageUrl(s.displayProperties.icon)
                : (SeasonIconMap.value[seasonNumber] || "");
            const collectionId = SeasonToCollectionMap.value[seasonNumber];
            const collectionMap = getCollectionsWeaponMap(collectionId);

            const filter: IFilterButton = {
                text: s.displayProperties.name || "The Red War",
                iconUrl: iconUrl,
                filter: (item: IWeapon) => !!collectionMap[item.hash],
            };
            return filter;
        });
});

const collectionsFilters = computed(() => {
    const originCollections = originFilters.value;
    const seasonCollections = seasonFilters.value;
    return originCollections.concat(seasonCollections);
});

function getCollectionsWeaponMap(collection: Collection) {
    const collectionList = getCollectionsList(collection) || [];
    const collectionsMap: LookupMap<number, boolean> = {};
    for (const item of collectionList) {
        collectionsMap[item] = true;
    }
    return collectionsMap;
}

function getCollectionsList(collection: Collection) {
    const lists = destinyDataService.collectionsLists;
    return lists ? lists[collection] : undefined;
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
            :filters="collectionsFilters"
            @filter-toggled="onFilterToggled"
        ></FilterGroup>
    </CollapsibleSection>
</template>

<style scoped lang="less">
</style>
