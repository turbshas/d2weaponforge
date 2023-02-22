<script setup lang="ts">
import WeaponIcon from "@/components/Common/WeaponIcon.vue";
import type { IWeapon } from "@/data/interfaces";
import { computed } from 'vue';

const props = defineProps<{
    weapon: IWeapon,
}>();

const emit = defineEmits<{
    (e: "entryClicked", weapon: IWeapon): void,
}>();

const href = computed(() => props.weapon ? `/w/${props.weapon.hash}` : "");
const weaponName = computed(() => props.weapon.name);

function onEntryClicked(e: Event) {
    emit("entryClicked", props.weapon);
    e.preventDefault();
}
</script>

<template>
    <a class="entry" :href="href" @click="onEntryClicked">
        <span class="text">{{ weaponName }}</span>
        <WeaponIcon class="icon" :weapon="props.weapon"></WeaponIcon>
    </a>
</template>

<style scoped>
.entry {
    cursor: pointer;
    position: relative;
    display: flex;
    /*
    Items are placed backwards in the template, then flowed in row-reverse
    to make the weapon name appear first in the accessibility label.
    */
    flex-direction: row-reverse;

    background: hsla(0, 0%, 100%, 0.05);
    box-shadow: inset 0 0 0 1px #f5f5f5;

    color: #fafafa;
    letter-spacing: 0;
    line-height: 16px;
    font-size: 12.8px;
    font-weight: 500;
    text-transform: none;
    text-decoration: none;
}
.entry::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    box-shadow: 0 0 0 2px #f5f5f5;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    opacity: 0;
    transform: scale(1.1);
    transition:
        opacity .2s ease 0s,
        transform .3s ease 0s
    ;
}
.entry:hover::after {
    opacity: 0.8;
    transform: scale(1);
}

.icon {
    flex: 0;
    width: 42px;
    height: 42px;
    margin: 1px;
}

.text {
    flex: 1;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
}
</style>
