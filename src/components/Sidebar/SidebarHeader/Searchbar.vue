<script setup lang="ts">
import ElementLabel from "@/components/Common/ElementLabel.vue";
import { ref } from 'vue';

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

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.wrapper {
    display: flex;
}

.search {
    flex: 1;

    padding: 0.125rem 0.5rem;
    border: none;
    background-color: transparent;

    color: var(--color-text);
    font-size: 1rem;
    font-family: var(--fontText);

    &::placeholder {
        text-transform: uppercase;
        letter-spacing: 0.125rem;
        font-size: 0.75rem;
    }

    @media @large-screen {
        padding: 0.5rem 1rem;
    }
}
</style>
