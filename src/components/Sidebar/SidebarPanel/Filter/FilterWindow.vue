<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinyInventoryItemDefinition, DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import FilterOptionButton from "./FilterOptionButton.vue";
import WeaponIcons from "@/assets/WeaponIcons";
import OriginIcons from "@/assets/OriginIcons";
import TierIcons from "@/assets/TierIcons";
import { DataSearchString, type FilterCategory, type FilterPredicate, type IFilterButton } from "@/data/types";

// This uses the "itemTypeRegex" field of DestinyItemCategoryDefinition as an identifier for each
// weapon type, since hash could theoretically change.
const weaponCategoryIconMap: { [itemRegex: string]: string } = {
    [DataSearchString.AutoRifleTypeRegex]: WeaponIcons.AutoRifle,
    [DataSearchString.HandCannonTypeRegex]: WeaponIcons.HandCannon,
    [DataSearchString.PulseRifleTypeRegex]: WeaponIcons.PulseRifle,
    [DataSearchString.ScoutRifleTypeRegex]: WeaponIcons.ScoutRifle,
    [DataSearchString.FusionRifleTypeRegex]: WeaponIcons.FusionRifle,
    [DataSearchString.SniperRifleTypeRegex]: WeaponIcons.SniperRifle,
    [DataSearchString.ShotgunTypeRegex]: WeaponIcons.Shotgun,
    [DataSearchString.MachineGunTypeRegex]: WeaponIcons.MachineGun,
    [DataSearchString.RocketLauncherTypeRegex]: WeaponIcons.RocketLauncher,
    [DataSearchString.SidearmTypeRegex]: WeaponIcons.Sidearm,
    [DataSearchString.SwordTypeRegex]: WeaponIcons.Sword,
    [DataSearchString.GrenadeLauncherTypeRegex]: WeaponIcons.GrenadeLauncher,
    [DataSearchString.LinearFusionTypeRegex]: WeaponIcons.LinearFusionRifle,
    [DataSearchString.TraceRifleTypeRegex]: WeaponIcons.TraceRifle,
    [DataSearchString.BowTypeRegex]: WeaponIcons.Bow,
    [DataSearchString.GlaiveTypeRegex]: WeaponIcons.Glaive,
    [DataSearchString.SubmachinegunTypeRegex]: WeaponIcons.SubmachineGun,
};

// TODO: these filters
const origins: IFilterButton[] = [
    { text: "World (Current)", iconUrl: "", active: false, filter: () => false, },
    { text: "Word (Old)", iconUrl: "", active: false, filter: () => false, },
    { text: "Vanguard Ops", iconUrl: OriginIcons.FactionVanguard, active: false, filter: () => false, },
    { text: "Crucible", iconUrl: OriginIcons.FactionCrucible, active: false, filter: () => false, },
    { text: "Gambit", iconUrl: OriginIcons.FactionGambit, active: false, filter: () => false, },
    { text: "Iron Banner", iconUrl: OriginIcons.FactionIronBanner, active: false, filter: () => false, },
    { text: "Trials of Osiris", iconUrl: OriginIcons.FactionOsiris, active: false, filter: () => false, },
    { text: "Nightfall", iconUrl: OriginIcons.Nightfall, active: false, filter: () => false, },
    { text: "King's Fall", iconUrl: "", active: false, filter: () => false, },
    { text: "Duality", iconUrl: OriginIcons.Duality, active: false, filter: () => false, },
    { text: "Opulent", iconUrl: "", active: false, filter: () => false, }, // TODO: this would be opulent weapons that were reissued ONLY (unless Include Sunset is checked?)
    { text: "Vow of the Disciple", iconUrl: OriginIcons.VowOfTheDisciple, active: false, filter: () => false, },
    { text: "Throne World", iconUrl: "", active: false, filter: () => false, },
    { text: "30th Anniversary", iconUrl: "", active: false, filter: () => false, },
    { text: "Vault of Glass", iconUrl: OriginIcons.VaultOfGlass, active: false, filter: () => false, },
    { text: "Europa", iconUrl: OriginIcons.Europa, active: false, filter: () => false, },
    { text: "Deep Stone Crypt", iconUrl: "", active: false, filter: () => false, },
    { text: "Prophecy", iconUrl: OriginIcons.FactionTheNine, active: false, filter: () => false, }, // TODO: this would be Trials of the Nine weapons that drop in Prophecy ONLY (unless Include Sunset is checked?)
    { text: "Altars of Sorrow", iconUrl: "", active: false, filter: () => false, },
    { text: "Pit of Heresy", iconUrl: "", active: false, filter: () => false, },
    { text: "Dreambane", iconUrl: "", active: false, filter: () => false, },
    { text: "Garden of Salvation", iconUrl: "", active: false, filter: () => false, },
    { text: "The Dreaming City", iconUrl: "", active: false, filter: () => false, },
    { text: "Last Wish", iconUrl: "", active: false, filter: () => false, },
];

const seasonIconMap: { [seasonNumber: number]: string } = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    10: OriginIcons.SeasonWorthy,
};

const emits = defineEmits<{
    (e: "filtersApplied", filters: Record<FilterCategory, FilterPredicate[]>): void,
}>();

const perkFilter = ref("");
const includeSunsetWeapons = ref(false);

