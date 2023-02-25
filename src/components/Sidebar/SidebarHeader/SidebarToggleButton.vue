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
.button {
    cursor: pointer;

    padding: 16px;
    border: none;

    background: transparent;

    transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);

    &.active {
        background-color: #518dba;
    }
}

.language {
    height: 21px;
    vertical-align: middle;
    box-shadow: 0 0 1px 1px hsla(0, 0%, 100%, 0.25);
}
</style>
