<script setup lang="ts">
import type { ItemHash } from '@/data/interfaces';

const props = defineProps<{
    hash: ItemHash,
    name: string,
    description: string,
}>();

</script>

<template>
    <div class="insight">
        <dt class="info">
            <h4 class="no-margin">{{ props.name }}</h4>
            <span class="hash" aria-label="Hash ID">&lt;{{ props.hash }}&gt;</span>
        </dt>
        <dd class="no-margin">
            <pre class="no-margin description" aria-label="Effect">{{ props.description }}</pre>
        </dd>
    </div>
</template>

<style scoped lang="less">
.insight {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info {
    display: flex;
    gap: 1rem;
}

.no-margin {
    margin: 0;
}

.description {
    white-space: pre-wrap;
}
</style>
