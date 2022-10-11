<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';

const props = defineProps<{
    weapon: DestinyInventoryItemDefinition | null
}>();
</script>

<template>
    <div>
        Weapon
        {{ weapon?.displayProperties?.name }}
    </div>
</template>

<style scoped>
</style>
