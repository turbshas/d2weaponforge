<script setup lang="ts">
import type { IWeapon } from '@/data/interfaces';
import { computed } from 'vue';
import WeaponListEntry from './WeaponListEntry.vue';

const props = defineProps<{
    weapons: IWeapon[],
    limitWeapons: boolean,
}>();

const emit = defineEmits<{
    (e: "entryClicked", weapon: IWeapon): void,
    (e: "showAllWeapons"): void,
}>();

const limitedWeapons = computed(() => {
    const weapons = props.weapons;
    return props.limitWeapons && weapons.length > 100 ? weapons.slice(0, 100) : weapons;
});

const showLimitedResultsText = computed(() => props.limitWeapons && props.weapons.length > 100);

function onEntryClicked(weapon: IWeapon) {
    emit("entryClicked", weapon);
}

function onShowAllClick() {
    emit("showAllWeapons");
}
</script>

<template>
    <nav class="list" aria-label="Weapon List">
        <WeaponListEntry
            v-for="weapon of limitedWeapons"
            :key="weapon.hash"
            :weapon="weapon"
            @entry-clicked="onEntryClicked"
        ></WeaponListEntry>
        <footer class="limited" v-if="showLimitedResultsText">
            <i class="text">Results are currently limited.</i>
            <button class="show" @click="onShowAllClick">
                <i>Show All</i>
            </button>
        </footer>
    </nav>
</template>

<style scoped lang="less">
.list {
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.results-limited-mixin() {
    color: #fafafa;
    font-size: 12px;
    font-weight: bold;
}

.limited {
    align-self: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    opacity: 0.7;
}

.text {
    .results-limited-mixin();
}

.show {
    cursor: pointer;
    border: none;
    box-shadow: none;
    background-color: transparent;

    text-decoration: underline;
    .results-limited-mixin();
}
</style>
