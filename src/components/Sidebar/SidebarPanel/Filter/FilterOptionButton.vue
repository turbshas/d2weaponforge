<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    text: string,
    iconUrl?: string,
    wide?: boolean,
}>();

const emits = defineEmits<{
    (e: "toggled", active: boolean): void,
}>();

const filterOn = ref(false);

function onFilterToggled() {
    filterOn.value = !filterOn.value;
    emits("toggled", filterOn.value);
}
</script>

<template>
    <button class="button" :class="{ 'active': filterOn }" @click="onFilterToggled">
        <img class="icon" :class="{ 'wide': wide }" v-if="!!iconUrl" :src="iconUrl">
        <span>{{ text }}</span>
    </button>
</template>

<style scoped>
.button {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: hsla(0, 0%, 100%, 0.05);
    color: #fafafa;
}

.active {
    background-color: #b78c25;
}

.icon {
    display: block;
    max-width: 18px;
    max-height: 18px;
    color: white;
}

.wide {
    max-width: 38px;
}
</style>

