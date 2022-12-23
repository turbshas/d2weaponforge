<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinyInventoryItemDefinition, DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import WeaponIcons from "@/assets/WeaponIcons";
import OriginIcons from "@/assets/OriginIcons";
import TierIcons from "@/assets/TierIcons";
import { DataSearchString, type FilterCategory, type FilterPredicate, type IArchetypeFilter, type IFilterButton, type IWeaponFilterButton } from "@/data/types";
import { findItemInTable } from "@/data/util";
import OptionButton from "@/components/Common/OptionButton.vue";

interface IArchetypeInfo {
    text: string;
    filter: FilterPredicate;
}

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

// TODO: some go by charge time, not RPM
// TODO: there are some duplicate RPMs in a single weapon type - could use impact?
// TODO: with foundry weapons, there are duplicate RPMs with the same impact - what to do here?
// TODO: there are duplicate frames with differing impacts
// TODO: could have each archetype have its own filter predicate? this is probably the way
// TODO: might want to just do a string compare with the archetype display name
/*
const weaponCategoryArchetypeMap: { [itemRegex: string]: IArchetypeInfo[] } = {
    [DataSearchString.AutoRifleTypeRegex]: [
        { rpm: 720, text: "Rapid-Fire", filter: item =>  },
        { rpm: 600, text: "Adaptive" },
        { rpm: 450, text: "Precision" },
        { rpm: 450, text: "Lightweight" },
        { rpm: 360, text: "High-Impact" },
    ],
    [DataSearchString.HandCannonTypeRegex]: [
        { rpm: 120, text: "Aggressive" },
        { rpm: 140, text: "Adaptive" },
        { rpm: 180, text: "Precision" },
    ],
    [DataSearchString.PulseRifleTypeRegex]: [
        { rpm: 540, text: "Rapid-Fire" },
        { rpm: 450, text: "Lightweight" },
        { rpm: 450, text: "Agg. Burst" },
        { rpm: 390, text: "Adaptive" },
        { rpm: 340, text: "High-Impact" },
    ],
    [DataSearchString.ScoutRifleTypeRegex]: [
        { rpm: 260, text: "Veist Rapid-Fire" },
        { rpm: 260, text: "Rapid-Fire" },
        { rpm: 200, text: "Lightweight" },
        { rpm: 180, text: "Precision" },
        { rpm: 150, text: "High-Impact" },
    ],
    [DataSearchString.SidearmTypeRegex]: [
        { rpm: 491, text: "Adaptive (Burst)" },
        { rpm: 491, text: "Omolon Adaptive" },
        { rpm: 450, text: "Suros Rapid-Fire" },
        { rpm: 325, text: "Aggressive Burst" },
        { rpm: 360, text: "Lightweight" },
        { rpm: 300, text: "Adaptive" },
        { rpm: 260, text: "Precision" },
    ],
    [DataSearchString.SubmachinegunTypeRegex]: [
        { rpm: 900, text: "Adaptive" },
        { rpm: 900, text: "Lightweight" },
        { rpm: 750, text: "Aggressive" },
        { rpm: 600, text: "Precision" },
    ],
    [DataSearchString.BowTypeRegex]: [
        { rpm: 0, text: "Lightweight" },
        { rpm: 0, text: "Precision" },
    ],
    [DataSearchString.ShotgunTypeRegex]: [
        { rpm: 140, text: "Rapid-Fire" },
        { rpm: 80, text: "Lightweight" },
        { rpm: 65, text: "Pinpoint Slug" },
        { rpm: 65, text: "Precision" },
        { rpm: 55, text: "Aggressive" },
    ],
    [DataSearchString.SniperRifleTypeRegex]: [
        { rpm: 140, text: "Rapid-Fire" },
        { rpm: 90, text: "Adaptive" },
        { rpm: 72, text: "Aggressive" },
    ],
    [DataSearchString.FusionRifleTypeRegex]: [
        { rpm: 460, text: "Rapid-Fire" },
        { rpm: 660, text: "Adaptive" },
        { rpm: 740, text: "Precision" },
        { rpm: 1000, text: "High-Impact" },
    ],
    [DataSearchString.TraceRifleTypeRegex]: [],
    [DataSearchString.GrenadeLauncherTypeRegex]: [
        { rpm: 150, text: "Rapid-Fire" },
        { rpm: 120, text: "Adaptive" },
        { rpm: 100, text: "Precision" },
        { rpm: 90, text: "Lightweight" },
        { rpm: 72, text: "Wave-Frame" },
    ],
    [DataSearchString.RocketLauncherTypeRegex]: [
        { rpm: 25, text: "Aggressive" },
        { rpm: 20, text: "Adaptive" },
        { rpm: 15, text: "Hakke Precision" },
        { rpm: 15, text: "Precision" },
        { rpm: 15, text: "High-Impact" },
    ],
    [DataSearchString.LinearFusionTypeRegex]: [
        { rpm: 533, text: "Precision" },
        { rpm: 533, text: "Aggressive" },
    ],
    [DataSearchString.MachineGunTypeRegex]: [
        { rpm: 900, text: "Rapid-Fire" },
        { rpm: 450, text: "Adaptive" },
        { rpm: 360, text: "High-Impact" },
    ],
    [DataSearchString.SwordTypeRegex]: [
    ],
    [DataSearchString.GlaiveTypeRegex]: [
    ],
};
// */

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
            const filter: IWeaponFilterButton = {
                text: c.displayProperties.name,
                iconUrl: weaponCategoryIconMap[c.itemTypeRegex],
                active: false,
                archetypes: [],
                filter: (item: DestinyInventoryItemDefinition) => {
                    if (!item.itemCategoryHashes) return false;
                    if (!item.itemCategoryHashes.includes(c.hash)) return false;
                    const activeArchetypeFilters = filter.archetypes.filter(a => a.active);
                    // If no archetypes chosen, allow all.
                    if (activeArchetypeFilters.length === 0) return true;
                    // If no stats, can't check archetype so return false.
                    if (!item.stats || !destinyDataService.rpmStatDefinition) return false;
                    const rpmStat = findItemInTable(item.stats.stats, s => s.statHash === destinyDataService.rpmStatDefinition!.hash);
                    return !!rpmStat && activeArchetypeFilters.some(a => a.filter(item));
                },
            };
            return filter;
        });
});

