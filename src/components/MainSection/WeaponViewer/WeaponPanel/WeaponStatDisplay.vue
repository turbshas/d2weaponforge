<script setup lang="ts">
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemStatDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
    definition: DestinyStatDefinition | undefined,
    value: DestinyInventoryItemStatDefinition,
}>();

const name = computed(() => {
    return props.definition && props.definition.displayProperties.name;
})
</script>

<template>
    <div>
        {{ name }}
        {{ value.value }}
    </div>
</template>

<style scoped>
</style>
