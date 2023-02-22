<script setup lang="ts">
import TierIcons from "@/assets/TierIcons";
import ElementLabel from "@/components/Common/ElementLabel.vue";
import OptionButton from "@/components/Common/OptionButton.vue";
import { OriginFilterInfos, SeasonIconMap, SeasonToCollectionMap, WeaponCategoryIconMap } from "@/data/constants";
import type { Collection, FilterCategory, IAppliedFilters, IArchetypeFilter, IFilterButton, IWeapon, IWeaponFilterButton, LookupMap, SeasonNumber } from "@/data/interfaces";
import { destinyDataService } from "@/data/services";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";

interface ICategoryInfo {
    name: FilterCategory;
    filters: IFilterButton[];
    wide: boolean;
}

const props = defineProps<{
    activeFilters: Record<FilterCategory, LookupMap<string, boolean>>,
}>();

const emits = defineEmits<{
    (e: "filtersApplied", applied: IAppliedFilters): void,
    (e: "filtersCleared"): void,
    (e: "filterToggled", categoryName: FilterCategory, filterText: string, active: boolean): void,
}>();

const perkFilter = ref("");
const includeSunsetWeapons = ref(false);
const craftedWeapons = ref(false);
const adeptWeapons = ref(false);

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
                    const activeArchetypeFilters = filter.archetypes.filter(a => props.activeFilters["Archetype"][a.text]);
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
        .filter(s => includeSunsetWeapons.value || !destinyDataService.isSeasonSunset(s))
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

const collectionCategoryFilters = computed(() => {
    const originCollections = originFilters.value;
    const seasonCollections = seasonFilters.value;
    return originCollections.concat(seasonCollections);
});

