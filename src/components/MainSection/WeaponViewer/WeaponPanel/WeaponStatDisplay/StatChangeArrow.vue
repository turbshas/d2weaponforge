<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    down: boolean,
}>();

const label = computed(() => `${props.down ? "Down" : "Up"} Arrow`);
</script>

<template>
    <svg
        class="stat-arrow"
        :class="{ 'down': props.down, }"
        viewBox="0 0 1.8 2"
        :aria-label="label"
    >
        <polygon points="0,2 0.9,0 1.8,2"></polygon>
    </svg>
</template>

<style scoped lang="less">
.stat-arrow {
    height: 9px;
    fill: var(--uiPositive_300);

    &.down {
        fill: var(--uiNegative_300);
        transform: scaleY(-1);
    }
}
</style>
