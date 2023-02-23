<script setup lang="ts">
import { PageSelection } from '@/data/interfaces';

const rootBasePath = import.meta.env.BASE_URL;

const emit = defineEmits<{
    (e: "tabSelected", tab: PageSelection): void,
}>();

const tabs = [PageSelection.Home, PageSelection.Glossary, PageSelection.Compare];

function hrefForTab(tab: PageSelection) {
    return `${rootBasePath}/${tab}`;
}

function onTabClick(e: Event, tab: PageSelection) {
    emit("tabSelected", tab);
    e.preventDefault();
}
</script>

<template>
    <div class="tabs">
        <a
            v-for="tab of tabs"
            :key="tab"
            class="tab"
            :href="hrefForTab(tab)"
            @click="e => onTabClick(e, tab)"
        >{{ tab }}</a>
    </div>
</template>

<style scoped>
.tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    padding-left: 16px;
    padding-right: 16px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: hsla(0, 0%, 98%, 0.25);
}

.tab {
    cursor: pointer;
    user-select: none;
    padding: 8px;

    color: #ffffff;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    white-space: nowrap;
}
</style>
