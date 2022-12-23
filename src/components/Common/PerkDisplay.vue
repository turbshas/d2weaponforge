<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { computed, ref } from 'vue';
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import Tooltip from './Tooltip.vue';

const props = defineProps<{
    perk: DestinyInventoryItemDefinition | undefined,
    selected: boolean,
    retired: boolean,
    enhanced?: boolean,
    fullSize?: boolean,
    hideHover?: boolean,
}>();

const emits = defineEmits<{
    (e: "click", perk: DestinyInventoryItemDefinition): void
}>();

const perkIcon = computed(() => {
    if (!props.perk) return undefined;
    return destinyDataService.getImageUrl(props.perk.displayProperties.icon);
});
const perkWatermark = computed(() => {
    if (!props.perk || !props.perk.iconWatermark) return undefined;
    return destinyDataService.getImageUrl(props.perk.iconWatermark);
});

const perkElement = ref<HTMLElement | null>(null);
const tooltipTargetElement = computed(() => props.perk ? perkElement.value : null);
const tooltipTitle = computed(() => props.perk ? props.perk.displayProperties.name : "");
const tooltipSubtitle = computed(() => props.perk ? props.perk.itemTypeDisplayName : "");
const tooltipDescription = computed(() => props.perk ? props.perk.displayProperties.description : "");
// TODO: this require outside data, complete when that is compiled.
const tooltipEffects = computed(() => "");
const tooltipBonuses = computed(() => {
    if (!props.perk) return [];
    return props.perk.investmentStats.map(s => {
        const statDef = destinyDataService.getStatDefinition(s.statTypeHash);
        const name = statDef ? statDef.displayProperties.name : "";
        return {
            statName: name,
            value: s.value,
        };
    });
});
// TODO: this require outside data, complete when that is compiled.
const tooltipEnhanced = computed(() => false);
// TODO: this require outside data, complete when that is compiled.
const tooltipEnhancedBonus = computed(() => "");

function onPerkClick() {
    if (!props.perk) return;
    emits("click", props.perk);
}
</script>

<template>
    <div
        :ref="(el) => { perkElement = el as HTMLElement | null; }"
        class="wrapper"
        :class="{ 'random-roll-wrapper': !fullSize, 'selected': selected }"
        @click="onPerkClick"
    >
        <div
            class="icon"
            :class="{ 'random-roll-icon': !fullSize, 'retired': retired, 'hover': !hideHover, }"
            :style="{ 'background-image': 'url(' + perkIcon +')', }"
        >
            <img class="icon" v-if="perkWatermark" :src="perkWatermark">
        </div>
        <div class="enhanced-gradient-wrapper" v-if="enhanced && !selected">
            <div class="enhanced-gradient"></div>
        </div>
        <div class="enhanced-arrow" v-if="enhanced"></div>
        <Tooltip
            :target-element="tooltipTargetElement"
            :title="tooltipTitle"
            :subtitle="tooltipSubtitle"
            :description="tooltipDescription"
            :effect="tooltipEffects"
            :bonuses="tooltipBonuses"
            :enhanced="tooltipEnhanced"
            :enhanced-bonus="tooltipEnhancedBonus"
        ></Tooltip>
    </div>
</template>

<style scoped>
.wrapper {
    width: 48px;
    height: 48px;
    position: relative;
}

.selected {
    background-color: #518dba;
}

.icon {
    width: 48px;
    height: 48px;
    background-size: contain;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
.icon::before, .icon::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
}
.icon.random-roll-icon::before, .icon.random-roll-icon::after {
    border-radius: 50%;
}
.icon::before {
    transition: background-color .5s cubic-bezier(0.19, 1, 0.22, 1);
}
.hover:hover::before {
    box-shadow: inset 0 0 0 2px #ccc;
    background-color: hsla(0, 0%, 100%, 0.4)
}
.icon::after {
    transition: 
        box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1),
        transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
        opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1)
    ;
}
.hover:focus::after, .hover:hover::after {
    box-shadow: 0 0 0 1px #fafafa;
    transform: scale(1.085) translateZ(0);
    opacity: 1;
}

.random-roll-wrapper {
    box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.4);
    border-radius: 50%;
}

.random-roll-icon {
    background-size: 75%;
    background-position-x: 50%;
    background-position-y: center;
    background-repeat: no-repeat;
}

.retired {
    filter: brightness(0.3);
}

.enhanced-gradient-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.enhanced-gradient {
    position: absolute;
    top: 50%;
    bottom: -50%;
    left: 0;
    right: 0;
    border-radius: 50%;
    background: radial-gradient(circle,rgba(255,206,31,.15) 0,rgba(183,140,37,0) 100%);
}

.enhanced-arrow {
    content: "";
    width: 10px;
    height: 100%;
    position: absolute;
    top: 6px;
    margin-left: -4px;
    background: linear-gradient(#ffce1f 0 0) bottom/3px calc(100% - 5px),conic-gradient(from 134deg at top,transparent,#ffce1f 1deg 90deg,transparent 91deg) top/100% 5px;
    background-origin: content-box;
    background-repeat: no-repeat;
    clip-path: path("M0,0 A24,24 180 0 0 48,19 L48,0");
}
</style>
