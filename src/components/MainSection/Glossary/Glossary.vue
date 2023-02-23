<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import CollapsibleSection from '@/components/Common/CollapsibleSection.vue';
import { ModHash, PerkHash, type IInsightDisplay, type IPerkInsights, type ItemHash, type LookupMap } from '@/data/interfaces';
import { destinyDataService } from '@/data/services';
import { computed, ref } from 'vue';
import GlossaryDefinition from './GlossaryDefinition.vue';
import GlossaryInsightGroup from './GlossaryInsightGroup.vue';

interface IInsightDisplayPair {
    perk: IInsightDisplay;
    enhanced: IInsightDisplay | undefined;
}

const expandedPerksMap = ref<LookupMap<ItemHash, boolean>>({});

const isDataLoaded = computed(() => !!destinyDataService.gameData);
const weaponPerkInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponPerks : {});
const weaponModInsights = computed(() => destinyDataService.perkInsights ? destinyDataService.perkInsights.weaponMods : {});

const allPerkPairs = computed(() => destinyDataService.perkPairs);

const perkPairsWithInsight = computed(() => {
    const perkInsights = weaponPerkInsights.value;
    if (!perkInsights) return [];
    const pairs = allPerkPairs.value.filter(p => !!perkInsights[p.perk as PerkHash] && (!p.enhanced || !!perkInsights[p.enhanced as PerkHash]));
    return pairs;
});

const resolvedPerkPairs = computed(() => {
    const pairs = perkPairsWithInsight.value.map(p => {
        const pair: IInsightDisplayPair = {
            perk: getInsightFromHash(p.perk, weaponPerkInsights.value),
            enhanced: p.enhanced ? getInsightFromHash(p.enhanced, weaponPerkInsights.value) : undefined,
        };
        return pair;
    });
    pairs.sort((a, b) => a.perk.name.localeCompare(b.perk.name));
    return pairs;
});

const modHashes = computed(() => getHashesFromEnum(ModHash));

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
    // TODO: this is bad for now, but will be fixed when the glossary rework happens.
    const perkItem = destinyDataService.getModDefinition(hash)
        || destinyDataService.getEnhancedPerkDefinition(hash)
        || destinyDataService.getPerkDefinition(hash);
    const perkInsight = destinyDataService.perkInsights ? insightMap[hash as T] : undefined;
    const insightDisplay: IInsightDisplay = {
        hash: hash,
        name: perkItem ? perkItem.name : "",
        iconUrl: perkItem ? destinyDataService.getImageUrl(perkItem.iconUrl) : "",
        description: perkInsight ? perkInsight.description : "",
    };
    return insightDisplay;
}

function getEnhancedPerkName(normalPerkName: string, enhancedPerkName: string) {
    return enhancedPerkName === normalPerkName ? `${enhancedPerkName} Enhanced` : enhancedPerkName;
}

function isPerkCollapsed(hash: ItemHash) {
    return !expandedPerksMap.value[hash];
}

function onCollapseAll() {
    for (const pair of resolvedPerkPairs.value) {
        expandedPerksMap.value[pair.perk.hash] = false;
    }
}

function onExpandAll() {
    for (const pair of resolvedPerkPairs.value) {
        expandedPerksMap.value[pair.perk.hash] = true;
    }
}

function onPerkToggled(perkHash: ItemHash) {
    expandedPerksMap.value[perkHash] = !expandedPerksMap.value[perkHash];
}
</script>

<template>
    <div class="glossary" v-if="isDataLoaded">
        <h1>Glossary</h1>
        <p>
            Some perks names may appear more than once in this list.
            In some cases these are duplicates, in others they are the enhanced version.
        </p>
        <div class="perks-header">
            <h2>Perks</h2>
            <div class="controls">
                <OptionButton text="Collapse" :active="false" @toggled="onCollapseAll"></OptionButton>
                <OptionButton text="Expand" :active="true" @toggled="onExpandAll"></OptionButton>
            </div>
        </div>
        <dl class="perks-list" aria-label="Perk insights">
            <CollapsibleSection
                v-for="pair of resolvedPerkPairs"
                :key="pair.perk.hash"
                :name="pair.perk.name"
                :collapsed="isPerkCollapsed(pair.perk.hash)"
                :icon="pair.perk.iconUrl"
                @toggled="onPerkToggled(pair.perk.hash)"
            >
                <GlossaryDefinition
                    class="perk-def"
                    :insight="pair.perk"
                    :hash="pair.perk.hash"
                    :name="pair.perk.name"
                    :description="pair.perk.description"
                ></GlossaryDefinition>
                <GlossaryDefinition
                    class="perk-def"
                    v-if="!!pair.enhanced"
                    :hash="pair.enhanced.hash"
                    :name="getEnhancedPerkName(pair.perk.name, pair.enhanced.name)"
                    :description="pair.enhanced.description"
                ></GlossaryDefinition>
            </CollapsibleSection>
        </dl>
        <h2>Mods</h2>
        <GlossaryInsightGroup :insights="modInsights" aria-label="Mod insights"></GlossaryInsightGroup>
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

.perks-header {
    display: flex;

    .controls {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
}

.perks-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.perk-def {
    margin-top: 16px;
}
</style>
