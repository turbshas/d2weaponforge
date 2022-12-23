<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

</script>

<template>
    <ExtrasListItem label="Comparisons">
        <OptionButton text="Add to Comparisons" :active="false"></OptionButton>
    </ExtrasListItem>
</template>

<style scoped>
</style>
