<script setup lang="ts">
import CollapsibleSection from "@/components/Common/CollapsibleSection.vue";
import ElementLabel from "@/components/Common/ElementLabel.vue";
import OptionButton from "@/components/Common/OptionButton.vue";
import { ValidPerkPlugCategories } from "@/data/constants";
import type { IPerkFilterInfo, ISelectedFilters, LookupMap } from "@/data/interfaces";
import { destinyDataService } from "@/data/services";
import { arrayToExistenceMap } from "@/data/util";
import { computed, ref } from "vue";

const props = defineProps<{
    selectedFilters: ISelectedFilters,
}>();

const emits = defineEmits<{
    (e: "perkToggled", perkName: string, perk: IPerkFilterInfo): void,
}>();

const collapsed = ref(false)
const perkFilter = ref("");

const selectedPerks = computed(() => props.selectedFilters.selectedPerks);

const selectedPerkFilters = computed(() => {
    const selected = allPerkOptions.value.filter(f => selectedPerks.value[f.name]);
    return selected;
});

const allPerkOptions = computed(() => {
    const validPerkMap = arrayToExistenceMap(ValidPerkPlugCategories.value);
    const seenOptionsMap: LookupMap<string, IPerkFilterInfo> = {};
    const options: IPerkFilterInfo[] = [];

    for (const pair of destinyDataService.perkPairs) {
        const perk = destinyDataService.getPerkDefinition(pair.perk);
        if (!perk || !validPerkMap[perk.categoryId]) continue;

        const existing = seenOptionsMap[perk.name];
        if (!existing) {
            const filterInfo: IPerkFilterInfo = {
                name: perk.name,
                perkHashes: [pair.perk],
            };
            seenOptionsMap[perk.name] = filterInfo;
            options.push(filterInfo);
        } else {
            existing.perkHashes.push(pair.perk);
        }
    }

    return options;
});

const selectablePerkOptions = computed(() => {
    if (!perkFilter.value) return [];

    // Hide perks that are already selected.
    const filteredOptions = allPerkOptions.value.filter(f => {
        const lowerPerkName = f.name.toLocaleLowerCase();
        const lowerSearchText = perkFilter.value.toLocaleLowerCase();
        return lowerPerkName.includes(lowerSearchText)
            && !selectedPerks.value[f.name];
    });
    return filteredOptions;
});

function toggleCollapsed() {
    collapsed.value = !collapsed.value;
}

function onPerkCleared(perk: IPerkFilterInfo) {
    emits("perkToggled", perk.name, perk);
}

function onPerkChosen(perk: IPerkFilterInfo) {
    perkFilter.value = "";
    emits("perkToggled", perk.name, perk);
}
</script>

<template>
    <CollapsibleSection
        name="Perks"
        :collapsed="collapsed"
        @toggled="toggleCollapsed()"
    >
        <ElementLabel text="Perk filter text box" class="perk-search-wrapper">
            <input
                class="perk-search"
                type="search"
                placeholder="Filter for specific perks"
                v-model="perkFilter"
            >
        </ElementLabel>
        <div class="perk-options" v-if="selectedPerkFilters.length > 0">
            <OptionButton
                v-for="perkOption of selectedPerkFilters"
                :key="perkOption.name"
                :text="perkOption.name"
                :active="false"
                remove
                @toggled="onPerkCleared(perkOption)"
            ></OptionButton>
        </div>
        <div class="perk-options unselected" v-if="!!perkFilter">
            <OptionButton
                v-for="perkOption of selectablePerkOptions"
                :key="perkOption.name"
                :text="perkOption.name"
                :active="false"
                @toggled="onPerkChosen(perkOption)"
            ></OptionButton>
        </div>
    </CollapsibleSection>
</template>

<style scoped lang="less">
.perk-search-wrapper {
    display: flex;
}
.perk-search {
    flex: 1;

    order: 1;
    color: #fafafa;
    background: none;
    font-size: 16px;
    font-family: neue-haas-grotesk-text,"Helvetica Neue",sans-serif;
    line-height: 16px;

    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;

    border-width: 1px;
    border-style: solid;
    border-color: hsla(0, 0%, 100%, 0.5);
    border-radius: 0;
    border-top: none;

    &::placeholder {
        font-size: 12px;
        font-family: neue-haas-grotesk-text,"Helvetica Neue",sans-serif;
        line-height: 16px;
        letter-spacing: 2px;
        text-transform: uppercase;
    }
    &:focus {
        outline: none;
    }
}
.perk-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;

    margin-top: 8px;
    
    &.unselected {
        padding-top: 8px;
        border-top: 1px solid hsla(0, 0%, 100%, 0.5);
    }
}
</style>
