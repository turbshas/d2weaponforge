<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits<{
    (e: "searchChanged", searchString: string): void,
}>();

const searchString = ref("");

function onSearchChanged() {
    emits("searchChanged", searchString.value);
}
</script>

<template>
    <input type="text" placeholder="Search..." v-model="searchString" @input="onSearchChanged">
</template>

<style scoped>
</style>
