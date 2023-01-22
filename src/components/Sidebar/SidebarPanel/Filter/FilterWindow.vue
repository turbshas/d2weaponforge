<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import WeaponIcons from "@/assets/WeaponIcons";
import OriginIcons from "@/assets/OriginIcons";
import TierIcons from "@/assets/TierIcons";
import { DataSearchString, WeaponArchetypeRpm, type FilterCategory, type FilterPredicate, type IAppliedFilters, type IArchetypeFilter, type IFilterButton, type IWeapon, type IWeaponFilterButton } from "@/data/types";
import OptionButton from "@/components/Common/OptionButton.vue";
import ElementLabel from "@/components/Common/ElementLabel.vue";

interface ICategoryInfo {
    name: FilterCategory;
    filters: IFilterButton[];
    wide: boolean;
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

const weaponCategoryArchetypeMap: { [itemRegex: string]: IArchetypeFilter[] } = {
    [DataSearchString.AutoRifleTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.AutoRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.AutoAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.AutoPrecision),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.AutoLightweight),
        createArchetypeFilterFromRpm(DataSearchString.HighImpact, WeaponArchetypeRpm.AutoHighImpact),
    ],
    [DataSearchString.HandCannonTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.Aggressive, WeaponArchetypeRpm.HandCannonAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.HandCannonAggressive),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.HandCannonPrecision),
    ],
    [DataSearchString.PulseRifleTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.PulseRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.PulseLightweight),
        createArchetypeFilterFromRpm(DataSearchString.AggressiveBurst, WeaponArchetypeRpm.PulseAggBurst),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.PulseAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.HighImpact, WeaponArchetypeRpm.PulseHighImpact),
    ],
    [DataSearchString.ScoutRifleTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.VeistRapidFire, WeaponArchetypeRpm.ScoutVeistRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.ScoutRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.ScoutLightweight),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.ScoutPrecision),
        createArchetypeFilterFromRpm(DataSearchString.HighImpact, WeaponArchetypeRpm.ScoutHighImpact),
    ],
    [DataSearchString.SidearmTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.AdaptiveBurst, WeaponArchetypeRpm.SidearmAdaptiveBurst),
        createArchetypeFilterFromRpm(DataSearchString.OmolonAdaptive, WeaponArchetypeRpm.SidearmOmolonAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.SurosRapidFire, WeaponArchetypeRpm.SidearmSurosRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.AggressiveBurst, WeaponArchetypeRpm.SidearmAggressiveBurst),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.SidearmLightweight),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.SidearmAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.SidearmPrecision),
    ],
    [DataSearchString.SubmachinegunTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.SmgAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.SmgLightweight),
        createArchetypeFilterFromRpm(DataSearchString.Aggressive, WeaponArchetypeRpm.SmgAggressive),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.SmgPrecision),
    ],
    [DataSearchString.BowTypeRegex]: [
        createArchetypeFilterFromChargeTime(DataSearchString.Lightweight, WeaponArchetypeRpm.BowLightweight),
        createArchetypeFilterFromChargeTime(DataSearchString.Precision, WeaponArchetypeRpm.BowPrecision),
    ],
    [DataSearchString.ShotgunTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.ShotgunRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.ShotgunLightweight),
        createArchetypeFilterFromRpm(DataSearchString.PinpointSlug, WeaponArchetypeRpm.ShotgunPinpointSlug),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.ShotgunPrecision),
        createArchetypeFilterFromRpm(DataSearchString.Aggressive, WeaponArchetypeRpm.ShotgunAggressive),
    ],
    [DataSearchString.SniperRifleTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.SniperRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.SniperAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Aggressive, WeaponArchetypeRpm.SniperAggressive),
    ],
    [DataSearchString.FusionRifleTypeRegex]: [
        createArchetypeFilterFromChargeTime(DataSearchString.RapidFire, WeaponArchetypeRpm.FusionRapidFire),
        createArchetypeFilterFromChargeTime(DataSearchString.Adaptive, WeaponArchetypeRpm.FusionAdaptive),
        createArchetypeFilterFromChargeTime(DataSearchString.Precision, WeaponArchetypeRpm.FusionPrecision),
        createArchetypeFilterFromChargeTime(DataSearchString.HighImpact, WeaponArchetypeRpm.FusionHighImpact),
    ],
    [DataSearchString.TraceRifleTypeRegex]: [],
    [DataSearchString.GrenadeLauncherTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.GrenadeRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.GrenadeAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.GrenadeLightweight),
        createArchetypeFilterFromRpm(DataSearchString.Lightweight, WeaponArchetypeRpm.GrenadeLightweight),
        createArchetypeFilterFromRpm(DataSearchString.WaveFrame, WeaponArchetypeRpm.GrenadeWave),
    ],
    [DataSearchString.RocketLauncherTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.Aggressive, WeaponArchetypeRpm.RocketAggressive),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.RocketAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.HakkePrecision, WeaponArchetypeRpm.RocketHakkePrecision),
        createArchetypeFilterFromRpm(DataSearchString.Precision, WeaponArchetypeRpm.RocketPrecision),
        createArchetypeFilterFromRpm(DataSearchString.HighImpact, WeaponArchetypeRpm.RocketHighImpact),
    ],
    [DataSearchString.LinearFusionTypeRegex]: [
        createArchetypeFilterFromChargeTime(DataSearchString.Precision, WeaponArchetypeRpm.LinearPrecision),
        createArchetypeFilterFromChargeTime(DataSearchString.Aggressive, WeaponArchetypeRpm.LinearAggressive),
    ],
    [DataSearchString.MachineGunTypeRegex]: [
        createArchetypeFilterFromRpm(DataSearchString.RapidFire, WeaponArchetypeRpm.MachineGunRapidFire),
        createArchetypeFilterFromRpm(DataSearchString.Adaptive, WeaponArchetypeRpm.MachineGunAdaptive),
        createArchetypeFilterFromRpm(DataSearchString.HighImpact, WeaponArchetypeRpm.MachineGunHighImpact),
    ],
    [DataSearchString.SwordTypeRegex]: [
        createArchetypeFilter(DataSearchString.Adaptive),
        createArchetypeFilter(DataSearchString.Aggressive),
        createArchetypeFilter(DataSearchString.Caster),
        createArchetypeFilter(DataSearchString.Vortex),
    ],
    [DataSearchString.GlaiveTypeRegex]: [
    ],
};

