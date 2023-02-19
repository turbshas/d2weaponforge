<script setup lang="ts">
import { ModHash, PerkHash, type IPerkInsights } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed } from 'vue';

interface IInsightDisplay {
    name: string;
    hash: number;
    description: string;
}

const isDataLoaded = computed(() => !!destinyDataService.gameData);
const weaponPerkInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponPerks : undefined);
const weaponModInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponMods : undefined);

const perkHashes = computed(() => getHashesFromEnum(PerkHash));
const modHashes = computed(() => getHashesFromEnum(ModHash));

const perkInsights = computed(() => {
    const insightMap = weaponPerkInsights.value;
    if (!insightMap) return [];
    return perkHashes.value.map(h => getInsightFromHash(h, insightMap));
});
const modInsights = computed(() => {
    const insightMap = weaponModInsights.value;
    if (!insightMap) return [];
    return modHashes.value.map(h => getInsightFromHash(h, insightMap));
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
        name: perkItem ? perkItem.displayProperties.name : "",
        hash: hash,
        description: perkInsight ? perkInsight.description : "",
    };
    return insightDisplay;
}
</script>

<template>
    <div v-if="isDataLoaded">
        <h1>Glossary</h1>
        <ul class="group">
            <li class="insight" v-for="insight of perkInsights" :key="insight.hash">
                <h4 class="name">{{ insight.name }}</h4>
                <span class="hash">{{ insight.hash }}</span>
                <pre class="description">{{ insight.description }}</pre>
            </li>
        </ul>
        <ul class="group">
            <li class="insight" v-for="insight of modInsights" :key="insight.hash">
                <h4 class="name">{{ insight.name }}</h4>
                <span class="hash">{{ insight.hash }}</span>
                <pre class="description">{{ insight.description }}</pre>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="less">
.group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style-type: none;
    padding: 0;
}

.insight {
    width: 350px;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.25rem;

    .name {
        margin: 0;
    }

    .description {
        margin: 0;
        white-space: pre-wrap;
    }
}
</style>
