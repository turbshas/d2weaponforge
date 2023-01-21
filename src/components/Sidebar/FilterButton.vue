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
    border-top: none;
    border-left: none;
    border-bottom: none;

    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: hsla(0, 0%, 98%, 0.25);
    border-radius: 0;
    background: transparent;

    transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.active {
    background-color: #518dba;
}
</style>
