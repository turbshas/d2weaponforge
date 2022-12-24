<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import { computed } from 'vue';
import PerkDisplay from '../../../Common/PerkDisplay.vue';
import PerkPanelBackground from "@/assets/perk_panel_background.svg";


const props = defineProps<{
    intrinsic: DestinyInventoryItemDefinition | undefined,
    perk1: DestinyInventoryItemDefinition | undefined,
    perk2: DestinyInventoryItemDefinition | undefined,
    perk3: DestinyInventoryItemDefinition | undefined,
    perk4: DestinyInventoryItemDefinition | undefined,
    isPerk3Enhanced: boolean,
    isPerk4Enhanced: boolean,
    originPerk: DestinyInventoryItemDefinition | undefined,
    masterwork: DestinyInventoryItemDefinition | undefined,
    mod: DestinyInventoryItemDefinition | undefined,
}>();

const emits = defineEmits<{
    (e: "perkClicked", column: number): void,
}>();

const backgroundUrl = computed(() => PerkPanelBackground);

function onPerkClicked(column: number) {
    emits("perkClicked", column);
}
</script>

<template>
    <div class="selected" :style="{ 'background-image': 'url(' + backgroundUrl + ')' }">
        <PerkDisplay class="perk" :perk="props.intrinsic"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" full-size hide-hover></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.perk1"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.perk2"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.perk3"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" :enhanced="isPerk3Enhanced" @click="onPerkClicked(2)"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.perk4"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" :enhanced="isPerk4Enhanced" @click="onPerkClicked(3)"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.originPerk"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" v-if="!!originPerk"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.mod"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" full-size v-if="!!mod"></PerkDisplay>

        <PerkDisplay class="perk" :perk="props.masterwork"
            :required-crafted-level="undefined" :required-crafted-level-enhanced="undefined"
            :selected="false" :retired="false" full-size v-if="!!masterwork"></PerkDisplay>
    </div>
</template>

<style scoped>
.selected {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 8px;
}

.perk {
    margin-left: 16px;
}
.perk:first-child {
    margin-left: 0;
}
</style>
