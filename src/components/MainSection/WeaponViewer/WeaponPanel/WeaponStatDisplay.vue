<script setup lang="ts">
import { StatDisplayType } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemStatDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';

const statDisplayTypeMap: { [statName: string]: StatDisplayType } = {
    "Recoil Direction": StatDisplayType.Angle,
    "Rounds Per Minute": StatDisplayType.Number,
    "Draw Time": StatDisplayType.Number,
    "Charge Time": StatDisplayType.Number,
    "Magazine": StatDisplayType.Number,
};

const props = defineProps<{
    definition: DestinyStatDefinition | undefined,
    value: DestinyInventoryItemStatDefinition,
    modifier: number,
}>();

const name = computed(() => {
    return props.definition && props.definition.displayProperties.name;
});

const total = computed(() => {
    const value = props.value.value + props.modifier;
    return value < 0 ? 0 : (value > 100 ? 100 : value);
});
const modifierSign = computed(() => props.modifier > 0 ? "+" : "");
const modifierMagnitude = computed(() => Math.abs(props.modifier));
const changeColor = computed(() => {
    if (props.modifier > 0) return "green";
    else if (props.modifier < 0) return "red";
    else return "black";
});
const filledWidthPercent = computed(() => props.modifier > 0 ? props.value.value : total.value);

const statDisplayType = computed(() => {
    if (!name.value) return StatDisplayType.Bar;
    return statDisplayTypeMap[name.value] ? statDisplayTypeMap[name.value] : StatDisplayType.Bar;
});

function recoilDirectionFunction(recoilDirection: number) {
    // Decay function is a straight line with slope -1, y-intercept 100
    // Value function is cos wave with period 20 (i.e. multiplier 2*pi/20)
    const clamped = recoilDirection > 100 ? 100 : (recoilDirection < 0 ? 0 : recoilDirection);
    const decay = 100 - clamped;
    const cosine = Math.cos((Math.PI / 10) * clamped);
    return decay * cosine;
}

function recoilDirectionWedgeBaseAngle(recoilDirection: number) {
    const value = recoilDirectionFunction(recoilDirection);
    // Negative output from the recoil direction function means recoil tends left,
    // which means the angle needs to be positive (counter-clockwise) relative to a vertical line.
    // So, negate the result.
    // Scaled to [-80 deg, 80 deg] - this is what d2gunsmith seems to do
    return -(value / 100) * (80 * (Math.PI / 180));
}

function recoilDirectionDeflectionAngle(recoilDirection: number) {
    const decay = 100 - recoilDirection;
    // Scale the angle to the range [-pi/2, pi/2]
    return (decay / 100) * (Math.PI / 2);
}

function recoilDirectionAngleToAbsoluteCoords(angle: number) {
    // Since y coords on a computer start at the top and positive is down, need to negate the result of sin.
    return [Math.cos(angle) + 1, -Math.sin(angle) + 1];
}

function getSvgPathData(recoilDirection: number) {
    const baseAngle = recoilDirectionWedgeBaseAngle(recoilDirection) + (Math.PI / 2);
    const deflectionAngle = recoilDirectionDeflectionAngle(recoilDirection);
    const [startX, startY] = recoilDirectionAngleToAbsoluteCoords(baseAngle + deflectionAngle);
    const [endX, endY] = recoilDirectionAngleToAbsoluteCoords(baseAngle - deflectionAngle);

    const arcRadiusX = 1;
    const arcRadiusY = 1;
    const xAxisRotation = 0;
    const largeArcFlag = 0;
    const sweepAngle = 1;
    return `M1,1 L${startX},${startY} A${arcRadiusX},${arcRadiusY} ${xAxisRotation} ${largeArcFlag} ${sweepAngle} ${endX},${endY} Z`;
}
</script>

<template>
    <div class="stat">
        <span class="name">{{ name }}</span>
        <div class="display">
            <div class="bar" v-if="statDisplayType === StatDisplayType.Bar">
                <div class="value">
                    <span class="current" :style="{ color: changeColor }">{{ total }}</span>
                    <span class="modifier" :style="{ color: changeColor }" v-if="modifier !== 0">({{ modifierSign + modifier }})</span>
                </div>
                <div class="filled" :style="{ 'width': filledWidthPercent + '%' }"></div>
                <div
                    class="change"
                    :style="{ 'width': modifierMagnitude + '%', 'background-color': changeColor }"
                    v-if="modifier !== 0"
                ></div>
            </div>
            <div class="angle" v-if="statDisplayType === StatDisplayType.Angle">
                <span>{{ total }}</span>
                <svg class="pie" height="12" viewBox="0 0 2 1">
                    <circle class="circle" r="1" cx="1" cy="1"></circle>
                    <path
                        class="path"
                        :d="getSvgPathData(total)"
                        fill="#fafafa"
                    ></path>
                </svg>
            </div>
            <div class="number" v-if="statDisplayType === StatDisplayType.Number">
                {{ total }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.stat {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.name {
    width: 30%;
    text-align: right;
}

.display {
    width: 70%;
    display: flex;
}

.bar {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 70%;
    background-color: grey;
}

.value {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: row;
    z-index: 10;
}

.current {
    color: black;
}

.modifier {
    color: black;
}

.filled {
    background-color: white;
}

.change {
    background-color: blue;
}

.pie {
    width: 24px;
    height: 24px;
}

.circle {
    fill: rgba(24, 30, 37, 1);
}
</style>
