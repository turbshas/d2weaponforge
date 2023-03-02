<script setup lang="ts">
import { WeaponCategoryIconMap } from "@/data/constants";
import type { FilterCategory, IArchetypeFilter, IFilterButton, ISelectedFilters, IWeapon, IWeaponFilterButton, LookupMap } from "@/data/interfaces";
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

const archetypesCollapsed = ref(false);
const weaponsCollapsed = ref(false);

const ArchetypeCategory: FilterCategory = "Archetype";
const WeaponCategory: FilterCategory = "Weapon";

const selectedWeaponFilterMap = computed(() => {
    return props.selectedFilters.selectedFiltersMap[WeaponCategory];
});
const selectedArchetypeFilterMap = computed(() => {
    return props.selectedFilters.selectedFiltersMap[ArchetypeCategory];
});

const selectedWeaponFilters = computed(() => {
    return weaponCategoryFilters.value.filter(f => selectedWeaponFilterMap.value[f.text]);
});

const selectedWeaponFiltersWithArchetypes = computed(() => selectedWeaponFilters.value.filter(f => f.archetypes.length > 0));

const weaponCategoryArchetypeMap = computed(() => {
    const archetypeFilters: LookupMap<string, IArchetypeFilter[]> = {};
    
    for (const weaponType of destinyDataService.weaponTypes) {
        const archetypeFilterList: IArchetypeFilter[] = [];

        for (const archetype of weaponType.archetypes) {
            const rpmPrefix = weaponType.showRpm ? `${archetype.rpm} ${weaponType.rpmUnits} // ` : "";

            archetypeFilterList.push({
                rpm: archetype.rpm,
                name: archetype.name,
                text: `${rpmPrefix}${archetype.name}`,
                iconUrl: WeaponCategoryIconMap.value[weaponType.weaponCategoryRegex] || "",
                filter: (item: IWeapon) => {
                    if (!item.archetype) return false;
                    const hash = item.archetype.intrinsicPerkHash;
                    return hash === archetype.hash
                        && (
                            !weaponType.compareUsingRpm
                            || (!!item.archetype && archetype.rpm === item.archetype.rpmStatValue)
                            );
                },
            });
        }

        archetypeFilterList.sort((a, b) => a.rpm - b.rpm);
        archetypeFilters[weaponType.weaponCategoryRegex] = archetypeFilterList;
    }

    return archetypeFilters;
});

const weaponCategoryFilters = computed(() => {
    const weaponFilters = destinyDataService.weaponTypes
        .filter(t => t.traitId && WeaponCategoryIconMap.value[t.weaponCategoryRegex])
        .map(t => {
            const filter: IWeaponFilterButton = {
                text: t.weaponTypeName,
                iconUrl: WeaponCategoryIconMap.value[t.weaponCategoryRegex] || "",
                archetypes: weaponCategoryArchetypeMap.value[t.weaponCategoryRegex] || [],
                filter: (item: IWeapon) => {
                    if (item.weaponCategoryRegex !== t.weaponCategoryRegex) return false;
                    const activeArchetypeFilters = filter.archetypes.filter(a => props.selectedFilters.selectedFiltersMap["Archetype"][a.text]);
                    // If no archetypes chosen, allow all.
                    if (activeArchetypeFilters.length === 0) return true;
                    // If no intrinsic, can't check archetype so return false.
                    if (!item.archetype) return false;
                    return activeArchetypeFilters.some(a => a.filter(item));
                },
            };
            return filter;
        });
    weaponFilters.sort((a, b) => a.text.localeCompare(b.text));
    return weaponFilters;
});

function toggleArchetypeCollapsed() {
    archetypesCollapsed.value = !archetypesCollapsed.value;
}

function toggleWeaponCollapsed() {
    weaponsCollapsed.value = !weaponsCollapsed.value;
}

function onArchetypeFilterToggled(filter: IFilterButton, active: boolean) {
    emits("filterToggled", ArchetypeCategory, filter.text, active ? filter : undefined);
}

function onWeaponFilterToggled(filter: IFilterButton, active: boolean) {
    emits("filterToggled", WeaponCategory, filter.text, active ? filter : undefined);
}
</script>

<template>
    <div class="weapon-filters">
        <CollapsibleSection
            :name="ArchetypeCategory"
            v-if="selectedWeaponFiltersWithArchetypes.length > 0"
            :collapsed="archetypesCollapsed"
            @toggled="toggleArchetypeCollapsed"
        >
            <FilterGroup
                v-for="filter of selectedWeaponFiltersWithArchetypes"
                :key="filter.text"
                :selected-filters="selectedArchetypeFilterMap"
                :category-name="ArchetypeCategory"
                :filters="filter.archetypes"
                wide
                @filter-toggled="onArchetypeFilterToggled"
            ></FilterGroup>
        </CollapsibleSection>

        <CollapsibleSection
            :name="WeaponCategory"
            :collapsed="weaponsCollapsed"
            @toggled="toggleWeaponCollapsed"
        >
            <FilterGroup
                :selected-filters="selectedWeaponFilterMap"
                :category-name="WeaponCategory"
                :filters="weaponCategoryFilters"
                wide
                @filter-toggled="onWeaponFilterToggled"
            ></FilterGroup>
        </CollapsibleSection>
    </div>
</template>

<style scoped lang="less">
.weapon-filters {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
