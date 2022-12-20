<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    targetElement: HTMLElement | null,
    title: string,
    subtitle: string,
    description: string,
    effect: string | null,
    bonuses: string | null,
}>();

// Dimensions in units of px
const tooltipWidth = 400;
const mouseIsHovering = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const showTooltip = computed(() => !!props.targetElement && mouseIsHovering.value);
const tooltipTop = computed(() => `${mouseY.value}px`);
const tooltipLeft = computed(() => `${mouseX.value - tooltipWidth}px`);

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
        <div class="header">
            <div class="title">{{ props.title }}</div>
            <div class="subtitle">{{ props.subtitle }}</div>
        </div>

        <div class="body">
            <div class="description">{{ props.description }}</div>
            <div class="effect" v-if="props.effect">{{ props.effect }}</div>

            <div class="separator" v-if="props.bonuses"></div>
            <div class="bonus" v-if="props.bonuses">{{ props.bonuses }}</div>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    position: fixed;
    width: 400px;
    height: 50px;
    z-index: 1000;
    
    display: flex;
    flex-direction: column;
    background-color: black;
    color: white;
}

.body {
    background-color: black;
    color: white;
}
</style>
