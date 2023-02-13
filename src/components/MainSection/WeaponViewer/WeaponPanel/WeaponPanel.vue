<script setup lang="ts">
import Tooltip from '@/components/Common/Tooltip.vue';
import WeaponIcon from '@/components/Common/WeaponIcon.vue';
import { destinyDataService } from '@/data/services';
import type { ISelectedGear, PerkColumnNumber } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const weapon = computed(() => props.selectedGear.weapon.value);

const screenshot = computed(() => {
    return weapon.value ? destinyDataService.getImageUrl(weapon.value.screenshotUrl) : undefined;
});

const name = computed(() => weapon.value ? weapon.value.name : "");
const type = computed(() => weapon.value ? weapon.value.itemTypeDisplayName : "");
const description = computed(() => weapon.value ? weapon.value.description : "");
const elementName = computed(() => weapon.value ? weapon.value.damageType.name : "None");
const elementIcon = computed(() => weapon.value ? destinyDataService.getImageUrl(weapon.value.damageType.iconUrl) : undefined);
const elementLabel = computed(() => `Element Type: ${elementName.value}`);
const statInfos = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);

const weaponNameElement = ref<HTMLElement | null>(null);

function onPerkClicked(column: PerkColumnNumber) {
    const perk = props.selectedGear.perkOptionsMap.value[column];
    if (!perk) return;
    perk.useEnhanced = !perk.useEnhanced;
}
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }">
        <div class="summary">
            <div class="summary" :ref="(el) => { weaponNameElement = el as HTMLElement | null; }">
                <WeaponIcon class="icon" with-border :weapon="weapon"></WeaponIcon>
                <div class="description">
                    <h1>{{ name }}</h1>
                    <h3>{{ type }}</h3>
                </div>
            </div>
            <img class="element" :src="elementIcon" :alt="elementLabel">
            <Tooltip
                :target-element="weaponNameElement"
                title=""
                subtitle=""
                :description="description"
                :crafting-info="undefined"
                :effect="null"
                :bonuses="[]"
            ></Tooltip>
        </div>
        <WeaponStatBlock
            class="stats"
            :display-stats="statInfos"
        ></WeaponStatBlock>
        <SelectedPerks
            class="perks"
            :intrinsic="weapon?.archetype"
            :selected-perks="props.selectedGear.perkOptionsMap.value"
            :masterwork="props.selectedGear.masterwork.value"
            :mod="props.selectedGear.mod.value"
            :is-adept="!!(weapon?.isAdept)"
            @perk-clicked="onPerkClicked"
        ></SelectedPerks>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    aspect-ratio: 16 / 9;
    background-size: cover;
    padding: 16px;
}

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 52px;
    height: 52px;
    margin-right: 16px;
}

.description {
    display: flex;
    flex-direction: column;
}
.description h1 {
    font-size: 32px;
    font-weight: 600;
    line-height: 32px;
    text-transform: uppercase;
}
.description h3 {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
}

.element {
    margin-left: auto;
    width: 42px;
    height: 42px;
}

.stats {
    margin-top: 16px;
    margin-bottom: 6px;
    max-width: 50%;
}

.perks {
    justify-content: flex-end;
    margin-top: auto;
    margin-left: auto;
}
</style>