function createArchetypeFilter(archetypeName: string): IArchetypeFilter {
    return {
        text: `${archetypeName}`,
        // For now, only compare using archetype name.
        filter: weapon => checkArchetypeName(weapon, archetypeName),
    };
}

function createArchetypeFilterFromRpm(archetypeName: string, rpm: number): IArchetypeFilter {
    return {
        text: `${rpm} RPM // ${archetypeName}`,
        // For now, only compare using archetype name.
        filter: weapon => checkArchetypeName(weapon, archetypeName),
    };
}

function createArchetypeFilterFromChargeTime(archetypeName: string, chargeTime: number): IArchetypeFilter {
    return {
        text: `${chargeTime} ms // ${archetypeName}`,
        // For now, only compare using archetype name.
        filter: weapon => checkArchetypeName(weapon, archetypeName),
    };
}

function checkArchetypeName(weapon: IWeapon, archetypeName: string) {
    if (!weapon.intrinsic) return false;
    return weapon.intrinsic.displayProperties.name.includes(archetypeName);
}

// TODO: these filters
const origins: IFilterButton[] = [
    { text: "World (Current)", iconUrl: "", filter: () => false, },
    { text: "Word (Old)", iconUrl: "", filter: () => false, },
    { text: "Vanguard Ops", iconUrl: OriginIcons.FactionVanguard, filter: () => false, },
    { text: "Crucible", iconUrl: OriginIcons.FactionCrucible, filter: () => false, },
    { text: "Gambit", iconUrl: OriginIcons.FactionGambit, filter: () => false, },
    { text: "Iron Banner", iconUrl: OriginIcons.FactionIronBanner, filter: () => false, },
    { text: "Trials of Osiris", iconUrl: OriginIcons.FactionOsiris, filter: () => false, },
    { text: "Nightfall", iconUrl: OriginIcons.Nightfall, filter: () => false, },
    { text: "King's Fall", iconUrl: "", filter: () => false, },
    { text: "Duality", iconUrl: OriginIcons.Duality, filter: () => false, },
    { text: "Opulent", iconUrl: "", filter: () => false, }, // TODO: this would be opulent weapons that were reissued ONLY (unless Include Sunset is checked?)
    { text: "Vow of the Disciple", iconUrl: OriginIcons.VowOfTheDisciple, filter: () => false, },
    { text: "Throne World", iconUrl: "", filter: () => false, },
    { text: "30th Anniversary", iconUrl: "", filter: () => false, },
    { text: "Vault of Glass", iconUrl: OriginIcons.VaultOfGlass, filter: () => false, },
    { text: "Europa", iconUrl: OriginIcons.Europa, filter: () => false, },
    { text: "Deep Stone Crypt", iconUrl: "", filter: () => false, },
    { text: "Prophecy", iconUrl: OriginIcons.FactionTheNine, filter: () => false, }, // TODO: this would be Trials of the Nine weapons that drop in Prophecy ONLY (unless Include Sunset is checked?)
    { text: "Altars of Sorrow", iconUrl: "", filter: () => false, },
    { text: "Pit of Heresy", iconUrl: "", filter: () => false, },
    { text: "Dreambane", iconUrl: "", filter: () => false, },
    { text: "Garden of Salvation", iconUrl: "", filter: () => false, },
    { text: "The Dreaming City", iconUrl: "", filter: () => false, },
    { text: "Last Wish", iconUrl: "", filter: () => false, },
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
    (e: "filtersApplied", applied: IAppliedFilters): void,
}>();

