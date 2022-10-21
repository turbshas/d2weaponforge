<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    name: string,
}>();

const isExpanded = ref(true);

function onHeaderClicked() {
    isExpanded.value = !isExpanded.value;
}
</script>

<template>
    <div class="section">
        <div class="header" @click="onHeaderClicked">
            <span>ARROW ICON HERE</span>
            <span>{{ name }}</span>
        </div>
        <slot v-if="isExpanded"></slot>
    </div>
</template>

<style scoped>
.section {
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    flex-direction: row;
}
</style>
