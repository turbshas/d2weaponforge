<script setup lang="ts">
import type { ICraftingInfo, IPerk, IPerkBonus, ModHash, PerkColumnNumber, PerkHash } from '@/data/interfaces';
import { destinyDataService, selectionService } from '@/data/services';
import { computed, ref } from 'vue';
import ElementLabel from './ElementLabel.vue';
import Tooltip from './Tooltip.vue';

const props = defineProps<{
    perk: IPerk | undefined,
    enhancedPerk?: IPerk | undefined,
    isAdept: boolean,
    craftingInfo: ICraftingInfo | undefined,
    selected: boolean,
    retired: boolean,
    column?: PerkColumnNumber,
    /** Manual override to show as enhanced if, for example, only the enhanced perk is to be shown. */
    enhanced?: boolean,
    fullSize?: boolean,
    hideHover?: boolean,
}>();

const emits = defineEmits<{
    (e: "perkClicked", perk: IPerk): void
}>();

const perkIsEnhanced = computed(() => !!props.enhancedPerk || !!props.enhanced);
const perkName = computed(() => props.perk && props.perk.name || "Empty");
const perkTypeDisplayName = computed(() => props.perk && props.perk.itemTypeDisplayName ? props.perk.itemTypeDisplayName : "Empty");
const perkIcon = computed(() => {
    if (!props.perk) return undefined;
    return destinyDataService.getImageUrl(props.perk.iconUrl);
});
const perkWatermark = computed(() => {
    if (!props.perk || !props.perk.iconWatermarkUrl) return undefined;
    return destinyDataService.getImageUrl(props.perk.iconWatermarkUrl);
});
const perkBonuses = computed(() => getPerkBonuses(props.perk));
const enhancedPerkBonuses = computed(() => getPerkBonuses(props.enhancedPerk));

const perkId = computed(() => `perk_id_${perkName.value}_${(props.column ? props.column : -1)}`);
const perkLabel = computed(() => {
    const prefix = props.column ? `Perk ${props.column}` : "Perk";
    return `${prefix}: ${perkName.value}`;
});
const perkIconLabel = computed(() => `Perk Icon: ${perkName.value}`);
const perkWatermarkLabel = computed(() => `Perk Watermark: ${perkName.value}`);

// Tooltip info
const perkElement = ref<HTMLElement | null>(null);
const tooltipTargetElement = computed(() => props.perk ? perkElement.value : null);

const perkDescription = computed(() => props.perk && props.perk.description ? props.perk.description : "");
const tooltipEffects = computed(() => props.perk ? getPerkInsights(props.perk.hash) : "");
const tooltipBonuses = computed(() => getPerkDisplayBonuses(perkBonuses.value));
const enhancedDescription = computed(() => props.enhancedPerk ? props.enhancedPerk.description : "");
const tooltipEnhancedEffects = computed(() => props.enhancedPerk ? getPerkInsights(props.enhancedPerk.hash) : "");
const tooltipEnhancedBonus = computed(() => getPerkDisplayBonuses(enhancedPerkBonuses.value));

function getPerkBonuses(perk: IPerk | undefined) {
    if (!perk) return [];
    const bonuses = perk.mainBonuses;
    return ((perkIsEnhanced.value && selectionService.showCraftedBonus) || props.isAdept)
        ? bonuses.concat(perk.adeptOrCraftedBonuses)
        : bonuses;
}

function getPerkDisplayBonuses(perkBonuses: IPerkBonus[]) {
    if (selectionService.rawStatValues) return perkBonuses;
    const column = props.column;
    const convertedBonuses: { statName: string, value: number }[] = perkBonuses.map(b => {
        return {
            statName: b.statName,
            value: selectionService.displayValueIfAddingBonus(b, column),
        };
    });
    return convertedBonuses;
}

function getPerkInsights(hash: number) {
    const perkInsights = destinyDataService.perkInsights;
    if (!perkInsights) return "";
    const perkInsight = perkInsights.weaponPerks[hash as PerkHash] || perkInsights.weaponMods[hash as ModHash];
    if (!perkInsight) return "";
    return perkInsight.description;
}

function onPerkClick() {
    if (!props.perk) return;
    emits("perkClicked", props.perk);
}
</script>

<template>
    <button
        :id="perkId"
        :ref="(el) => { perkElement = el as HTMLElement | null; }"
        class="wrapper"
        :class="{ 'random-roll': !props.fullSize, 'selected': props.selected }"
        @click="onPerkClick"
        tabindex="0"
    >
        <ElementLabel :for-id="perkId" :text="perkLabel"></ElementLabel>
        <div
            class="icon-wrapper"
            :class="{ 'retired': props.retired, 'hover': !props.hideHover, }"
        >
            <img class="icon" v-if="perkIcon" :src="perkIcon" :alt="perkIconLabel">
            <img class="icon watermark" v-if="perkWatermark" :src="perkWatermark" :alt="perkWatermarkLabel">
        </div>

        <div class="enhanced-gradient-wrapper" v-if="perkIsEnhanced && !props.selected">
            <div class="enhanced-gradient"></div>
        </div>
        <div class="enhanced-arrow" v-if="perkIsEnhanced"></div>

        <Tooltip
            :target-element="tooltipTargetElement"
            :title="perkName"
            :subtitle="perkTypeDisplayName"
            :crafting-info="props.craftingInfo"
            :description="perkDescription"
            :effect="tooltipEffects"
            :bonuses="tooltipBonuses"
            :enhanced="props.enhanced"
            :enhanced-description="enhancedDescription"
            :enhanced-effects="tooltipEnhancedEffects"
            :enhanced-bonuses="tooltipEnhancedBonus"
        ></Tooltip>
    </button>
</template>

<style scoped lang="less">
.wrapper {
    width: 48px;
    height: 48px;
    position: relative;
    background-color: transparent;
    border: none;
    padding: 0;

    &.selected {
        background-color: #518dba;
    }

    /* The circle around the icon */
    &.random-roll {
        box-shadow: inset 0 0 0 2px hsla(0,0%,100%,.4);
        border-radius: 50%;
    }
}

.icon-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;

    &.retired {
        filter: brightness(0.3);
    }

    /* This section is for the hover effect on perks. */
    &::before, &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        /* For random roll perks, make the hover a circle instead of square. */
        /* This applies when the parent has class "random-roll" */
        .random-roll & {
            border-radius: 50%;
        }
    }
    &::before {
        transition: background-color .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    &::after {
        transition: 
            box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1)
        ;
    }
}

.hover {
    &:hover::before {
        box-shadow: inset 0 0 0 2px #ccc;
        background-color: hsla(0, 0%, 100%, 0.4)
    }
    &:focus::after, &:hover::after {
        box-shadow: 0 0 0 1px #fafafa;
        transform: scale(1.085) translateZ(0);
        opacity: 1;
    }
}

.icon {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    &.watermark {
        z-index: 11;
    }

    /* This applies when the parent has class "random-roll" */
    .random-roll & {
        width: 75%;
        height: 75%;
        top: 12.5%;
        left: 12.5%;
    }
}

.enhanced-gradient-wrapper {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
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
    z-index: 10;
    background: linear-gradient(#ffce1f 0 0) bottom/3px calc(100% - 5px),conic-gradient(from 134deg at top,transparent,#ffce1f 1deg 90deg,transparent 91deg) top/100% 5px;
    background-origin: content-box;
    background-repeat: no-repeat;
    clip-path: path("M0,0 A24,24 180 0 0 48,19 L48,0");
}
</style>