const perkFilter = ref("");
const includeSunsetWeapons = ref(false);
const activeFilters = ref<Record<FilterCategory, { [filterText: string]: boolean }>>({
    "Archetype": {},
    "Collections": {},
    "Damage Type": {},
    "Rarity": {},
    "Weapon": {},
});

const damageTypeFilters = computed(() => {
    return destinyDataService.damageTypes
        .filter(d => d.displayProperties.hasIcon)
        .map(d => {
            const filter: IFilterButton = {
                text: d.displayProperties.name,
                iconUrl: destinyDataService.getImageUrl(d.displayProperties.icon),
                filter: (item: IWeapon) => {
                    return item.weapon.damageTypeHashes.includes(d.hash);
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
                archetypes: weaponCategoryArchetypeMap[c.itemTypeRegex],
                filter: (item: IWeapon) => {
                    const weapon = item.weapon;
                    if (!weapon.itemCategoryHashes) return false;
                    if (!weapon.itemCategoryHashes.includes(c.hash)) return false;
                    const activeArchetypeFilters = filter.archetypes.filter(a => activeFilters.value["Archetype"][a.text]);
                    // If no archetypes chosen, allow all.
                    if (activeArchetypeFilters.length === 0) return true;
                    // If no intrinsic, can't check archetype so return false.
                    if (!item.intrinsic) return false;
                    return activeArchetypeFilters.some(a => a.filter(item));
                },
            };
            return filter;
        });
});

const collectionCategoryFilters = computed(() => {
    // Just seasons right now, TODO: add other collections
    const collections = origins;
    const seasonCollections = destinyDataService.seasons
        .filter(s => includeSunsetWeapons.value || !destinyDataService.isSeasonSunset(s))
        .map(s => {
            const iconUrl = s.displayProperties.hasIcon
                ? destinyDataService.getImageUrl(s.displayProperties.icon)
                : seasonIconMap[s.seasonNumber];
            const filter: IFilterButton = {
                text: s.displayProperties.name || "The Red War",
                iconUrl: iconUrl,
                filter: (item: IWeapon) => {
                    // TODO: this may not work for a lot of weapons, is there a better way to check?
                    return !!item.weapon.seasonHash && item.weapon.seasonHash === s.hash;
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
                filter: (item: IWeapon) => {
                    return !!item.weapon.inventory && item.weapon.inventory.tierTypeHash === tier.hash;
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
    const activeFilterMap = activeFilters.value[weaponFilterCategory.value.name];
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

function onFilterButtonToggled(category: ICategoryInfo, filter: IFilterButton, active: boolean) {
    activeFilters.value[category.name][filter.text] = active;
}

function isArchetypeActive(archetypeFilter: IArchetypeFilter) {
    return activeFilters.value["Archetype"][archetypeFilter.text];
}

function onArchetypeFilterToggled(archetypeFilter: IArchetypeFilter, active: boolean) {
    activeFilters.value["Archetype"][archetypeFilter.text] = active;
}

function includeSunsetToggled() {
    includeSunsetWeapons.value = !includeSunsetWeapons.value;
}

function onApplyFilters() {
    const appliedFilters: IAppliedFilters = {
        includeSunsetWeapons: includeSunsetWeapons.value,
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
    const activeFilterMap = activeFilters.value[categoryName];
    return category.filters
        .filter(f => activeFilterMap[f.text])
        .map(f => f.filter);
}
</script>

<template>
    <div class="filters">
        <div class="header">
            <span class="title">Filters</span>
            <OptionButton text="Apply Filters" :active="true" @click="onApplyFilters"></OptionButton>
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
                    :active="isArchetypeActive(archetype)"
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
