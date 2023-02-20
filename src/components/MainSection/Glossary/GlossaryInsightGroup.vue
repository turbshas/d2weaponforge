<script setup lang="ts">
import type { IInsightDisplay } from '@/data/interfaces';

const props = defineProps<{
    insights: IInsightDisplay[],
}>();

</script>

<template>
    <ul class="group">
        <li class="insight" v-for="insight of props.insights" :key="insight.hash">
            <div class="info">
                <h4 class="name">{{ insight.name }}</h4>
                <span class="hash">&lt;{{ insight.hash }}&gt;</span>
            </div>
            <pre class="description">{{ insight.description }}</pre>
        </li>
    </ul>
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
    display: flex;
    flex-direction: column;
    padding-bottom: 0.25rem;
}

.info {
    display: flex;
    gap: 1rem;
}

.name {
    margin: 0;
}

.description {
    margin: 0;
    white-space: pre-wrap;
}
</style>
