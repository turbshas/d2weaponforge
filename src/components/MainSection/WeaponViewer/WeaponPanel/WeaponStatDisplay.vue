<script setup lang="ts">
import { DataSearchStrings } from '@/data/dataSearchStringService';
import { StatDisplayType, type IStatInfo } from '@/data/interfaces';
import { computed } from '@vue/reactivity';

const props = defineProps<{
    statInfo: IStatInfo,
    modifier: number,
}>();

const recoilDirectionPieLabel = "Recoil Direction Angle Graphic";
const name = computed(() => props.statInfo.statName);
const showStat = computed(() => !!props.statInfo.statDisplay);

const statTotal = computed(() => {
    const value = props.statInfo.investmentValue + props.modifier;
    // The min is always 0.
    const max = props.statInfo.statDisplay ? props.statInfo.statDisplay.maximumValue : 100;
    if (value < 0) return 0;
    if (value > max) return max;
    return value;
});

const baseDisplayValue = computed(() => convertToDisplayValue(props.statInfo.investmentValue));
const displayedTotal = computed(() => convertToDisplayValue(statTotal.value));

const displayModifier = computed(() => displayedTotal.value - baseDisplayValue.value);
const displayModifierMagnitude = computed(() => Math.abs(displayModifier.value));
const modifierSign = computed(() => displayModifier.value > 0 ? "+" : "");
const modifierText = computed(() => `${modifierSign.value}${displayModifier.value}`);
const filledWidthPercent = computed(() => props.modifier > 0 ? baseDisplayValue.value : displayedTotal.value);

const statDisplayType = computed(() => {
    if (!name.value || !props.statInfo.statDisplay) return StatDisplayType.Bar;
    if (!props.statInfo.statDisplay.displayAsNumeric) return StatDisplayType.Bar;
    return name.value === DataSearchStrings.Stats.RecoilDirection.value ? StatDisplayType.Angle : StatDisplayType.Number;
});
const isBarDisplayType = computed(() => statDisplayType.value === StatDisplayType.Bar);
const isAngleDisplayType = computed(() => statDisplayType.value === StatDisplayType.Angle);

function convertToDisplayValue(statValue: number) {
    if (!props.statInfo.statDisplay) return statValue;
    const displayInterpolation = props.statInfo.statDisplay.displayInterpolation;

    // Check if values has an exact match.
    const existing = displayInterpolation.find(d => d.value === statValue);
    if (existing) return existing.weight;

    // Else, we need to interpolate.
    // The ranges are *mostly* linear. Sometimes archetypes each get their own subdivision in the range, and each subdivision is linear.
    const start = displayInterpolation.slice().reverse().find(d => d.value < statValue);
    const end = displayInterpolation.find(d => d.value > statValue);
    if (!start || !end) return statValue;

    const stepSize = end.value - start.value;
    const rangeSize = end.weight - start.weight;
    const valueWithinStep = statValue - start.value;
    const offset = Math.ceil(rangeSize * (valueWithinStep / stepSize));
    const value = offset + start.weight;
    // For some stats, a higher value is a lower weight (like charge time).
    const upperBound = Math.max(start.weight, end.weight);
    const lowerBound = Math.min(start.weight, end.weight);
    if (value < lowerBound) return lowerBound;
    if (value > upperBound) return upperBound;
    return value;
}

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
    <div class="stat" v-if="showStat">
        <span class="name">{{ name }}</span>
        <div class="display">
            <div class="bar" v-if="isBarDisplayType">
                <div class="value" :class="{ 'positive': displayModifier > 0, 'negative': displayModifier < 0, }">
                    <span>{{ displayedTotal }}</span>
                    <span class="modifier">({{ modifierText }})</span>
                </div>
                <div class="filled" :style="{ 'width': filledWidthPercent + '%' }"></div>
                <div
                    class="change"
                    :class="{ 'positive': displayModifier > 0, 'negative': displayModifier < 0, }"
                    :style="{ 'width': displayModifierMagnitude + '%', }"
                    v-if="displayModifier !== 0"
                ></div>
            </div>

            <div class="number" v-else>
                <span class="text" :class="{ 'positive': displayModifier > 0, 'negative': displayModifier < 0, }">{{ displayedTotal }}</span>
                <div class="arrow" :class="{ 'positive': displayModifier > 0, 'negative': displayModifier < 0, }"></div>

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
                        v-if="displayedTotal <= 96"
                        :d="getSvgPathData(displayedTotal)"
                    ></path>
                    <line
                        v-if="displayedTotal > 96"
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

<style scoped lang="less">
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

    .value {
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

        &.positive, &.negative {
            font-weight: 600;
        }
        &.positive {
            color: #33613a;
        }
        &.negative {
            color: #732522;
        }
    }

    .modifier {
        margin-left: 4px;
        font-weight: 500;
    }
    .filled {
        background-color: #fafafa;
    }
    .change {
        &.positive {
            background-color: #5aa366;
        }
        &.negative {
            background-color: #973835;
        }
    }
}

/* Recoil direction styles */
.number {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .text {
        font-size: 16px;
        color: #fafafa;
        text-shadow: 0 3px 5px #0a0a0a;
        align-self: center;
    }
    .positive {
        color: #68cc79;
    }
    .negative {
        color: #e25954;
    }
    .pie {
        width: 24px;
        height: 12px;
        margin-left: 10px;
        align-self: center;
        fill: #fafafa;
    }
    .circle {
        fill: rgba(24, 30, 37, 1);
    }
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

    &.positive, &.negative {
        display: block;
    }
    &.positive {
        border-bottom-color: #68cc79;
    }
    &.negative {
        border-bottom-color: #e25954;
        transform: scaleY(-1);
    }
}
</style>
