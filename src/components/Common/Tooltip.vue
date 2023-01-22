<script setup lang="ts">
import type { ICraftingInfo } from '@/data/types';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    targetElement: HTMLElement | null,
    title: string,
    subtitle: string,
    craftingInfo: ICraftingInfo | undefined,
    description: string,
    effect: string | null,
    bonuses: { statName: string, value: number }[],
    enhanced?: boolean,
    enhancedBonus?: string,
}>();

// Dimensions in units of px
const tooltipWidth = 350;
const mouseIsHovering = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const showTooltip = computed(() => !!props.targetElement && mouseIsHovering.value);
const tooltipTop = computed(() => `${mouseY.value}px`);
const tooltipLeft = computed(() => `${mouseX.value - tooltipWidth}px`);
const showBonuses = computed(() => props.bonuses && props.bonuses.length > 0);

const requiredCraftLevel = computed(() => props.craftingInfo && props.craftingInfo.requiredLevel);
const requiredCraftLevelEnhanced = computed(() => props.craftingInfo && props.craftingInfo.requiredLevelEnhanced);
const requiredLevelText = computed(() => requiredCraftLevel.value ? `Lv${requiredCraftLevel.value}` : "");
const requiredEnhancedLevelText = computed(() => requiredCraftLevelEnhanced.value ? `Lv${requiredCraftLevelEnhanced.value}` : "");

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

function textForStatValue(value: number) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}`;
}
</script>

<template>
    <div class="tooltip" :style="{ 'top': tooltipTop, 'left': tooltipLeft, }" v-show="showTooltip">
        <div class="header">
            <h4 class="title">{{ props.title }}</h4>
            <div class="subtitle">
                {{ props.subtitle }}
                <span class="level" v-if="!!requiredCraftLevel">{{ requiredLevelText }}</span>
            </div>
        </div>

        <div class="body">
            <div class="description">{{ props.description }}</div>
            <div class="effect" v-if="props.effect">{{ props.effect }}</div>

            <div class="stats" v-if="showBonuses">
                <ul class="stats-list">
                    <li class="item" v-for="bonus of props.bonuses" :key="bonus.statName">
                        <span class="name">{{ bonus.statName }}</span>
                        <span
                            class="value"
                            :class="{ 'positive': bonus.value > 0, 'negative': bonus.value < 0, }"
                        >{{ textForStatValue(bonus.value) }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="enhanced" v-if="props.enhanced">
            <div class="enhanced-title">
                Enhanced Benefits
                <span class="level" v-if="!!requiredCraftLevelEnhanced">{{ requiredEnhancedLevelText }}</span>
            </div>
            <div class="enhanced-bonus">{{ props.enhancedBonus }}</div>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    position: fixed;
    z-index: 9999;
    pointer-events: none;

    width: 350px;
    max-width: 350px;
    
    display: flex;
    flex-direction: column;

    background-color: black;
    color: #eee;
    line-height: 1.4;
    text-align: left;
}

.header {
    border-top-width: 5px;
    border-top-style: solid;
    border-top-color: #eee;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
}

.title {
    margin: 0;
    font-size: 20.8px;
    font-weight: 600;

    text-transform: uppercase;
}

.subtitle {
    display: flex;
    margin-top: 4px;
    font-size: 14.4px;
    font-weight: 500;

    text-transform: capitalize;
}

.level {
    margin-left: auto;
    text-transform: none;
}

.body {
    margin: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;

    background-color: rgba(26, 26, 26, 0.9);
    font-size: 12.8px;
}

.description {
    margin: 0;
    padding-bottom: 4px;

    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    font-weight: 300;
    font-style: normal;
    white-space: pre-wrap;
}

.effect {
    margin-top: 4px;

    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    font-size: 11.2px;
    font-weight: 500;
    white-space: pre-wrap;
    color: #949494;
}

.stats {
    margin-top: 8px;
    padding-top: 8px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #fafafa;
}

.stats-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.stats-list .item {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 4px;

    line-height: 18.4px;
    font-size: 16px;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
}
.stats-list .name {
    display: flex;
    align-items: center;
    padding-right: 16px;

    font-size: 12.8px;
    line-height: 12.8px;
    text-align: right;
}
.stats-list .value {
    display: flex;
    align-items: center;
    flex-basis: 60%;
    font-size: 12.8px;
}
.stats-list .value.positive {
    color: #68cc79;
}
.stats-list .value.negative {
    color: #e25954;
}

.enhanced {
    position: relative;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #ffce1f;
}
.enhanced-bonus::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: linear-gradient(0deg, rgba(183, 140, 37, 0), rgba(255, 206, 31, 0.1));
}
.enhanced-title {
    display: flex;
    margin-bottom: 4px;
    font-size: 11.2px;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #ffce1f;
}
.enhanced-bonus {
    margin: 0;
    padding-bottom: 4px;

    white-space: pre-wrap;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    font-weight: 300;
    font-style: normal;
}
</style>
