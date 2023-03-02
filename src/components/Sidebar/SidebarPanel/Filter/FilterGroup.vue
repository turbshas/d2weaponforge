<script setup lang="ts">
import OptionButton from "@/components/Common/OptionButton.vue";
import type { IFilterButton, LookupMap } from "@/data/interfaces";

const props = defineProps<{
    selectedFilters: LookupMap<string, IFilterButton>,
    filters: IFilterButton[],
    wide?: boolean,
}>();

const emits = defineEmits<{
    (e: "filterToggled", filter: IFilterButton, active: boolean): void,
}>();

function onFilterButtonToggled(filter: IFilterButton, active: boolean) {
    emits("filterToggled", filter, active);
}

function isFilterActive(filter: IFilterButton) {
    return !!props.selectedFilters[filter.text];
}
</script>

<template>
    <div class="button-list">
        <OptionButton
            v-for="filter of props.filters"
            :key="filter.text"
            :text="filter.text"
            :active="isFilterActive(filter)"
            :icon-url="filter.iconUrl"
            :wide="!!props.wide"
            large
            @toggled="active => onFilterButtonToggled(filter, active)"
        ></OptionButton>
    </div>
</template>

<style scoped lang="less">
.button-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
}
</style>
