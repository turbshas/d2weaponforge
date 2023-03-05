<script setup lang="ts">
import type { IInsightDisplay } from '@/data/interfaces';
import GlossaryDefinition from './GlossaryDefinition.vue';

const props = defineProps<{
    insights: IInsightDisplay[],
}>();

</script>

<template>
    <dl class="group">
        <GlossaryDefinition
            class="insight"
            v-for="insight of props.insights"
            :key="insight.hash"
            :hash="insight.hash"
            :name="insight.name"
            :description="insight.description"
        ></GlossaryDefinition>
    </dl>
</template>

<style scoped lang="less">
.group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    list-style-type: none;
    padding: 0;
}

.insight {
    width: 350px;
}
</style>
