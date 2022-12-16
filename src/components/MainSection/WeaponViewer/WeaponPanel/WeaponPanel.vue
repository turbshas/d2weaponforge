<script setup lang="ts">
import WeaponIcon from '@/components/WeaponIcon.vue';
import { destinyDataService } from '@/data/destinyDataService';
import type { IPerkOption } from '@/data/types';
import { hashMapToArray } from '@/data/util';
import { computed, ref } from '@vue/reactivity';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { watch } from 'vue';
import SelectedPerks from './SelectedPerks.vue';
import WeaponStatBlock from './WeaponStatBlock.vue';

const shownStats: { [statName: string]: boolean } = {
    "Accuracy": true,
    "Aim Assistance": true,
    "Airborne Effectiveness": true,
    "Charge Time": true,
    "Draw Time": true,
    "Impact": true,
    "Handling": true,
    "Magazine": true,
    "Range": true,
    "Recoil Direction": true,
    "Reload Speed": true,
    "Stability": true,
    "Velocity": true,
    "Zoom": true,
}

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | undefined,
    selectedPerks: (IPerkOption | undefined)[],
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const isColumnEnhanced = ref<{ [column: number]: boolean }>({});

watch(() => props.weapon, () => {
    isColumnEnhanced.value = {};
});

watch(() => props.selectedPerks, (newValue, oldValue) => {
    if (newValue.length < 3 || oldValue.length < 3) {
        isColumnEnhanced.value = {};
        return;
    }
    const perk3Old = oldValue[2];
    const perk3New = newValue[2];
    if (perk3Old?.perk.hash !== perk3New?.perk.hash) {
        isColumnEnhanced.value[2] = false;
    }

    if (newValue.length < 4 || oldValue.length < 4) {
        isColumnEnhanced.value[3] = false;
        return;
    }
    const perk4Old = oldValue[3];
    const perk4New = newValue[3];
    if (perk4Old?.perk.hash !== perk4New?.perk.hash) {
        isColumnEnhanced.value[3] = false;
    }
});

const screenshot = computed(() => {
    return props.weapon ? destinyDataService.getImageUrl(props.weapon.screenshot) : undefined;
});

const name = computed(() => {
    return props.weapon ? props.weapon.displayProperties.name : undefined;
});

const type = computed(() => {
    return props.weapon ? props.weapon.itemTypeDisplayName : undefined;
});

const element = computed(() => {
    if (!props.weapon) return undefined;
    const damageTypeHash = props.weapon.defaultDamageTypeHash;
    if (!damageTypeHash) return undefined;
    const damageType = destinyDataService.getDamageType(damageTypeHash);
    if (!damageType) return undefined;
    return destinyDataService.getImageUrl(damageType.displayProperties.icon);
});

const stats = computed(() => {
    if (!props.weapon || !props.weapon.stats) return [];
    return hashMapToArray(props.weapon.stats.stats);
});

// TODO make this not as gross, should probably do some data processing in destinyDataService so fewer lookups are required by vue components
const filteredStats = computed(() => {
    return stats.value.filter(s => {
        const statDef = destinyDataService.getStatDefinition(s.statHash);
        return statDef && shownStats[statDef.displayProperties.name];
    });
});

const firstColumnPerk = computed(() => props.selectedPerks.length > 0 ? props.selectedPerks[0]?.perk : undefined);
const secondColumnPerk = computed(() => props.selectedPerks.length > 1 ? props.selectedPerks[1]?.perk : undefined);
const thirdColumnPerk = computed(() => {
    if (props.selectedPerks.length <= 2 || !props.selectedPerks[2]) return undefined;
    return isColumnEnhanced.value[2] ? props.selectedPerks[2].enhancedPerk: props.selectedPerks[2].perk;
});
const isThirdEnhanced = computed(() => !!isColumnEnhanced.value[2]);
const fourthColumnPerk = computed(() => {
    if (props.selectedPerks.length <= 3 || !props.selectedPerks[3]) return undefined;
    return isColumnEnhanced.value[3] ? props.selectedPerks[3].enhancedPerk: props.selectedPerks[3].perk;
});
const isFourthEnhanced = computed(() => !!isColumnEnhanced.value[3]);
const fifthColumnPerk = computed(() => props.selectedPerks.length > 4 ? props.selectedPerks[4]?.perk : undefined);

const currentSelectedPerks = computed(() => {
    return [firstColumnPerk.value, secondColumnPerk.value, thirdColumnPerk.value, fourthColumnPerk.value, fifthColumnPerk.value];
});

function onPerkClicked(column: number) {
    isColumnEnhanced.value[column] = !isColumnEnhanced.value[column];
}
</script>

<template>
    <div class="panel" :style="{ 'background-image': 'url(' + screenshot + ')' }">
        <div class="summary">
            <WeaponIcon class="icon" :weapon="weapon"></WeaponIcon>
            <div class="description">
                <span>{{ name }}</span>
                <span>{{ type }}</span>
            </div>
            <img class="element" :src="element">
        </div>
        <WeaponStatBlock
            class="stats"
            :stats="filteredStats"
            :selected-perks="currentSelectedPerks"
            :masterwork="masterwork"
            :mod="mod"
        ></WeaponStatBlock>
        <SelectedPerks
            class="perks"
            :weapon="weapon"
            :perk1="firstColumnPerk"
            :perk2="secondColumnPerk"
            :perk3="thirdColumnPerk"
            :perk4="fourthColumnPerk"
            :is-perk3-enhanced="isThirdEnhanced"
            :is-perk4-enhanced="isFourthEnhanced"
            :origin-perk="fifthColumnPerk"
            :masterwork="masterwork"
            :mod="mod"
            @perk-clicked="onPerkClicked"
        ></SelectedPerks>
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    /* aspect ratio of image is 16:9 */
    width: 800px;
    height: 450px;
    background-size: contain;
}

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 50px;
    height: 50px;
    border-radius: 0;
    border-top: 2px;
    border-bottom: 2px;
    border-left: 2px;
    border-right: 2px;
    border-style: solid;
    border-color: white;
}

.description {
    display: flex;
    flex-direction: column;
}

.element {
    margin-left: auto;
    width: 50px;
    height: 50px;
}

.stats {
    max-width: 50%;
}

.perks {
    margin-top: auto;
    margin-right: auto;
}
</style>
