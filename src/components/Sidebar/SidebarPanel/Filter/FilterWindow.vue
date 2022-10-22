<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinyDamageTypeDefinition, DestinyItemCategoryDefinition, DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import FilterOptionButton from "./FilterOptionButton.vue";
import WeaponIcons from "@/assets/WeaponIcons";
import OriginIcons from "@/assets/OriginIcons";

interface ICollectionsOriginButton {
    text: string;
    iconUrl: string;
}

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

const origins: ICollectionsOriginButton[] = [
    { text: "World (Current)", iconUrl: "", },
    { text: "Word (Old)", iconUrl: "", },
    { text: "Vanguard Ops", iconUrl: OriginIcons.FactionVanguard, },
    { text: "Crucible", iconUrl: OriginIcons.FactionCrucible, },
    { text: "Gambit", iconUrl: OriginIcons.FactionGambit, },
    { text: "Iron Banner", iconUrl: OriginIcons.FactionIronBanner, },
    { text: "Trials of Osiris", iconUrl: OriginIcons.FactionOsiris, },
    { text: "Nightfall", iconUrl: OriginIcons.Nightfall, },
    { text: "King's Fall", iconUrl: "", },
    { text: "Duality", iconUrl: OriginIcons.Duality, },
    { text: "Opulent", iconUrl: "", }, // TODO: this would be opulent weapons that were reissued ONLY
    { text: "Vow of the Disciple", iconUrl: OriginIcons.VowOfTheDisciple, },
    { text: "Throne World", iconUrl: "", },
    { text: "30th Anniversary", iconUrl: "", },
    { text: "Vault of Glass", iconUrl: OriginIcons.VaultOfGlass, },
    { text: "Europa", iconUrl: OriginIcons.Europa, },
    { text: "Deep Stone Crypt", iconUrl: "", },
    { text: "Prophecy Ops", iconUrl: OriginIcons.FactionTheNine, }, // TODO: this would be Trials of the Nine weapons that drop in Prophecy ONLY
    { text: "Altars of Sorrow", iconUrl: "", },
    { text: "Pit of Heresy", iconUrl: "", },
    { text: "Dreambane", iconUrl: "", },
    { text: "Garden of Salvation", iconUrl: "", },
    { text: "The Dreaming City", iconUrl: "", },
    { text: "Last Wish", iconUrl: "", },
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

const damageTypes = computed(() => {
    return destinyDataService.damageTypes.filter(d => d.displayProperties.hasIcon);
});

const weaponCategories = computed(() => {
    return destinyDataService.itemCategories.filter(c => c.itemTypeRegex && weaponCategoryIconMap[c.itemTypeRegex]);
});

const collectionCategories = computed(() => {
    // Just seasons right now, TODO: add other collections
    const collections: ICollectionsOriginButton[] = origins;
    const seasonCollections = destinyDataService.seasons
        .filter(s => includeSunsetWeapons.value || !isSunsetSeason(s))
        .map(s => {
            const iconUrl = s.displayProperties.hasIcon
                ? destinyDataService.getImageUrl(s.displayProperties.icon)
                : seasonIconMap[s.seasonNumber];
            return {
                text: s.displayProperties.name || "The Red War",
                iconUrl: iconUrl,
            };
        });
    return collections.concat(seasonCollections);
});

const itemTiers = computed(() => {
    const uniqueTiers: { text: string, }[] = [];
    const seenTiers: { [name: string]: boolean } = {};
    const itemTierDefinitions = destinyDataService.itemTiers;
    itemTierDefinitions.sort((a, b) => a.index - b.index);

    for (const tier of itemTierDefinitions) {
        if (!seenTiers[tier.displayProperties.name]) {
            seenTiers[tier.displayProperties.name] = true;
            uniqueTiers.push({ text: tier.displayProperties.name });
        }
    }

    return uniqueTiers;
});

function isSunsetSeason(season: DestinySeasonDefinition) {
    // Season of Dawn is last sunset season
    return season.seasonNumber <= 9;
}

function getDamageTypeIcon(damageType: DestinyDamageTypeDefinition) {
    return destinyDataService.getImageUrl(damageType.displayProperties.icon);
}

function getWeaponCategoryIcon(category: DestinyItemCategoryDefinition) {
    return weaponCategoryIconMap[category.itemTypeRegex];
}
</script>

<template>
    <div>
        <div>
            <span>Filters</span>
            <button>Apply Filters</button>
        </div>
        <CollapsibleSection name="Perks">
            <input type="text" v-model="perkFilter">
        </CollapsibleSection>
        <CollapsibleSection name="Damage Type">
            <div>
                <FilterOptionButton
                    v-for="damage of damageTypes"
                    :key="damage.hash"
                    :text="damage.displayProperties.name"
                    :icon-url="getDamageTypeIcon(damage)"
                ></FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Weapon">
            <div>
                <FilterOptionButton
                    v-for="weapon of weaponCategories"
                    :key="weapon.hash"
                    :text="weapon.displayProperties.name"
                    :icon-url="getWeaponCategoryIcon(weapon)"
                    wide
                ></FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Collections">
            <div>
                <FilterOptionButton
                    v-for="collection of collectionCategories"
                    :key="collection.text"
                    :text="collection.text"
                    :icon-url="collection.iconUrl"
                ></FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Rarity">
            <div>
                <FilterOptionButton
                    v-for="tier of itemTiers"
                    :key="tier.text"
                    :text="tier.text"
                ></FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Sunset">
            <FilterOptionButton text="Include Sunset Weapons"></FilterOptionButton>
        </CollapsibleSection>
    </div>
</template>

<style scoped>
</style>
