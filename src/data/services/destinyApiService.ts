import { getDestinyManifest, getDestinyManifestSlice, type DestinyManifest, type DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import type { CacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import type { Destiny2GameData, IWeapon, UsedDestinyManifestSlice } from "../interfaces";

const CurrentCachedManifestVersion = 4;

export class DestinyApiService {
    constructor(private readonly cacheService: CacheService) { }

    public readonly retrieveManifest = async (language: DestinyManifestLanguage) => {
        DataSearchStrings.setLanguage(language);

        // Get manifest metadata
        const manifestInfoPromise = getDestinyManifest(this.makeRequest);
        const cachedManifestPromise = this.cacheService.getCachedManifest();
        const [manifestInfo, cachedManifest] = await Promise.all([manifestInfoPromise, cachedManifestPromise]);

        console.log("manifest info", manifestInfo);

        // /*
        if (cachedManifest
            && cachedManifest.version === CurrentCachedManifestVersion
            && cachedManifest.language === language) {
            const cachedJsonComponentUrls = cachedManifest.manifestInfo.jsonWorldComponentContentPaths[language];
            const retrievedJsonComponentUrls = manifestInfo.Response.jsonWorldComponentContentPaths[language];
            // Apparently the URLs are better for checking the manifest version as they contain a
            // hash of the contents, and sometimes this will change without the actual version changing.
            if (cachedJsonComponentUrls["DestinyInventoryItemDefinition"] === retrievedJsonComponentUrls["DestinyInventoryItemDefinition"]) {
                return cachedManifest.manifestData;
            }
        }
        // */

        const gameData = await this.getGameDataFromApi(manifestInfo.Response, language);

        this.cacheService.setCachedManifest({
            version: CurrentCachedManifestVersion,
            language: language,
            manifestInfo: manifestInfo.Response,
            manifestData: gameData,
        }).catch(err => console.error("Failed to cache manifest.", err));
        return gameData;
    }
    
    private readonly getGameDataFromApi = async (manifestInfo: DestinyManifest, language: DestinyManifestLanguage) => {
        // Get manifest slices we care about
        const manifestSlice = await getDestinyManifestSlice(this.makeRequest, {
            destinyManifest: manifestInfo,
            language: language,
            tableNames: [
                "DestinyDamageTypeDefinition",
                "DestinyItemCategoryDefinition",
                "DestinyItemTierTypeDefinition",
                "DestinySeasonDefinition",
                "DestinyInventoryItemDefinition",
                "DestinyPlugSetDefinition",
                "DestinyStatDefinition",
                "DestinyStatGroupDefinition",
                "DestinySocketCategoryDefinition",
                "DestinySocketTypeDefinition",
                "DestinyPowerCapDefinition",
                "DestinySandboxPerkDefinition",
            ],
        });

        console.log(manifestSlice);

        const promises = [this.getManifestProcessor(manifestSlice), this.getPerkInsightCollection(), this.getCollectionsLists()] as const;
        const [manifestProcessor, perkInsights, collectionsLists] = await Promise.all(promises);

        const weapons = manifestProcessor.weapons;
        const weaponsLookup: { [weaponItemHash: number]: IWeapon } = {};
        for (const weapon of weapons) {
            weaponsLookup[weapon.hash] = weapon;
        }

        const gameData: Destiny2GameData = {
            damageTypes: manifestProcessor.damageTypes,
            damageTypesLookup: manifestProcessor.damageTypeLookup,
            itemCategories: manifestProcessor.itemCategories,
            itemCategoriesLookup: manifestProcessor.itemCategoriesLookup,
            itemTierTypes: manifestProcessor.itemTierTypes,
            itemTierTypesLookup: manifestProcessor.itemTierTypesLookup,
            seasons: manifestProcessor.seasons,
            seasonsLookup: manifestProcessor.seasonsLookup,

            weapons: weapons,
            weaponsLookup: weaponsLookup,
            weaponTypes: manifestProcessor.weaponTypes,

            statsLookup: manifestProcessor.statsLookup,
            statGroupsLookup: manifestProcessor.statGroupsLookup,
            itemLookup: manifestProcessor.itemLookup,
            plugSetLookup: manifestProcessor.plugSetLookup,
            socketCategoryLookup: manifestProcessor.socketCategoryLookup,
            socketTypeLookup: manifestProcessor.socketTypeLookup,

            perkInsights: perkInsights,
            collectionsLists: collectionsLists,
        };
        return gameData;
    }

    private readonly getManifestProcessor = async (manifest: UsedDestinyManifestSlice) => {
        const manifestProcessorImport = await import("../destinyManifestProcessor");
        return new manifestProcessorImport.DestinyManifestProcessor(manifest);
    }

    private readonly getPerkInsightCollection = async () => {
        const perkInsightImport = await import("../curatedData/PerkInsights");
        return perkInsightImport.default;
    }

    private readonly getCollectionsLists = async () => {
        const collectionsListsImport = await import("../curatedData/CollectionsLists");
        return collectionsListsImport.default;
    }

    private readonly makeRequest = async (config: HttpClientConfig) => {
        const query = !config.params ? "" : Object.keys(config.params)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(config.params[k])}`)
            .join("&");
        const url = query ? `${config.url}?${query}` : config.url;
        const response = await fetch(url, { method: config.method, body: config.body, });
        return await response.json();
    }
}
