<script setup lang="ts">
import { DataSearchString, StatDisplayType } from '@/data/types';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemStatDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';

const statDisplayTypeMap: { [statName: string]: StatDisplayType } = {
    [DataSearchString.RecoilDirectionStatName]: StatDisplayType.Angle,
    [DataSearchString.RpmStatName]: StatDisplayType.Number,
    [DataSearchString.DrawTimeStatName]: StatDisplayType.Number,
    [DataSearchString.ChargeTimeStatName]: StatDisplayType.Number,
    [DataSearchString.MagSizeStatName]: StatDisplayType.Number,
};

const props = defineProps<{
    definition: DestinyStatDefinition | undefined,
    value: DestinyInventoryItemStatDefinition,
    modifier: number,
}>();

const name = computed(() => {
    return props.definition && props.definition.displayProperties.name;
});
const recoilDirectionPieLabel = "Recoil Direction Angle Graphic";

const adjustedModifier = computed(() => {
    if (!props.definition) return props.modifier;
    if (props.definition.displayProperties.name === DataSearchString.ChargeTimeStatName) return -Math.round(props.modifier * 3.3);
    if (props.definition.displayProperties.name === DataSearchString.DrawTimeStatName) return -props.modifier * 4;
    return props.modifier;
});

const total = computed(() => {
    console.log("stat info:", props.definition, props.value, adjustedModifier.value);
    const value = props.value.value + adjustedModifier.value;
    // These values don't exist in the range 0-100 so don't need to be clamped.
    if (statDisplayType.value === StatDisplayType.Number) return value;
    return value < 0 ? 0 : (value > 100 ? 100 : value);
});
const modifierSign = computed(() => props.modifier > 0 ? "+" : "");
const modifierMagnitude = computed(() => Math.abs(props.modifier));
const filledWidthPercent = computed(() => props.modifier > 0 ? props.value.value : total.value);

const statDisplayType = computed(() => {
    if (!name.value) return StatDisplayType.Bar;
    return statDisplayTypeMap[name.value] ? statDisplayTypeMap[name.value] : StatDisplayType.Bar;
});
const isBarDisplayType = computed(() => statDisplayType.value === StatDisplayType.Bar);
const isAngleDisplayType = computed(() => statDisplayType.value === StatDisplayType.Angle);

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
            <div class="bar" v-if="isBarDisplayType">
                <div class="value" :class="{ 'positive': props.modifier > 0, 'negative': props.modifier < 0, }">
                    <span>{{ total }}</span>
                    <span class="modifier">({{ modifierSign + modifier }})</span>
                </div>
                <div class="filled" :style="{ 'width': filledWidthPercent + '%' }"></div>
                <div
                    class="change"
                    :class="{ 'positive': props.modifier > 0, 'negative': props.modifier < 0, }"
                    :style="{ 'width': modifierMagnitude + '%', }"
                    v-if="modifier !== 0"
                ></div>
            </div>

            <div class="number" v-else>
                <span class="text" :class="{ 'positive': props.modifier > 0, 'negative': props.modifier < 0, }">{{ total }}</span>
                <div class="arrow" :class="{ 'positive': props.modifier > 0, 'negative': props.modifier < 0, }"></div>

                <svg
                    class="pie"
                    height="12"
                    viewBox="0 0 2 1"
                    v-if="isAngleDisplayType"
                    :aria-label="recoilDirectionPieLabel"
                >
                    <circle class="circle" r="1" cx="1" cy="1"></circle>
                    <path
                        class="path"
                        v-if="total <= 96"
                        :d="getSvgPathData(total)"
                    ></path>
                    <line
                        v-if="total > 96"
                        x1="1" y1="2"
                        x2="1" y2="0"
                        stroke="white"
                        stroke-width="0.1"
                    ></line>
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stat {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 20px;
}

.name {
    width: 30%;
    margin-right: 8px;
    
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    color: #fafafa;
    text-shadow: 0 3px 5px #0a0a0a;
    text-align: right;
    align-self: center;
}

.display {
    width: 70%;
    display: flex;
}

/* bar display styles */
.bar {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: hsla(0, 0%, 98%, 0.2);
}
.bar .value {
    position: absolute;
    top: 0;
    left: 4px;
    z-index: 10;
    height: 100%;
    line-height: 100%;
    font-size: 12px;
    font-weight: 500;
    color: #05070a;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.bar .value.positive {
    color: #33613a;
}
.bar .value.negative {
    color: #732522;
}
.bar .value.positive, .bar .value.negative {
    font-weight: 600;
}
.bar .modifier {
    margin-left: 4px;
    font-weight: 500;
}
.bar .filled {
    background-color: #fafafa;
}
.bar .change.positive {
    background-color: #5aa366;
}
.bar .change.negative {
    background-color: #973835;
}

/* Recoil direction styles */
.number {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.number .text {
    font-size: 16px;
    color: #fafafa;
    text-shadow: 0 3px 5px #0a0a0a;
    align-self: center;
}
.number .positive {
    color: #68cc79;
}
.number .negative {
    color: #e25954;
}
.number .pie {
    width: 24px;
    height: 12px;
    margin-left: 10px;
    align-self: center;
    fill: #fafafa;
}
.number .circle {
    fill: rgba(24, 30, 37, 1);
}

.arrow {
    margin-left: 6px;
    align-self: center;

    border-left-width: 4.8px;
    border-right-width: 4.8px;
    border-bottom-width: 9.6px;
    border-color: transparent;
    border-style: solid;
    display: none;
}
.arrow.positive, .arrow.negative {
    display: block;
}
.arrow.positive {
    border-bottom-color: #68cc79;
}
.arrow.negative {
    border-bottom-color: #e25954;
}
</style>
