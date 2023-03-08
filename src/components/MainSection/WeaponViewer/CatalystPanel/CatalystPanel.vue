<script setup lang="ts">
import OptionButton from '@/components/Common/OptionButton.vue';
import StatBonusList from '@/components/Common/StatBonusList.vue';
import type { ICatalyst, IPerkBonus, ItemHash } from '@/data/interfaces';
import { destinyDataService, selectionService } from '@/data/services';
import { computed } from 'vue';
import BuilderSection from '../../../Common/BuilderSection.vue';
import CatalystLabel from './CatalystLabel.vue';

interface ISandboxPerkDisplay {
    hash: ItemHash;
    name: string;
    description: string;
    icon: string;
}

interface ICatalystDisplay {
    hash: ItemHash;
    requirementIcon: string;
    requirements: string[];
    sandboxPerks: ISandboxPerkDisplay[];
    statBonuses: IPerkBonus[];
}

// TODO: hopefully a better way to do this? The URLs might change with manifest updates.
const PlaceholderCatalystIcon = "46ebd791f692b682691416beea7ac4c5.jpg";
const MissingCatalystIcon = "23a04c67f97523cdc0eff0004fae75e1.jpg";

const props = defineProps<{
    catalysts: ItemHash[],
    activeCatalyst: ICatalyst | undefined,
}>();

const emits = defineEmits<{
    (e: "catalystApplied", catalyst: ICatalyst | undefined): void
}>();

const catalystItems = computed(() => {
    const catalystItems: ICatalystDisplay[] = [];
    for (const c of props.catalysts) {
        const item = destinyDataService.getCatalystDefinition(c);
        if (!item) continue;
        if (item.iconUrl.includes(PlaceholderCatalystIcon)
            || item.iconUrl.includes(MissingCatalystIcon)) continue;

        const displayPerks: ISandboxPerkDisplay[] = [];
        for (const p of item.sandboxPerks) {
            const perkItem = destinyDataService.getSandboxPerkDefinition(p);
            if (!perkItem) continue;
            const displayPerk: ISandboxPerkDisplay = {
                hash: p,
                name: perkItem.name,
                description: perkItem.description,
                icon: destinyDataService.getImageUrl(perkItem.iconUrl),
            };
            displayPerks.push(displayPerk);
        }

        const displayItem: ICatalystDisplay = {
            hash: c,
            requirementIcon: destinyDataService.getImageUrl(item.iconUrl),
            requirements: item.unlockRequirements.map(req => `${req.description}: ${req.completionValue}`),
            sandboxPerks: displayPerks,
            statBonuses: item.mainBonuses.map(b => {
                const displayBonus: IPerkBonus = {
                    statHash: b.statHash,
                    statName: b.statName,
                    value: selectionService.displayValueIfAddingBonus(b, undefined),
                };
                return displayBonus;
            }),
        };
        catalystItems.push(displayItem);
    }
    return catalystItems;
});

function onApplyToggled(catalystHash: ItemHash) {
    const appliedCatalystHash = catalystHash === props.activeCatalyst?.hash ? undefined : catalystHash;
    const appliedCatalyst = destinyDataService.getCatalystDefinition(appliedCatalystHash);
    emits("catalystApplied", appliedCatalyst);
}
</script>

<template>
    <BuilderSection title="Exotic Catalyst">
        <div class="catalysts" v-if="catalystItems.length > 0">
            <div class="catalyst" v-for="item of catalystItems" :key="item.hash">
                <div class="header">
                    <CatalystLabel
                        title="Requirements"
                        :icon="item.requirementIcon"
                        :descriptions="item.requirements"
                    ></CatalystLabel>
                    <OptionButton
                        class="apply"
                        text="Apply Catalyst"
                        :active="item.hash === props.activeCatalyst?.hash"
                        @toggled="onApplyToggled(item.hash)"
                    ></OptionButton>
                </div>

                <CatalystLabel
                    v-for="perk of item.sandboxPerks"
                    :key="perk.hash"
                    :title="perk.name"
                    :icon="perk.icon"
                    :descriptions="[perk.description]"
                ></CatalystLabel>

                <StatBonusList class="stats" v-if="item.statBonuses.length > 0" :bonuses="item.statBonuses"></StatBonusList>
            </div>
        </div>
        <span v-else>This exotic currently has no catalyst.</span>
    </BuilderSection>

</template>

<style scoped lang="less">
.catalysts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.catalyst {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.header {
    display: flex;
    align-items: center;

    .apply {
        margin-left: auto;
    }
}

.stats {
    border-top: 1px solid rgba(250, 250, 250, 0.6);
    padding-top: 0.5rem;
}
</style>
