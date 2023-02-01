<script setup lang="ts">
import type { ILanguageInfo } from '@/data/types';
import { computed } from 'vue';

const props = defineProps<{
    active: boolean,
    selectedLanguage: ILanguageInfo,
}>();

const emits = defineEmits<{
    (e: "languagesToggled"): void,
}>();

function onFlagClicked() {
    emits("languagesToggled");
}

const languageButtonLabel = "Open Languages Pane";
const languageButtonImageLabel = computed(() => `Language Image: ${props.selectedLanguage.language}`);
</script>

<template>
    <button class="button" :class="{ 'active': props.active }" @click="onFlagClicked" :aria-label="languageButtonLabel">
        <img class="flag" :src="props.selectedLanguage.flagIcon" :alt="languageButtonImageLabel">
    </button>
</template>

<style scoped lang="less">
.button {
    cursor: pointer;

    display: flex;
    align-items: center;
    padding: 16px;
    border: none;

    background: transparent;
    transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);

    &.active {
        background-color: #518dba;
    }
}

/* Flags are 4:3 */
.flag {
    height: 21px;
}
</style>
