<script setup lang="ts">
const props = defineProps<{
    text: string,
}>();
</script>

<template>
    <code class="item">
        <pre class="text">{{ props.text }}</pre>
    </code>
</template>

<style scoped lang="less">
.item {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;

    background-color: rgba(0, 0, 0, 0.05);
    border-width: 1px;
    border-radius: 3px;
    border-style: solid;
    border-color: var(--white);
}

.text {
    margin: 0;
    font-family: monospace;
    font-size: 0.8rem;
    white-space: pre;
}
</style>
