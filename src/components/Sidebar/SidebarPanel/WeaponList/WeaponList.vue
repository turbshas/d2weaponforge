<script setup lang="ts">
import type { IWeapon } from '@/data/interfaces';
import WeaponListEntry from './WeaponListEntry.vue';

const props = defineProps<{
    weapons: IWeapon[],
}>();

const emit = defineEmits<{
    (e: "entryClicked", weapon: IWeapon): void,
}>();

function onEntryClicked(weapon: IWeapon) {
    emit("entryClicked", weapon);
}
</script>

<template>
    <div class="list">
        <WeaponListEntry
            v-for="weapon of props.weapons"
            :key="weapon.weapon.hash"
            :weapon="weapon"
            @entry-clicked="onEntryClicked"
        ></WeaponListEntry>
    </div>
</template>

<style scoped>
.list {
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}
</style>
