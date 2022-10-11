<script setup lang="ts">
import { PageSelection } from '@/data/enums';

const emit = defineEmits(["tab-selected"]);

const tabs = [PageSelection.Home, PageSelection.Glossary, PageSelection.Compare];

function onTabClick(tab: PageSelection) {
    emit("tab-selected", tab);
}
</script>

<template>
    <div class="tabs">
        <div
            v-for="tab of tabs"
            :key="tab"
            class="tab"
            @click="onTabClick(tab)"
        >{{ tab }}</div>
    </div>
</template>

<style scoped>
.tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.tab {
    cursor: pointer;
}
</style>
