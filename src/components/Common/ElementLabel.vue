<script setup lang="ts">

const props = defineProps<{
    forId?: string,
    text: string,
}>();

</script>

<template>
    <label :for="props.forId">
        <span class="text">{{ props.text }}</span>
        <!-- Either the slot or the ID can be used -->
        <slot></slot>
    </label>
</template>

<style scoped>
.text {
    display: block;
    width: 0;
    height: 0;
    color: transparent;
    background-color: transparent;
}
</style>
