<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    statValue: number,
}>();

const recoilDirectionPieLabel = "Recoil Direction Angle Graphic";

const svgPathData = computed(() => {
    const recoilDirection = props.statValue;
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
</script>

<template>
    <svg
        class="pie"
        height="12"
        viewBox="0 0 2 1"
        :aria-label="recoilDirectionPieLabel"
    >
        <circle class="circle" r="1" cx="1" cy="1"></circle>
        <path
            class="path"
            v-if="props.statValue <= 96"
            :d="svgPathData"
        ></path>
        <line
            v-if="props.statValue > 96"
            x1="1" y1="2"
            x2="1" y2="0"
            stroke="white"
            stroke-width="0.1"
        ></line>
    </svg>
</template>

<style scoped lang="less">
.pie {
    width: 1.5rem;
    height: 0.75rem;
    margin-left: 0.625rem;
    align-self: center;
    fill: var(--white);
}
.circle {
    fill: rgba(24, 30, 37, 1);
}
</style>
