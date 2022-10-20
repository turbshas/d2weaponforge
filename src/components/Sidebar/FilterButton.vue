<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits<{
    (e: "filterToggled"): void
}>();

const x = ref("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAKPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC44MzMzMzMzMzMzMzMzMzM0LDAsMCwwLjgzMzMzMzMzMzMzMzMzMzQsMCwwKSI+PHBhdGggZD0iTTIzLjg5LjU1QTEsMSwwLDAsMCwyMywwSDFBMSwxLDAsMCwwLC4xMS41NSwxLDEsMCwwLDAsLjIsMS42TDksMTMuNDJWMjJhMiwyLDAsMCwwLDIsMiwyLDIsMCwwLDAsMS4yLS40bDItMS41YTIsMiwwLDAsMCwuOC0xLjZWMTMuNDJMMjMuOCwxLjZBMSwxLDAsMCwwLDIzLjg5LjU1Wk01LjQyLDIuMiw5LjM2LDcuNDVhLjU0LjU0LDAsMCwxLC4xLjNWOWEuNDkuNDksMCwwLDEtLjM0LjQ3LjQ4LjQ4LDAsMCwxLS41Ni0uMTdMMy42MiwyLjhhLjQ5LjQ5LDAsMCwxLS4wNS0uNTJBLjUuNSwwLDAsMSw0LDJINUEuNTQuNTQsMCwwLDEsNS40MiwyLjJaIiBzdHlsZT0iZmlsbDogI2ZhZmFmYSI+PC9wYXRoPjwvZz48L3N2Zz4=");

function onButtonClicked() {
    emits("filterToggled");
}
</script>

<template>
    <button @click="onButtonClicked">Filter<img :src="x"></button>
</template>

<style scoped>
</style>
