<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinyItemCategoryDefinition, DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import FilterOptionButton from "./FilterOptionButton.vue";
import WeaponIcons from "@/assets/WeaponIcons";
import OriginIcons from "@/assets/OriginIcons";
import TierIcons from "@/assets/TierIcons";
import type { IFilter } from "@/data/interfaces";

// This uses the "itemTypeRegex" field of DestinyItemCategoryDefinition as an identifier for each
// weapon type, since hash could theoretically change.
const weaponCategoryIconMap: { [itemRegex: string]: string } = {
    ".*_auto_rifle": WeaponIcons.AutoRifle,
    ".*_hand_cannon": WeaponIcons.HandCannon,
    ".*_pulse_rifle": WeaponIcons.PulseRifle,
    ".*_scout_rifle": WeaponIcons.ScoutRifle,
    "type_weapon_fusion_rifle": WeaponIcons.FusionRifle,
    ".*_sniper_rifle": WeaponIcons.SniperRifle,
    ".*_shotgun": WeaponIcons.Shotgun,
    ".*_machinegun": WeaponIcons.MachineGun,
    ".*_rocket_launcher": WeaponIcons.RocketLauncher,
    ".*_sidearm": WeaponIcons.Sidearm,
    "type_weapon_sword": WeaponIcons.Sword,
    ".*_grenade_launcher": WeaponIcons.GrenadeLauncher,
    ".*_fusion_rifle_line": WeaponIcons.LinearFusionRifle,
    ".*_beam_rifle": WeaponIcons.TraceRifle,
    "type_weapon_bow": WeaponIcons.Bow,
    ".*_glaive": WeaponIcons.Glaive,
    ".*_submachinegun": WeaponIcons.SubmachineGun,
};

// TODO: these filters
const origins: IFilter[] = [
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

const perkFilter = ref("");
const includeSunsetWeapons = ref(false);
const activeFilters = ref<{ [category: string]: { [buttonText: string]: boolean } }>({});

const damageTypeFilters = computed(() => {
    return destinyDataService.damageTypes
        .filter(d => d.displayProperties.hasIcon)
        .map(d => {
            const filter: IFilter = {
                text: d.displayProperties.name,
                iconUrl: destinyDataService.getImageUrl(d.displayProperties.icon),
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
            const filter: IFilter = {
                text: c.displayProperties.name,
                iconUrl: weaponCategoryIconMap[c.itemTypeRegex],
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
            const filter: IFilter = {
                text: s.displayProperties.name || "The Red War",
                iconUrl: iconUrl,
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
    const uniqueTiers: IFilter[] = [];
    const seenTiers: { [name: string]: boolean } = {};
    const itemTierDefinitions = destinyDataService.itemTiers;
    itemTierDefinitions.sort((a, b) => a.index - b.index);

    for (const tier of itemTierDefinitions) {
        if (!seenTiers[tier.displayProperties.name]) {
            seenTiers[tier.displayProperties.name] = true;
            uniqueTiers.push({
                text: tier.displayProperties.name,
                iconUrl: tierIndexToIcon(tier.index),
                filter: (item: DestinyInventoryItemDefinition) => {
                    return !!item.inventory && item.inventory.tierTypeHash === tier.hash;
                }
            });
        }
    }

    return uniqueTiers;
});

const filterCategories = computed(() => {
    return [
        { name: "Damage Type", filters: damageTypeFilters.value, wide: false, },
        { name: "Weapon", filters: weaponCategoryFilters.value, wide: true, },
        { name: "Collections", filters: collectionCategoryFilters.value, wide: false, },
        { name: "Rarity", filters: itemTierFilters.value, wide: false, },
    ];
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

function onFilterButtonToggled(category: string, filter: IFilter, active: boolean) {
    if (!activeFilters.value[category]) {
        activeFilters.value[category] = {};
    }
    activeFilters.value[category][filter.text] = active;
}

function includeSunsetToggled() {
    includeSunsetWeapons.value = !includeSunsetWeapons.value;
}
</script>

<template>
    <div>
        <div>
            <span>Filters</span>
            <button>Apply Filters</button>
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
