<script setup lang="ts">
import { ref } from 'vue';
import ElementLabel from "@/components/Common/ElementLabel.vue";

const emits = defineEmits<{
    (e: "searchChanged", searchString: string): void,
}>();

const searchString = ref("");

function onSearchChanged() {
    emits("searchChanged", searchString.value);
}

const searchBarLabel = "Weapon name searchbar";
</script>

<template>
    <ElementLabel class="wrapper" :text="searchBarLabel">
        <input class="search" type="search" placeholder="Search..." v-model="searchString" @input="onSearchChanged">
    </ElementLabel>
</template>

<style scoped>
.wrapper {
    display: flex;
}

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
