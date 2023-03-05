<script setup lang="ts">
import Tooltip from '@/components/Common/Tooltip.vue';
import WeaponIcon from '@/components/Common/WeaponIcon.vue';
import type { ISelectedGear } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed, ref } from '@vue/reactivity';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const weapon = computed(() => props.selectedGear.weapon.value);

const name = computed(() => weapon.value ? weapon.value.name : "");
const type = computed(() => weapon.value ? weapon.value.itemTypeDisplayName : "");
const description = computed(() => weapon.value ? weapon.value.description : "");
const elementName = computed(() => weapon.value ? weapon.value.damageType.name : "None");
const elementIcon = computed(() => weapon.value ? destinyDataService.getImageUrl(weapon.value.damageType.iconUrl) : undefined);
const elementLabel = computed(() => `Element Type: ${elementName.value}`);

const weaponNameElement = ref<HTMLElement | null>(null);

</script>

<template>
    <header class="summary" aria-label="Weapon Description">
        <div class="summary" :ref="(el) => { weaponNameElement = el as HTMLElement | null; }">
            <WeaponIcon class="icon" with-border :weapon="weapon"></WeaponIcon>
            <div class="description">
                <h1>{{ name }}</h1>
                <h3>{{ type }}</h3>
            </div>
        </div>
        <img class="element" :src="elementIcon" :alt="elementLabel">
        <Tooltip
            :target-element="weaponNameElement"
            title=""
            subtitle=""
            :description="description"
            :crafting-info="undefined"
            :effect="null"
            :bonuses="[]"
            :enhanced-bonuses="[]"
        ></Tooltip>
    </header>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.summary {
    display: flex;
    flex-direction: row;
}

.icon {
    width: 3.25rem;
    height: 3.25rem;
    margin-right: 1rem;
}

.description {
    display: flex;
    flex-direction: column;

    h1, h3 {
        margin: 0;
        text-transform: uppercase;
    }
    h1 {
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.4rem;

        @media @large-screen {
            font-size: 2rem;
            line-height: 2rem;
        }
    }
    h3 {
        font-size: 1rem;
        font-weight: 500;
    }
}

.element {
    margin-left: auto;
    width: 2.625rem;
    height: 2.625rem;
}
</style>
