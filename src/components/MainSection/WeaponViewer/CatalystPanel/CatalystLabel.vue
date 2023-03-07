<script setup lang="ts">
const props = defineProps<{
    icon: string,
    title: string,
    descriptions: string[],
}>();
</script>

<template>
    <div class="catalyst-label">
        <img class="image" :src="props.icon">
        <div class="label-text">
            <h4 class="title">{{ props.title }}</h4>
            <span
                class="description"
                v-for="(desc, index) of props.descriptions"
                :key="index"
            >{{ desc }}</span>
        </div>
    </div>
</template>

<style scoped lang="less">
.catalyst-label {
    display: flex;
    align-items: center;
    gap: 1rem;

    .image {
        flex: 0 0 3rem;
        width: 3rem;
        height: 3rem;
    }

    .label-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .title {
        margin: 0;
        letter-spacing: 1px;
        line-height: 1rem;

        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        text-decoration: none;
    }

    .description {
        color: var(--grey);
        letter-spacing: 0;
        line-height: 1rem;

        font-family: var(--fontText);
        font-size: 0.8rem;
        font-weight: 300;
        text-decoration: none;
    }
}
</style>