const damageTypeFilters = computed(() => {
    return destinyDataService.damageTypes
        .filter(d => d.displayProperties.hasIcon)
        .map(d => {
            const filter: IFilterButton = {
                text: d.displayProperties.name,
                iconUrl: destinyDataService.getImageUrl(d.displayProperties.icon),
                active: false,
                filter: (item: DestinyInventoryItemDefinition) => {
                    return item.damageTypeHashes.includes(d.hash);
                },
            };
            return filter;
        });
});

const weaponCategoryFilters = computed(() => {
    return destinyDataService.itemCategories
        .filter(c => c.itemTypeRegex && weaponCategoryIconMap[c.itemTypeRegex])
        .map(c => {
            const filter: IFilterButton = {
                text: c.displayProperties.name,
                iconUrl: weaponCategoryIconMap[c.itemTypeRegex],
                active: false,
                filter: (item: DestinyInventoryItemDefinition) => {
                    return !!item.itemCategoryHashes && item.itemCategoryHashes.includes(c.hash);
                },
            };
            return filter;
        });
});

const collectionCategoryFilters = computed(() => {
    // Just seasons right now, TODO: add other collections
    const collections = origins;
    const seasonCollections = destinyDataService.seasons
        .filter(s => includeSunsetWeapons.value || !isSunsetSeason(s))
        .map(s => {
            const iconUrl = s.displayProperties.hasIcon
                ? destinyDataService.getImageUrl(s.displayProperties.icon)
                : seasonIconMap[s.seasonNumber];
            const filter: IFilterButton = {
                text: s.displayProperties.name || "The Red War",
                iconUrl: iconUrl,
                active: false,
                filter: (item: DestinyInventoryItemDefinition) => {
                    // TODO: this may not work for a lot of weapons, is there a better way to check?
                    return !!item.seasonHash && item.seasonHash === s.hash;
                },
            };
            return filter;
        });
    return collections.concat(seasonCollections);
});

const itemTierFilters = computed(() => {
    // For some reason, the "Basic" (i.e. white-coloured) tier shows up 3 times, grab uniques and sort them
    const uniqueTiers: IFilterButton[] = [];
    const seenTiers: { [name: string]: boolean } = {};
    const itemTierDefinitions = destinyDataService.itemTiers;
    itemTierDefinitions.sort((a, b) => a.index - b.index);

    for (const tier of itemTierDefinitions) {
        if (!seenTiers[tier.displayProperties.name]) {
            seenTiers[tier.displayProperties.name] = true;
            uniqueTiers.push({
                text: tier.displayProperties.name,
                iconUrl: tierIndexToIcon(tier.index),
                active: false,
                filter: (item: DestinyInventoryItemDefinition) => {
                    return !!item.inventory && item.inventory.tierTypeHash === tier.hash;
                }
            });
        }
    }

    return uniqueTiers;
});

const filterCategories = computed(() => {
    const categories: { name: FilterCategory, filters: IFilterButton[], wide: boolean, }[] = [
        { name: "Damage Type", filters: damageTypeFilters.value, wide: false, },
        { name: "Weapon", filters: weaponCategoryFilters.value, wide: true, },
        { name: "Collections", filters: collectionCategoryFilters.value, wide: false, },
        { name: "Rarity", filters: itemTierFilters.value, wide: false, },
    ];
    return categories;
});

const filterCategoryMap = computed(() => {
    const map: Record<FilterCategory, { [buttonText: string]: IFilterButton }> = {
        "Damage Type": {},
        "Weapon": {},
        "Collections": {},
        "Rarity": {},
    };
    for (const category of filterCategories.value) {
        for (const filter of category.filters) {
            map[category.name][filter.text] = filter;
        }
    }
    return map;
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

function isSunsetSeason(season: DestinySeasonDefinition) {
    // Season of Dawn is last sunset season
    return season.seasonNumber <= 9;
}

function onPerkFilterChanged() {
    // TODO: stuff
}

function onFilterButtonToggled(category: FilterCategory, filter: IFilterButton, active: boolean) {
    filterCategoryMap.value[category][filter.text].active = active;
}

function includeSunsetToggled() {
    includeSunsetWeapons.value = !includeSunsetWeapons.value;
}

function onApplyFilters() {
    const filters: Record<FilterCategory, FilterPredicate[]> = {
        "Damage Type": [],
        "Weapon": [],
        "Collections": [],
        "Rarity": [],
    };

    for (const category in filterCategoryMap.value) {
        const filterCategory = category as FilterCategory;
        const filterButtonMap = filterCategoryMap.value[filterCategory];

        for (const buttonText in filterButtonMap) {
            const button = filterButtonMap[buttonText];
            if (button.active) {
                filters[filterCategory].push(button.filter);
            }
        }
    }

    emits("filtersApplied", filters);
}
</script>

<template>
    <div>
        <div>
            <span>Filters</span>
            <button @click="onApplyFilters">Apply Filters</button>
        </div>
        <CollapsibleSection name="Perks">
            <input type="text" v-model="perkFilter" @input="onPerkFilterChanged">
        </CollapsibleSection>
        <CollapsibleSection
            v-for="category of filterCategories"
            :key="category.name"
            :name="category.name"
        >
            <div class="button-list">
                <FilterOptionButton
                    v-for="filter of category.filters"
                    :key="filter.text"
                    :text="filter.text"
                    :icon-url="filter.iconUrl"
                    :wide="category.wide"
                    @toggled="active => onFilterButtonToggled(category.name, filter, active)"
                ></FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Sunset">
            <FilterOptionButton text="Include Sunset Weapons" @toggled="includeSunsetToggled"></FilterOptionButton>
        </CollapsibleSection>
    </div>
</template>

<style scoped>
.button-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
