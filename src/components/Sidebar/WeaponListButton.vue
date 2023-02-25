<script setup lang="ts">
import WeaponListIcon from "@/assets/weapon_list_icon.svg";
import { computed } from 'vue';

const props = defineProps<{
    active: boolean,
}>();

const emits = defineEmits<{
    (e: "weaponListToggled"): void,
}>();

function onClicked() {
    emits("weaponListToggled");
}

const weaponListButtonLabel = "Open Weapon List";
const weaponListButtonImageLabel = computed(() => "Weapon List Icon");
</script>

<template>
    <button class="button" :class="{ 'active': props.active }" @click="onClicked" :aria-label="weaponListButtonLabel">
        <img class="flag" :src="WeaponListIcon" :alt="weaponListButtonImageLabel">
    </button>
</template>

<style scoped lang="less">
.button {
    cursor: pointer;

    padding: 16px;
    border: none;

    background: transparent;

    transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);

    &.active {
        background-color: #518dba;
    }
}
</style>
