<script setup lang="ts">
const props = defineProps<{
    text: string,
    active: boolean,
    iconUrl?: string,
    wide?: boolean,
}>();

const emits = defineEmits<{
    (e: "toggled", active: boolean): void,
}>();

function onButtonToggled() {
    emits("toggled", !props.active);
}
</script>

<template>
    <button class="button" :class="{ 'active': props.active }" @click="onButtonToggled">
        <img class="icon" :class="{ 'wide': props.wide }" v-if="!!props.iconUrl" :src="props.iconUrl">
        <span>{{ props.text }}</span>
    </button>
</template>

<style scoped>
.button {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    cursor: pointer;

    padding-top: 5.6px;
    padding-bottom: 5.6px;
    padding-left: 8px;
    padding-right: 8px;

    box-shadow: inset 0 0 0 1px #f5f5f5;
    border: none;
    background-color: hsla(0, 0%, 100%, 0.05);
    transition: background-color 0.5s cubic-bezier(0.19, 1, 0.22, 1);

    color: #fafafa;
    font-size: 10.4px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
}
.button::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    pointer-events: none;
    width: calc(100% + 4px);
    height: calc(100% + 4px);

    box-shadow: 0 0 0 2px #f5f5f5;
    opacity: 0;
    transform: scale(1.1);
    transition:
        opacity 0.2s ease 0s,
        transform 0.3s ease 0s
    ;
}
.button:hover::after, .button:focus::after {
    opacity: 0.8;
    transform: scale(1);
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

