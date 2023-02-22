<script setup lang="ts">
import type { IMod, ItemHash } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from 'vue';
import BuilderSection from '../../Common/BuilderSection.vue';
import PerkDisplay from '../../Common/PerkDisplay.vue';

const props = defineProps<{
    modList: ItemHash[],
    mod: IMod | undefined,
}>();

const emits = defineEmits<{
    (e: "modChanged", mod: IMod | undefined): void
}>();

const modItems = computed(() => {
    const modItems: IMod[] = [];
    for (const modItemHash of props.modList) {
        if (!modItemHash) continue;
        const modItem = destinyDataService.getModDefinition(modItemHash);
        if (!modItem) continue;
        modItems.push(modItem);
    }
    return modItems;
})

function onModClicked(mod: IMod) {
    // Selecting the current mod will de-select it
    const newMod = mod.hash === props.mod?.hash ? undefined : mod;
    emits("modChanged", newMod);
}
</script>

<template>
    <BuilderSection class="mods" title="Weapon Mods">
        <div class="list">
            <PerkDisplay
                class="mod"
                v-for="mod of modItems"
                :key="mod.hash"
                :perk="mod"
                :is-adept="false"
                :crafting-info="undefined"
                :selected="false"
                :retired="false"
                full-size
                @perk-clicked="onModClicked(mod)"
            ></PerkDisplay>
        </div>
    </BuilderSection>
</template>

<style scoped>
.list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 48px);
    gap: 8px;
    justify-content: space-between;
}

.mod {
    width: 48px;
    height: 48px;
}
</style>
