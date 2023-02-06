<script setup lang="ts">
import type { IMod, IWeapon } from '@/data/interfaces';
import { computed } from 'vue';
import PerkDisplay from '../../Common/PerkDisplay.vue';
import BuilderSection from '../../Common/BuilderSection.vue';

const props = defineProps<{
    weapon: IWeapon | undefined,
    mod: IMod | undefined,
}>();

const emits = defineEmits<{
    (e: "modChanged", mod: IMod | undefined): void
}>();

const modOptions = computed(() => {
    if (!props.weapon) return [];
    return props.weapon.mods;
});

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
                v-for="mod of modOptions"
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
