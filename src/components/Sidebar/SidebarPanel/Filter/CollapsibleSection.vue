<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    name: string,
}>();

const isExpanded = ref(true);

function onHeaderClicked() {
    isExpanded.value = !isExpanded.value;
}
</script>

<template>
    <div class="section" :aria-expanded="isExpanded">
        <button
            class="header"
            :class="{ 'expanded': isExpanded, }"
            @click="onHeaderClicked"
        >{{ props.name }}</button>
        <slot v-if="isExpanded"></slot>
    </div>
</template>

<style scoped>
.section {
    display: flex;
    flex-direction: column;
}

.header {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    padding-bottom: 8px;

    color: var(--color-text);
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    opacity: 0.75;
    background-color: transparent;
    border: none;

    transition: color 0.4s ease;
}
.header:hover {
    color: #b78c25;
}
.header::before {
    content: "";
    width: 0;
    height: 0;
    margin-right: 8px;

    border-top: 5.6px solid transparent;
    border-bottom: 5.6px solid transparent;
    border-left: 5.6px solid #fafafa;

    transition: transform 0.4s ease;
}
.header.expanded::before {
    transform: rotate(90deg);
}
.header::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: #fafafa;
    opacity: 0.75
}
</style>
