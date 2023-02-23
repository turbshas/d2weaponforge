<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    name: string,
    collapsed: boolean,
    icon?: string,
}>();

const emit = defineEmits<{
    (e: "toggled"): void,
}>();

const iconAlt = computed(() => `${props.name} Icon`);

function onHeaderClicked() {
    emit("toggled");
}
</script>

<template>
    <section class="section" :aria-label="props.name" :aria-expanded="!props.collapsed">
        <button
            class="header toggle"
            :class="{ 'expanded': !props.collapsed, }"
            @click="onHeaderClicked"
        >
            <img class="icon" v-if="!!props.icon" :src="props.icon" :alt="iconAlt">
            <h3 class="text">{{ props.name }}</h3>   
        </button>
        <div class="slot" :class="{ 'hide': props.collapsed, }">
            <slot></slot>
        </div>
    </section>
</template>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
}

.header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    padding-top: 0;
    padding-bottom: 8px;
    padding-left: 0;
    padding-right: 0;

    opacity: 0.75;

    &::before {
        content: "";
        width: 0;
        height: 0;
        margin-right: 8px;

        border-top: 5.6px solid transparent;
        border-bottom: 5.6px solid transparent;
        border-left: 5.6px solid #fafafa;

        transition: transform 0.4s ease;
    }
    &.expanded {
        &::before {
            transform: rotate(90deg);
        }
    }
    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        width: 100%;
        background-color: #fafafa;
        opacity: 0.75
    }
}

.toggle {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--color-text);
    text-transform: uppercase;

    transition: color 0.4s ease;

    &:hover {
        color: #b78c25;
    }
}

.icon {
    width: 48px;
    margin-right: 16px;
}

.text {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
}

.slot {
    flex: 1;
    width: 100%;

    &.hide {
        opacity: 0;
        max-height: 0;
    }
}
</style>
