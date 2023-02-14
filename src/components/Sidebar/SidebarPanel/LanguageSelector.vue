<script setup lang="ts">
import type { ILanguageInfo } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';

const emits = defineEmits<{
    (e: "languageSelected", language: ILanguageInfo): void,
}>();

const languages = computed(() => DataSearchStrings.Languages);

function onLanguageSelected(languageInfo: ILanguageInfo) {
    emits("languageSelected", languageInfo);
}
</script>

<template>
    <div class="wrapper">
        <button class="button" v-for="language of languages"  @click="onLanguageSelected(language)">
            <img class="flag" :src="language.flagIcon" :alt="language.text">
            <span class="text">{{ language.text }}</span>
        </button>
    </div>
</template>

<style scoped lang="less">
.wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: center;
    padding: 16px;
}

.button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    padding: 8px;

    box-shadow: inset 0 0 0 1px #f5f5f5;
    border: none;
    background-color: hsla(0, 0%, 100%, 0.05);

    color: #fafafa;
    font-size: 10.4px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
}

/* Flags are 4:3 */
.flag {
    height: 32px;
    box-shadow: 0 0 1px 1px hsla(0, 0%, 100%, 0.25);
}

.text {
    color: #fafafa;
}
</style>
