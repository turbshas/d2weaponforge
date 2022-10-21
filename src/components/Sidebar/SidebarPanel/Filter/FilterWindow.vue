<script setup lang="ts">
import { destinyDataService } from "@/data/destinyDataService";
import type { DestinyDamageTypeDefinition, DestinyItemCategoryDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import FilterOptionButton from "./FilterOptionButton.vue";
import autoRifleSvg from "@/assets/WeaponIcons/auto_rifle.svg";
import bowSvg from "@/assets/WeaponIcons/bow.svg";
import fusionRifleSvg from "@/assets/WeaponIcons/fusion_rifle.svg";
import glaiveSvg from "@/assets/WeaponIcons/glaive.svg";
import grenadeLauncherSvg from "@/assets/WeaponIcons/grenade_launcher.svg";
import handCannonSvg from "@/assets/WeaponIcons/hand_cannon.svg";
import linearFusionRifleSvg from "@/assets/WeaponIcons/wire_rifle.svg";
import machineGunSvg from "@/assets/WeaponIcons/machine_gun.svg";
import pulseRifleSvg from "@/assets/WeaponIcons/pulse_rifle.svg";
import rocketLauncherSvg from "@/assets/WeaponIcons/rocket_launcher.svg";
import scoutRifleSvg from "@/assets/WeaponIcons/scout_rifle.svg";
import shotgunSvg from "@/assets/WeaponIcons/shotgun.svg";
import sidearmSvg from "@/assets/WeaponIcons/sidearm.svg";
import smgSvg from "@/assets/WeaponIcons/smg.svg";
import sniperRifleSvg from "@/assets/WeaponIcons/sniper_rifle.svg";
import swordSvg from "@/assets/WeaponIcons/sword.svg";
import traceRifleSvg from "@/assets/WeaponIcons/trace_rifle.svg";

const weaponCategoryIconMap: { [itemRegex: string]: string } = {
    ".*_auto_rifle": autoRifleSvg,
    ".*_hand_cannon": handCannonSvg,
    ".*_pulse_rifle": pulseRifleSvg,
    ".*_scout_rifle": scoutRifleSvg,
    "type_weapon_fusion_rifle": fusionRifleSvg,
    ".*_sniper_rifle": sniperRifleSvg,
    ".*_shotgun": shotgunSvg,
    ".*_machinegun": machineGunSvg,
    ".*_rocket_launcher": rocketLauncherSvg,
    ".*_sidearm": sidearmSvg,
    "type_weapon_sword": swordSvg,
    ".*_grenade_launcher": grenadeLauncherSvg,
    ".*_fusion_rifle_line": linearFusionRifleSvg,
    ".*_beam_rifle": traceRifleSvg,
    "type_weapon_bow": bowSvg,
    ".*_glaive": glaiveSvg,
    ".*_submachinegun": smgSvg,
};

const perkFilter = ref("");

const damageTypes = computed(() => {
    return destinyDataService.damageTypes.filter(d => !!d.displayProperties.icon);
});

const weaponCategories = computed(() => {
    return destinyDataService.itemCategories.filter(c => c.itemTypeRegex && weaponCategoryIconMap[c.itemTypeRegex]);
});

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
                >
                </FilterOptionButton>
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
                >
                </FilterOptionButton>
            </div>
        </CollapsibleSection>
        <CollapsibleSection name="Collections">
        </CollapsibleSection>
        <CollapsibleSection name="Rarity">
        </CollapsibleSection>
        <CollapsibleSection name="Sunset">
        </CollapsibleSection>
    </div>
</template>

<style scoped>
</style>
