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
    <input class="search" type="text" placeholder="Search..." v-model="searchString" @input="onSearchChanged">
</template>

<style scoped>
.search {
    flex: 1;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    border: none;
    background-color: transparent;

    color: #fafafa;
    font-size: 16px;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
    line-height: 16px;
}
.search::placeholder {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    font-family: neue-haas-grotesk-text, "Helvetica Neue", sans-serif;
}
</style>
