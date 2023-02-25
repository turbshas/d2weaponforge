<script setup lang="ts">

const props = defineProps<{
    active: boolean,
    icon: string,
    label: string,
    iconLabel: string,
    language?: boolean,
}>();

const emits = defineEmits<{
    (e: "toggled"): void,
}>();

function onClicked() {
    emits("toggled");
}
</script>

<template>
    <button class="button" :class="{ 'active': props.active }" @click="onClicked" :aria-label="props.label">
        <img :class="{ 'language': props.language }" :src="props.icon" :alt="props.iconLabel">
    </button>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.button {
    cursor: pointer;
    padding: 0.5rem;
    border: none;
    background-color: transparent;

    transition: background-color 0.4s var(--easingCubic);

    &.active {
        background-color: #518dba;
    }

    @media @large-screen {
        padding: 1rem;
    }
}

.language {
    height: 1.3125rem;
    vertical-align: middle;
    box-shadow: 0 0 1px 1px hsla(0, 0%, 100%, 0.25);
}
</style>
