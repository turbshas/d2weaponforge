<script setup lang="ts">
import { destinyDataService } from '@/data/destinyDataService';
import { StatDisplayType } from '@/data/enums';
import { computed } from '@vue/reactivity';
import type { DestinyInventoryItemStatDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';

const statDisplayTypeMap: { [statName: string]: StatDisplayType } = {
    "Recoil Direction": StatDisplayType.Angle,
    "Rounds Per Minute": StatDisplayType.Number,
    "Draw Time": StatDisplayType.Number,
    "Charge Time": StatDisplayType.Number,
    "Magazine": StatDisplayType.Number,
};

const props = defineProps<{
    definition: DestinyStatDefinition | undefined,
    value: DestinyInventoryItemStatDefinition,
    modifier: number,
}>();

const name = computed(() => {
    return props.definition && props.definition.displayProperties.name;
});

const total = computed(() => props.value.value + props.modifier);
const modifierSign = computed(() => props.modifier > 0 ? "+" : "");
const modifierMagnitude = computed(() => Math.abs(props.modifier));
const changeColor = computed(() => {
    if (props.modifier > 0) return "green";
    else if (props.modifier < 0) return "red";
    else return "black";
});
const filledWidthPercent = computed(() => props.modifier > 0 ? props.value.value : total.value);

const statDisplayType = computed(() => {
    if (!name.value) return StatDisplayType.Bar;
    return statDisplayTypeMap[name.value] ? statDisplayTypeMap[name.value] : StatDisplayType.Bar;
});
</script>

<template>
    <div class="stat">
        <span class="name">{{ name }}</span>
        <div class="display">
            <div class="bar" v-if="statDisplayType === StatDisplayType.Bar">
                <div class="value">
                    <span class="current" :style="{ color: changeColor }">{{ total }}</span>
                    <span class="modifier" :style="{ color: changeColor }" v-if="modifier !== 0">({{ modifierSign + modifier }})</span>
                </div>
                <div class="filled" :style="{ 'width': filledWidthPercent + '%' }"></div>
                <div
                    class="change"
                    :style="{ 'width': modifierMagnitude + '%', 'background-color': changeColor }"
                    v-if="modifier !== 0"
                ></div>
            </div>
            <div class="angle" v-if="statDisplayType === StatDisplayType.Angle">
                <span>{{ total }}</span>
                <div class="test"></div>
                <svg data-v-0fed067a="" id="recoil-dir" height="12" viewBox="0 0 2 1">
                    <circle data-v-0fed067a="" r="1" cx="1" cy="1" fill="rgba(24, 30, 37, 1)"></circle>
                    <path
                        data-v-0fed067a=""
                        d="M1,1 L0.21754178444699113,0.377296907897832 A1,1 0 0,1 1.0752188741922206,0.0028329523268155743 Z"
                        fill="#fafafa"
                    ></path>
                </svg>
            </div>
            <div class="number" v-if="statDisplayType === StatDisplayType.Number">
                {{ total }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.test {
    width: 40px;
    height: 40px;
    background-image: conic-gradient(orange 64%, transparent);
    border-radius: 50%
}

.stat {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.name {
    width: 30%;
    text-align: right;
}

.display {
    width: 70%;
    display: flex;
}

.bar {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 70%;
    background-color: grey;
}

.value {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: row;
    z-index: 10;
}

.current {
    color: black;
}

.modifier {
    color: black;
}

.filled {
    background-color: white;
}

.change {
    background-color: blue;
}
</style>
