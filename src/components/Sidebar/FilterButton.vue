<script setup lang="ts">
import FilterIcon from '@/assets/filter_icon.svg';

const props = defineProps<{
    active: boolean,
}>();

const emits = defineEmits<{
    (e: "filterToggled"): void
}>();

function onButtonClicked() {
    emits("filterToggled");
}

const filterButtonLabel = "Open Filter Pane";
const filterButtonImageLabel = "Filter Icon";
</script>

<template>
    <button class="button" :class="{ 'active': props.active }" @click="onButtonClicked" :aria-label="filterButtonLabel">
        <img :src="FilterIcon" :alt="filterButtonImageLabel">
    </button>
</template>

<style scoped>
.button {
    cursor: pointer;

    padding: 16px;
    border: none;

    background: transparent;

    transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.active {
    background-color: #518dba;
}
</style>
