<script setup lang="ts">
import { computed } from 'vue';

interface IChangelog {
    version: string;
    date: string;
    title: string;
    description: string;
    changes: string[];
}

const changelogs = computed<IChangelog[]>(() => [
    {
        version: "1.4.0",
        date: "2023-03-05",
        title: "Weapon Calculations",
        description: "Adds calculations for weapon properties, a new glossary, and bug fixes.",
        changes: [
            "Add calculations for weapon damage falloff, reload, handling, and total ammo.",
            "Glossary revamp with section for each perk + enhanced pair along with perk icon.",
            "Added support for multiple screen sizes - sidebar now collapses and weapon viewer becomes single-column at low widths.",
            "Fix not being able to toggle selected perks to enhanced.",
        ],
    },
    {
        version: "1.3.0",
        date: "2023-02-22",
        title: "Perk Filters + Other Filter Improvements",
        description: "Filtering by perks on a weapon is now implemented along with some other filter improvements and bug fixes.",
        changes: [
            "Added perk filters.",
            "Add filter for craftable weapons (includes adept versions - not fixing this since they will be able to be enhanced sometime in Lightfall).",
            "Add filter for adept weapons.",
            "Reduced load times when reading from the cached manifest.",
            "Fix some weapons having duplicate perks.",
            "Limit weapon search results to 100 to speed up searching. Weapon list now has \"Show All\" at bottom to show every result.",
            "Fixed sunset weapon filter excluding non-sunset weapons.",
            "Fix reissued weapons displaying their sunset logo.",
        ],
    },
    {
        version: "1.2.0",
        date: "2023-02-20",
        title: "Collections Filters + Perk Insights",
        description: "This change implements the collections filters for sources of weapons,"
            + " perk insights from community info (+ glossary) for perk details, and some other bug fixes.",
        changes: [
            "Added filters for seasonal weapons and various other collections (seasons prior to Season of Worthy not yet implemented).",
            "Insights/community info on perks added to tooltips for perks and mods (+ glossary available).",
            "Added Clear Filters button.",
            "Clear filters on search text change.",
            "Clear search text whenever filters are applied.",
            "Fixed mods not having descriptions.",
            "Fixed mods always showing raw stat values.",
            "Show Crafted bonus option now hidden for non-crafted weapons.",
        ],
    },
    {
        version: "1.1.0",
        date: "2023-02-13",
        title: "Improve Page Load Times + Quality of Life",
        description: "This change brings improvements to page load times as well as some quality of life changes"
            + " such as preferences saving across refreshes, weapon flavor text tooltip, and hiding the weapon panel UI"
            + " to view the weapon screenshot.",
        changes: [
            "Now displays weapon description/flavor text when hovering over weapon name/icon/type.",
            "Adept mods no longer display on non-adept weapons.",
            "Added toggle to display raw values for stat bonuses.",
            "Preferences (\"Extras\" area) now save across page load.",
            "Add show/hide button for UI elements on weapon panel to allow viewing weapon preview.",
            "Convert stat lookups to use index instead of stat name - removes need for translating stat names.",
            "Dramatically reduce bundle + asset size to improve page load time.",
        ],
    },
    {
        version: "1.0.0",
        date: "2023-02-12",
        title: "The Big One",
        description: "With the majority of features done, it's time to make this a release.",
        changes: [
            "Customize the stats, masterworks, and perks of weapons.",
            "Supports all languages provided by the Bungie API.",
            "Filters supported: Damage type, Weapon type, Rarity, Sunset weapons.",
        ],
    },
]);
</script>

<template>
    <div class="home">
        <a class="github-link" href="https://github.com/turbshas/d2weaponforge/blob/main/CHANGELOG.md"><i>View on GitHub</i></a>
        <section class="changelog" v-for="changelog of changelogs" :key="changelog.version" aria-label="Change log">
            <div class="header">
                <h3 class="title">{{ changelog.title }}</h3>
                <span>[</span>
                <i class="version" aria-label="Version">{{ changelog.version }}</i>
                <span>]</span>
                <span aria-label="Release date">{{ changelog.date }}</span>
            </div>
            <p class="description" aria-label="Description">{{ changelog.description }}</p>
            <ul class="changes" aria-label="Changes">
                <li class="change" v-for="change of changelog.changes" :key="change">{{ change }}</li>
            </ul>
        </section>
    </div>
</template>

<style scoped lang="less">
.home {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    margin-bottom: auto;
    padding: 16px;

    font-size: 16px;
    font-weight: 450;
    line-height: 24px;
    letter-spacing: 0;

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

.github-link {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
}

.header {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
}
.title {
    margin: 0;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;

    font-weight: 700;
    text-transform: uppercase;
    background-color: #b78c25;
}
.version {
    font-weight: 700;
    text-transform: uppercase;
}

.description {
    margin-top: 16px;
    margin-bottom: 16px;
}

.changes {
    padding-left: 18px;
}
</style>
