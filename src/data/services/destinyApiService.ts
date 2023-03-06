import { getDestinyManifest, getDestinyManifestSlice, type DestinyManifest, type DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import type { Destiny2GameData, ItemHash, IWeapon, LookupMap, UsedDestinyManifestSlice } from "../interfaces";
import type { CacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";

const CurrentCachedManifestVersion = 10;

export class DestinyApiService {
    constructor(private readonly cacheService: CacheService) { }

    public readonly retrieveManifest = async (language: DestinyManifestLanguage) => {
        DataSearchStrings.setLanguage(language);

        // Get manifest metadata
        const manifestInfoPromise = getDestinyManifest(this.makeRequest);
        const cachedManifestPromise = this.cacheService.getCachedManifest();
        const [manifestInfoResponse, cachedManifest] = await Promise.all([manifestInfoPromise, cachedManifestPromise]);
        const manifestInfo = manifestInfoResponse.Response;

        console.log("manifest info", manifestInfo);

        // /*
        if (cachedManifest
            && cachedManifest.version === CurrentCachedManifestVersion
            && cachedManifest.language === language) {
            const cachedJsonComponentUrls = cachedManifest.manifestInfo.jsonWorldComponentContentPaths[language];
            const retrievedJsonComponentUrls = manifestInfo.jsonWorldComponentContentPaths[language];
            // Apparently the URLs are better for checking the manifest version as they contain a
            // hash of the contents, and sometimes this will change without the actual version changing.
            if (cachedJsonComponentUrls["DestinyInventoryItemDefinition"] === retrievedJsonComponentUrls["DestinyInventoryItemDefinition"]) {
                return cachedManifest.manifestData;
            }
        }
        // */

        const gameData = await this.getGameDataFromApi(manifestInfo, language);

        this.cacheService.setCachedManifest({
            version: CurrentCachedManifestVersion,
            language: language,
            manifestInfo: manifestInfo,
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
        const weaponsLookup: LookupMap<ItemHash, IWeapon> = {};
        for (const weapon of weapons) {
            weaponsLookup[weapon.hash] = weapon;
        }

        const gameData: Destiny2GameData = {
            damageTypes: manifestProcessor.damageTypes,
            itemTierTypes: manifestProcessor.itemTierTypes,
            seasons: manifestProcessor.seasons,

            weapons: weapons,
            weaponTypes: manifestProcessor.weaponTypes,

            perkLookup: manifestProcessor.perkLookup,
            masterworkLookup: manifestProcessor.masterworkLookup,
            modLookup: manifestProcessor.modLookup,
            catalystLookup: manifestProcessor.catalystLookup,

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
