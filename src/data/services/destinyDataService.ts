import type { DestinySeasonDefinition } from "bungie-api-ts/destiny2";
import { ref } from "vue";
import type { Destiny2GameData, ILanguageInfo, ItemHash, IWeapon } from "../interfaces";
import type { DestinyApiService } from "./destinyApiService";

export class DestinyDataService {
    private initialized: boolean = false;
    private readonly gameDataWrapper = ref<Destiny2GameData | null>(null);

    constructor(private readonly destinyApiService: DestinyApiService) { }

    public get gameData() {
        return this.gameDataWrapper.value;
    }

    public get weapons() {
        return this.gameData ? this.gameData.weapons : [];
    }

    public get weaponTypes() {
        return this.gameData ? this.gameData.weaponTypes : [];
    }

    public get damageTypes() {
        return this.gameData ? this.gameData.damageTypes : [];
    }

    public get seasons() {
        return this.gameData ? this.gameData.seasons : []
    }

    public get itemTiers() {
        return this.gameData ? this.gameData.itemTierTypes : [];
    }

    public get perkInsights() {
        return this.gameData ? this.gameData.perkInsights : undefined;
    }

    public get perkPairs() {
        return this.gameData ? this.gameData.perkLookup.perkPairs : [];
    }

    public get collectionsLists() {
        return this.gameData ? this.gameData.collectionsLists : undefined;
    }

    public initialize = async (language: ILanguageInfo | undefined) => {
        if (this.initialized) return;

        await this.refreshGameData(language);

        this.initialized = true;
    }

    public getImageUrl = (imgFileName: string) => {
        if (!imgFileName) return "";
        return `https://www.bungie.net${imgFileName}`;
    }

    public getWeapon = (hash: ItemHash | undefined): IWeapon | undefined => {
        if (!hash) return undefined;
        return this.gameData?.weapons.find(w => w.hash === hash);
    }

    public isSeasonSunset = (season: DestinySeasonDefinition) => {
        // Season of Dawn is last sunset season
        return !season || season.seasonNumber <= 9;
    }

    public getPerkDefinition = (perkHash: ItemHash | undefined) => {
        if (!perkHash) return undefined;
        return this.gameData?.perkLookup.normal[perkHash];
    }

    public getEnhancedPerkDefinition = (perkHash: ItemHash | undefined) => {
        if (!perkHash) return undefined;
        return this.gameData?.perkLookup.enhanced[perkHash];
    }

    public getMasterworkDefinition = (mwHash: ItemHash | undefined) => {
        if (!mwHash) return undefined;
        return this.gameData?.masterworkLookup[mwHash];
    }

    public getModDefinition = (modHash: ItemHash | undefined) => {
        if (!modHash) return undefined;
        return this.gameData?.modLookup[modHash];
    }

    public getCatalystDefinition = (hash: ItemHash | undefined) => {
        if (!hash || !this.gameData) return undefined;
        return this.gameData.catalystLookup[hash];
    }

    public getSandboxPerkDefinition = (hash: ItemHash | undefined) => {
        if (!hash || !this.gameData) return undefined;
        return this.gameData.sandboxPerkLookup[hash];
    }

    // Notes
    // - On a weapon, intrinsicSockets seems to be the infuse button
    // - TODO: figure out what socketCategories is again
    // - socketCategories can be used as well, an array of objects each of which:
    //   - contains a socketCategoryHash which points to the DestinySocketCategoryDefinition
    //   - contains an array which contains indices of socketEntries that are in this object's socket category
    // - socketEntries is the seemingly important part
    //   - this property is an object where keys are hash numbers and values are DestinyItemSocketEntryDefinition
    //   - this object contains a singleInitialItemHas, which points to:
    //     - the weapon frame type (e.g. lightweight, precision, etc.)
    //     - curated perks
    //     - Default Shader button
    //     - Weapon Mod slot (empty)
    //     - un-leveled MW (might be random or might be range on everything, taipan has a range MW)
    //     - origin trait (I guess this is part of the curated roll and may appear again elsewhere)
    //     - kill tracker
    //     - empty memento socket (probably for crafted weapons only but should check)
    //     - a "crafting.plugs.weapons.mods.extractors" - probably the red border extract button
    //   - this object may contain a reusablePlugSetHash, which points to:
    //     - a DestinyPlugSetDefinition, which contains a reusablePlugItems property (i.e. the list of allowable options for that socket)
    //       - this list contains pointers to the actual items available in that slot, including:
    //         - intrinsic frame type (e.g. precision, lightweight)
    //         - shaders
    //         - weapon mod options
    //         - origin trait
    //         - trials memento tracker
    //         - presumably, the other memento trackers
    //         - the red box extraction slot
    //   - this object may contain a randomizedPlugSetHash, which points to:
    //     - a DestinyPlugSetDefinition, which contains a reusablePlugItems property (i.e. the list of allowable options for that socket)
    //       - this list contains pointers to the actual items available in that slot, including:
    //         - list of possible 1st column perk options
    //         - list of possible 2nd column perk options
    //         - list of possible 3rd column perk options
    //         - list of possible 4th column perk options
    //         - list of MWs possible
    //   - this object contains a socketTypeHash, which points to:
    //     - a DestinySocketTypeDefinition which contains a plugWhitelist property (i.e. the list of allowable options for that slot in general)
    //       - this list can be for:
    //         - weapon intrinsic type (e.g. precision or lightweight, etc.)
    //         - 1st column perks (barrels, strings, scopes, etc.)
    //         - 2nd column perks (batteries, shafts, magazines, etc.)
    //         - 3rd column perks
    //         - 4th column perks
    //         - shader
    //         - allowable mods on that weapon
    //         - MW
    //         - origin trait
    //         - MW tracker ? (could be tracker from old MW kill tracker?)
    //         - crafting frame
    //         - memento
    //         - red box pattern extract button
    public refreshGameData = async (language: ILanguageInfo | undefined) => {
        // TODO: need to show the user that the data is refreshing somehow...
        // Get manifest slices we care about
        const start = Date.now();
        const gameData = await this.destinyApiService.retrieveManifest(language ? language.language : "en");
        const end = Date.now();
        console.log("loading manifest took", end - start);
        console.log(gameData);

        this.gameDataWrapper.value = gameData;
    }
}