const activeWeaponFilters = computed(() => {
    const result: IWeaponFilterButton[] = [];

    const weaponFilters = filterCategoryMap.value["Weapon"];
    console.log("weapon filters", weaponFilters);
    for (const buttonName in weaponFilters) {
        const filter = weaponFilters[buttonName] as IWeaponFilterButton;
        if (filter.active) {
            console.log("filter is active", filter);
            result.push(filter);
        }
    }

    return result;
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
        "Archetype": {},
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

function onFilterButtonToggled(filter: IFilterButton, active: boolean) {
    filter.active = active;
    console.log("filter toggled", filter, weaponCategoryFilters.value, activeWeaponFilters.value);
}

function onArchetypeFilterToggled(archetypeFilter: IArchetypeFilter, active: boolean) {
    archetypeFilter.active = active;
}

function includeSunsetToggled() {
    includeSunsetWeapons.value = !includeSunsetWeapons.value;
}

function onApplyFilters() {
    const filters: Record<FilterCategory, FilterPredicate[]> = {
        "Damage Type": [],
        "Weapon": [],
        "Archetype": [],
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
    <div class="filters">
        <div class="header">
            <span class="title">Filters</span>
            <OptionButton text="Apply Filters" :active="true" @click="onApplyFilters"></OptionButton>
        </div>

        <CollapsibleSection name="Perks">
            <input
                class="perk-search"
                type="text"
                placeholder="Filter for specific perks"
                v-model="perkFilter"
                @input="onPerkFilterChanged"
            >
        </CollapsibleSection>

        <CollapsibleSection name="Archetype" v-show="activeWeaponFilters.length > 0">
            <div
                class="archetype-group"
                v-for="filter of activeWeaponFilters"
                :key="filter.text"
            >
                <OptionButton
                    v-for="archetype of filter.archetypes"
                    :key="archetype.text"
                    :text="archetype.text"
                    :active="archetype.active"
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
                    :active="filter.active"
                    :icon-url="filter.iconUrl"
                    large
                    :wide="category.wide"
                    @toggled="active => onFilterButtonToggled(filter, active)"
                ></OptionButton>
            </div>
        </CollapsibleSection>

        <CollapsibleSection name="Sunset">
            <div class="button-list">
                <OptionButton
                    text="Include Sunset Weapons"
                    :active="includeSunsetWeapons"
                    @toggled="includeSunsetToggled"
                ></OptionButton>
            </div>
        </CollapsibleSection>
    </div>
</template>

<style scoped>
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
}

.title {
    font-size: 19.2px;
    font-weight: 600;
    line-height: 19.2px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.perk-search {
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

.button-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
}
</style>
