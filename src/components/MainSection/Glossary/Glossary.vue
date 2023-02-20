<script setup lang="ts">
import { ModHash, PerkHash, type IInsightDisplay, type IPerkInsights } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from 'vue';
import GlossaryInsightGroup from './GlossaryInsightGroup.vue';

const isDataLoaded = computed(() => !!destinyDataService.gameData);
const weaponPerkInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponPerks : undefined);
const weaponModInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponMods : undefined);

const perkHashes = computed(() => getHashesFromEnum(PerkHash));
const modHashes = computed(() => getHashesFromEnum(ModHash));

const perkInsights = computed(() => {
    const insightMap = weaponPerkInsights.value;
    if (!insightMap) return [];
    const insights = perkHashes.value.map(h => getInsightFromHash(h, insightMap));
    insights.sort((a, b) => a.name.localeCompare(b.name));
    return insights;
});
const modInsights = computed(() => {
    const insightMap = weaponModInsights.value;
    if (!insightMap) return [];
    const insights = modHashes.value.map(h => getInsightFromHash(h, insightMap));
    insights.sort((a, b) => a.name.localeCompare(b.name));
    return insights;
});

function getHashesFromEnum(enumObject: Object) {
    const hashes: number[] = [];
    for (const key in enumObject) {
        const keyNumber = Number.parseInt(key);
        if (!isNaN(keyNumber)) {
            hashes.push(keyNumber);
        }
    }
    return hashes;
}

function getInsightFromHash<T extends string | number | symbol>(hash: number, insightMap: IPerkInsights<T>) {
    const perkItem = destinyDataService.getItemDefinition(hash);
    const perkInsight = destinyDataService.perkInsights ? insightMap[hash as T] : undefined;
    const insightDisplay: IInsightDisplay = {
        hash: hash,
        name: perkItem ? perkItem.displayProperties.name : "",
        iconUrl: perkItem ? destinyDataService.getImageUrl(perkItem.displayProperties.icon) : "",
        description: perkInsight ? perkInsight.description : "",
    };
    return insightDisplay;
}
</script>

<template>
    <div class="glossary" v-if="isDataLoaded">
        <h1>Glossary</h1>
        <p>
            Some perks names may appear more than once in this list.
            In some cases these are duplicates, in others they are the enhanced version.
        </p>
        <GlossaryInsightGroup :insights="perkInsights"></GlossaryInsightGroup>
        <GlossaryInsightGroup :insights="modInsights"></GlossaryInsightGroup>
    </div>
</template>

<style scoped lang="less">
.glossary {
    position: relative;
    padding-left: 1rem;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        background-color: #232936;
        mix-blend-mode: multiply;
    }
}
</style>
