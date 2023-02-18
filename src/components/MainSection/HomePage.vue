<script setup lang="ts">import { computed } from 'vue';

interface IChangelog {
    version: string;
    date: string;
    title: string;
    description: string;
    changes: string[];
}

const changelogs = computed<IChangelog[]>(() => [
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
        <div class="changelog" v-for="changelog of changelogs" :key="changelog.version">
            <div class="header">
                <h3 class="title">{{ changelog.title }}</h3>
                <span>[</span>
                <i class="version">{{ changelog.version }}</i>
                <span>]</span>
                {{ changelog.date }}
            </div>
            <p class="description">{{ changelog.description }}</p>
            <ul class="changes">
                <li class="change" v-for="change of changelog.changes" :key="change">{{ change }}</li>
            </ul>
        </div>
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