const itemTierFilters = computed(() => {
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

const damageTypeFilterCategory = computed<ICategoryInfo>(() => {
    return { name: "Damage Type", filters: damageTypeFilters.value, activeFilters: {}, wide: false };
});
const weaponFilterCategory = computed<ICategoryInfo>(() => {
    return { name: "Weapon", filters: weaponCategoryFilters.value, activeFilters: {}, wide: true };
});
const collectionsFilterCategory = computed<ICategoryInfo>(() => {
    return { name: "Collections", filters: collectionCategoryFilters.value, activeFilters: {}, wide: false };
});
const rarityFilterCategory = computed<ICategoryInfo>(() => {
    return { name: "Rarity", filters: itemTierFilters.value, activeFilters: {}, wide: false };
});

const filterCategories = computed(() => {
    return [damageTypeFilterCategory.value, weaponFilterCategory.value, collectionsFilterCategory.value, rarityFilterCategory.value];
});

const activeWeaponFilters = computed(() => {
    const activeFilterMap = props.activeFilters[weaponFilterCategory.value.name];
    return weaponCategoryFilters.value.filter(f => activeFilterMap[f.text]);
});

const activeWeaponFiltersWithArchetypes = computed(() => activeWeaponFilters.value.filter(f => f.archetypes.length > 0));

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

function onPerkFilterChanged() {
    // TODO: stuff
}

function onFilterToggled(categoryName: FilterCategory, filterText: string, active: boolean) {
    emits("filterToggled", categoryName, filterText, active);
}

function onFilterButtonToggled(category: ICategoryInfo, filter: IFilterButton, active: boolean) {
    onFilterToggled(category.name, filter.text, active);
}

function isArchetypeActive(archetypeFilter: IArchetypeFilter) {
    return props.activeFilters["Archetype"][archetypeFilter.text];
}

function onArchetypeFilterToggled(archetypeFilter: IArchetypeFilter, active: boolean) {
    onFilterToggled("Archetype", archetypeFilter.text, active);
}

function includeSunsetToggled() {
    includeSunsetWeapons.value = !includeSunsetWeapons.value;
}

function craftedWeaponsToggled() {
    craftedWeapons.value = !craftedWeapons.value;
}

function adeptWeaponsToggled() {
    adeptWeapons.value = !adeptWeapons.value;
}

function onClearFilters() {
    emits("filtersCleared");
}

function onApplyFilters() {
    const appliedFilters: IAppliedFilters = {
        includeSunsetWeapons: includeSunsetWeapons.value,
        craftedWeapons: craftedWeapons.value,
        adeptWeapons: adeptWeapons.value,
        collectionsFilters: findActiveFilterPredicates(collectionsFilterCategory.value),
        damageFilters: findActiveFilterPredicates(damageTypeFilterCategory.value),
        rarityFilters: findActiveFilterPredicates(rarityFilterCategory.value),
        weaponFilters: findActiveFilterPredicates(weaponFilterCategory.value),
        perkNames: [],
    };

    emits("filtersApplied", appliedFilters);
}

function findActiveFilterPredicates(category: ICategoryInfo) {
    const categoryName = category.name;
    const activeFilterMap = props.activeFilters[categoryName];
    return category.filters
        .filter(f => activeFilterMap[f.text])
        .map(f => f.filter);
}

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
</script>

<template>
    <div class="filters">
        <div class="header">
            <span class="title">Filters</span>
            <div class="actions">
                <OptionButton text="Clear Filters" :active="false" @click="onClearFilters"></OptionButton>
                <OptionButton text="Apply Filters" :active="true" @click="onApplyFilters"></OptionButton>
            </div>
        </div>

        <CollapsibleSection name="Perks">
            <ElementLabel text="Perk filter text box" class="perk-search-wrapper">
                <input
                    class="perk-search"
                    type="search"
                    placeholder="Filter for specific perks"
                    v-model="perkFilter"
                    @input="onPerkFilterChanged"
                >
            </ElementLabel>
        </CollapsibleSection>

        <CollapsibleSection name="Archetype" v-if="activeWeaponFiltersWithArchetypes.length > 0">
            <div
                class="button-list"
                v-for="filter of activeWeaponFiltersWithArchetypes"
                :key="filter.text"
            >
                <OptionButton
                    v-for="archetype of filter.archetypes"
                    :key="archetype.text"
                    :text="archetype.text"
                    :active="!!isArchetypeActive(archetype)"
                    :icon-url="filter.iconUrl"
                    large
                    wide
                    @toggled="active => onArchetypeFilterToggled(archetype, active)"
                ></OptionButton>
            </div>
        </CollapsibleSection>

        <CollapsibleSection
            v-for="category of filterCategories"
            :key="category.name"
            :name="category.name"
        >
            <div class="button-list">
                <OptionButton
                    v-for="filter of category.filters"
                    :key="filter.text"
                    :text="filter.text"
                    :active="!!activeFilters[category.name][filter.text]"
                    :icon-url="filter.iconUrl"
                    large
                    :wide="category.wide"
                    @toggled="active => onFilterButtonToggled(category, filter, active)"
                ></OptionButton>
            </div>
        </CollapsibleSection>

        <CollapsibleSection name="Misc">
            <div class="button-list">
                <OptionButton
                    text="Include Sunset Weapons"
                    :active="includeSunsetWeapons"
                    @toggled="includeSunsetToggled"
                ></OptionButton>
                <OptionButton
                    text="Crafted"
                    :active="craftedWeapons"
                    @toggled="craftedWeaponsToggled"
                ></OptionButton>
                <OptionButton
                    text="Adept"
                    :active="adeptWeapons"
                    @toggled="adeptWeaponsToggled"
                ></OptionButton>
            </div>
        </CollapsibleSection>
    </div>
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

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .title {
        font-size: 19.2px;
        font-weight: 600;
        line-height: 19.2px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .actions {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
}

.perk-search-wrapper {
    display: flex;
}
.perk-search {
    flex: 1;

    order: 1;
    color: #fafafa;
    background: none;
    font-size: 16px;
    font-family: neue-haas-grotesk-text,"Helvetica Neue",sans-serif;
    line-height: 16px;

    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;

    border-width: 1px;
    border-style: solid;
    border-color: hsla(0, 0%, 100%, 0.5);
    border-radius: 0;
    border-top: none;
}
.perk-search::placeholder {
    font-size: 12px;
    font-family: neue-haas-grotesk-text,"Helvetica Neue",sans-serif;
    line-height: 16px;
    letter-spacing: 2px;
    text-transform: uppercase;
}
.perk-search:focus {
    outline: none;
}

.button-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
}
</style>
