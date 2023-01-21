<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    text: string,
    active: boolean,
    large?: boolean,
    iconUrl?: string,
    wide?: boolean,
}>();

const emits = defineEmits<{
    (e: "toggled", active: boolean): void,
}>();

const altText = computed(() => `Icon: ${props.text}`);

function onButtonToggled() {
    emits("toggled", !props.active);
}
</script>

<template>
    <button class="button" :class="{ 'active': props.active, 'large': props.large, }" @click="onButtonToggled">
        <img class="icon" :class="{ 'wide': props.wide }" v-if="!!props.iconUrl" :src="props.iconUrl" :alt="altText">
        <span class="text">{{ props.text }}</span>
    </button>
</template>

<style scoped lang="less">
.button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    padding-top: 5.6px;
    padding-bottom: 5.6px;
    padding-left: 8px;
    padding-right: 8px;

    box-shadow: inset 0 0 0 1px #f5f5f5;
    border: none;
    background-color: hsla(0, 0%, 100%, 0.05);
    transition: background-color 0.5s cubic-bezier(0.19, 1, 0.22, 1);

    color: #fafafa;
    font-size: 10.4px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;

    &.active {
        background-color: darken(#b78c25, 10%);
    }

    &.large {
        padding-left: 12px;
        padding-right: 12px;
    }

    &::after {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        pointer-events: none;
        width: calc(100% + 4px);
        height: calc(100% + 4px);

        box-shadow: 0 0 0 2px #f5f5f5;
        opacity: 0;
        transform: scale(1.1);
        transition:
            opacity 0.2s ease 0s,
            transform 0.3s ease 0s
        ;
    }
    &:hover::after, &:focus::after {
        opacity: 0.8;
        transform: scale(1);
    }
}

.icon {
    width: 38px;
    max-width: 18px;
    max-height: 18px;
    margin-right: 8px;
    color: white;

    &.wide {
        max-width: 38px;
    }
}

.text {
    white-space: nowrap;
}
</style>
