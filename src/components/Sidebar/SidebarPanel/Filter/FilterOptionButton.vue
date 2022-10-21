<script setup lang="ts">

const props = defineProps<{
    text: string,
    iconUrl: string,
    wide?: boolean,
}>();
</script>

<template>
    <button>
        <img class="icon" :class="{ 'wide': wide }" :src="iconUrl">
        <span>{{ text }}</span>
    </button>
</template>

<style scoped>
.icon {
    display: block;
    width: 18px;
    height: 18px;
    color: white;
}

.wide {
    width: 36px;
}
</style>

