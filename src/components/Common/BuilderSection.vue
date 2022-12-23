<script setup lang="ts">
const props = defineProps<{
    title: string,
}>();
</script>

<template>
    <div class="section">
        <h2 class="title">{{ props.title }}</h2>
        <slot></slot>
    </div>
</template>

<style scoped>
.section {
    display: flex;
    flex-direction: column;
    margin-bottom: auto;
    padding: 16px;
    box-shadow: 0 0 40px 0 rgba(0,0,0,.5);
    background-color: #12171c;
}

.title {
    flex-grow: 0;

    position: relative;
    opacity: 0.75;
    margin-bottom: 16px;
    padding-bottom: 8px;

    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
}
.title::before {
    content: "";
    position: absolute;
    display: block;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: #fafafa;
    opacity: 0.75;
}
</style>
