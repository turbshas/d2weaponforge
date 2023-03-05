<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    label: string,
    iconUrl?: string,
    iconAltText?: string,
}>();

const altText = computed(() => props.iconAltText || "");
</script>

<template>
    <li class="item">
        <h5 class="label">
            <img class="image" v-if="!!props.iconUrl" :src="props.iconUrl" :alt="altText">
            <span>{{ props.label }}</span>
        </h5>
        <slot></slot>
    </li>
</template>

<style scoped lang="less">
.item {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 0.55fr 0.45fr;
    flex-direction: row;

    border-left-width: 0;
    border-left-style: solid;
    border-left-color: #fafafa;

    transition:
        padding-left 0.2s var(--easingCubic),
        background-color 0.2s var(--easingCubic)
    ;

    &:hover {
        border-left-width: 1px;
        padding-left: 0.5rem;
        background-color: rgba(0, 0, 0, 0.15);
    }
}

.label {
    display: flex;
    align-items: center;

    margin-top: 0;
    margin-bottom: 0;
    margin-right: auto;

    color: var(--color-text);
    font-size: 0.65rem;
    font-weight: 500;
    line-height: 1rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
}

.image {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.375rem;
    margin-bottom: 0.125rem;
}
</style>
