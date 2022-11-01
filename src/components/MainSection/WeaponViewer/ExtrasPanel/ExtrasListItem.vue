<script setup lang="ts">
const props = defineProps<{
    label: string,
}>();
</script>

<template>
    <div class="item">
        <span class="label">{{ label }}</span>
        <slot class="slot"></slot>
    </div>
</template>

<style scoped>
.item {
    display: flex;
    flex-direction: row;
}

.label {
    margin-right: auto;
}

.slot {
    width: 50%;
}
</style>
