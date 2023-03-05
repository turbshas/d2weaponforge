<script setup lang="ts">
import OptionButton from "@/components/Common/OptionButton.vue";

const emits = defineEmits<{
    (e: "filtersCleared"): void,
    (e: "filtersApplied"): void,
}>();

function onClearFilters() {
    emits("filtersCleared");
}

function onApplyFilters() {
    emits("filtersApplied");
}
</script>

<template>
    <header class="header">
        <h2 class="title">Filters</h2>
        <div class="actions">
            <OptionButton text="Clear Filters" :active="false" @click="onClearFilters"></OptionButton>
            <OptionButton text="Apply Filters" :active="true" @click="onApplyFilters"></OptionButton>
        </div>
    </header>
</template>

<style scoped lang="less">
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.title {
    margin: 0;
    font-size: 19.2px;
    font-weight: 600;
    line-height: 19.2px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.actions {
    display: flex;
    flex-direction: row;
    gap: 8px;
}
</style>
