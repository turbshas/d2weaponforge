import { getDestinyManifest, getDestinyManifestSlice, type DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import type { CacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import type { Destiny2GameData } from "../interfaces";
import type { Weapon } from "../types/weapon";

const CurrentCachedManifestVersion = 3;

export class DestinyApiService {
    constructor(private readonly cacheService: CacheService) { }

    public retrieveManifest = async (language: DestinyManifestLanguage) => {
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

        // Get manifest slices we care about
        const manifestSlice = await getDestinyManifestSlice(this.makeRequest, {
            destinyManifest: manifestInfo.Response,
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

        const manifestProcessorImport = await import("../destinyManifestProcessor");
        const manifestProcessor = new manifestProcessorImport.DestinyManifestProcessor(manifestSlice);

        const weapons = manifestProcessor.weapons;
        const weaponsLookup: { [weaponItemHash: number]: Weapon } = {};
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
        };

        this.cacheService.setCachedManifest({
            version: CurrentCachedManifestVersion,
            language: language,
            manifestInfo: manifestInfo.Response,
            manifestData: gameData,
        }).catch(err => console.error("Failed to cache manifest.", err));
        return gameData;
    }

    private makeRequest = async (config: HttpClientConfig) => {
        const query = !config.params ? "" : Object.keys(config.params)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(config.params[k])}`)
            .join("&");
        const url = query ? `${config.url}?${query}` : config.url;
        const response = await fetch(url, { method: config.method, body: config.body, });
        return await response.json();
    }
}
