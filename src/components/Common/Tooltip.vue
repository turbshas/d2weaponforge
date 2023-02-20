<script setup lang="ts">
import type { ICraftingInfo } from '@/data/interfaces';
import { computed, ref, watch } from 'vue';
import TooltipDescription from './TooltipDescription.vue';

const props = defineProps<{
    targetElement: HTMLElement | null,
    title: string,
    subtitle: string,
    craftingInfo: ICraftingInfo | undefined,
    description: string,
    effect: string | null,
    bonuses: { statName: string, value: number }[],
    enhancedDescription?: string,
    enhancedEffects?: string,
    enhancedBonuses: { statName: string, value: number }[],
}>();

// Dimensions in units of px
const tooltipWidth = 350;
const mouseIsHovering = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const showTooltip = computed(() => !!props.targetElement && mouseIsHovering.value);
const tooltipTop = computed(() => `${mouseY.value}px`);
const tooltipLeft = computed(() => `${mouseX.value - tooltipWidth}px`);

const requiredCraftLevel = computed(() => props.craftingInfo && props.craftingInfo.requiredLevel);
const requiredCraftLevelEnhanced = computed(() => props.craftingInfo && props.craftingInfo.requiredLevelEnhanced);
const requiredLevelText = computed(() => requiredCraftLevel.value ? `Lv${requiredCraftLevel.value}` : "");
const requiredEnhancedLevelText = computed(() => requiredCraftLevelEnhanced.value ? `Lv${requiredCraftLevelEnhanced.value}` : "");

const showEnhanced = computed(() => !!props.enhancedDescription || !!props.enhancedEffects || props.enhancedBonuses.length > 0);
const descriptionEnhanced = computed(() => props.enhancedDescription || "");
const effectsEnhanced = computed(() => props.enhancedEffects || "");

watch(() => props.targetElement, (newValue, oldValue) => {
    if (oldValue) {
        removeMouseListeners(oldValue);
    }
    if (newValue) {
        addMouseListeners(newValue);
    }
});

function addMouseListeners(element: HTMLElement) {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
}

function removeMouseListeners(element: HTMLElement) {
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("mouseenter", onMouseEnter);
    element.removeEventListener("mouseleave", onMouseLeave);
}

function onMouseMove(ev: MouseEvent) {
    mouseX.value = ev.pageX;
    mouseY.value = ev.pageY;
}

function onMouseEnter() {
    mouseIsHovering.value = true;
}

function onMouseLeave() {
    mouseIsHovering.value = false;
}
</script>

<template>
    <div class="tooltip" :style="{ 'top': tooltipTop, 'left': tooltipLeft, }" v-show="showTooltip">
        <div class="header" v-if="!!props.title || !!props.subtitle">
            <h4 class="title" v-if="!!props.title">{{ props.title }}</h4>
            <div class="subheader" v-if="!!props.subtitle">
                <span class="subtitle">{{ props.subtitle }}</span>
                <span class="level" v-if="!!requiredCraftLevel">{{ requiredLevelText }}</span>
            </div>
        </div>

        <div class="body">
            <TooltipDescription
                class="description"
                :description="props.description"
                :effect="props.effect"
                :bonuses="props.bonuses"
            ></TooltipDescription>
            <div class="enhanced description" v-if="showEnhanced">
                <div class="subheader">
                    <span class="subtitle">Enhanced Benefits</span>
                    <span class="level" v-if="!!requiredCraftLevelEnhanced">{{ requiredEnhancedLevelText }}</span>
                </div>
                <TooltipDescription
                    :description="descriptionEnhanced"
                    :effect="effectsEnhanced"
                    :bonuses="props.enhancedBonuses"
                ></TooltipDescription>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.tooltip {
    position: fixed;
    z-index: 9999;
    pointer-events: none;

    width: 350px;
    max-width: 350px;
    
    display: flex;
    flex-direction: column;

    color: #eee;
    line-height: 1.4;
    text-align: left;
}

.header {
    border-top: 5px solid #eee;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;

    background-color: rgba(11, 14, 17, 0.95);
}

.title {
    margin: 0;
    font-size: 20.8px;
    font-weight: 600;
    text-transform: uppercase;
}

.subheader {
    display: flex;
    align-items: center;
    font-size: 14.4px;
    font-weight: 500;

    .subtitle {
        text-transform: capitalize;

        .enhanced & {
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffce1f;
        }
    }

    .level {
        margin-left: auto;
        font-size: 11.2px;
    }

    .enhanced & {
        padding-top: 2px;
        padding-bottom: 4px;
        font-size: 11.2px;
    }
}

.body {
    display: flex;
    flex-direction: column;
    background-color: rgba(26, 26, 26, 0.9);
}

.description {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    background-color: transparent;

    &.enhanced {
        padding-top: 4px;
    }
}

.enhanced {
    position: relative;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #ffce1f;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background: linear-gradient(0deg, rgba(183, 140, 37, 0), rgba(255, 206, 31, 0.1));
    }
}
</style>
