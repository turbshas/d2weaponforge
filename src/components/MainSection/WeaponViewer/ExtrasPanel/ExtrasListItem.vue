<script setup lang="ts">
const props = defineProps<{
    label: string,
    iconUrl?: string,
}>();
</script>

<template>
    <div class="item">
        <div class="label">
            <img class="image" v-if="!!props.iconUrl" :src="props.iconUrl">
            <span>{{ props.label }}</span>
        </div>
        <slot></slot>
    </div>
</template>

<style scoped>
.item {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 0.55fr 0.45fr;
    flex-direction: row;
    padding-top: 4px;
    padding-bottom: 4px;

    border-left-width: 0;
    border-left-style: solid;
    border-left-color: #fafafa;

    transition:
        padding-left 0.2s cubic-bezier(0.19, 1, 0.22, 1),
        background-color 0.2s cubic-bezier(0.19, 1, 0.22, 1)
    ;
}
.item:hover {
    border-left-width: 1px;
    padding-left: 8px;
    background-color: rgba(0, 0, 0, 0.15);
}

.label {
    margin-right: auto;

    color: #fafafafa;
    font-size: 10.4px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
}

.image {
    width: 14px;
    height: 14px;
    margin-right: 6px;
}
</style>
