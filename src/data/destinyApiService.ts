import { Destiny2 } from "bungie-api-ts";
import type { DestinyManifestLanguage, DestinyManifestSlice } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import { cacheService } from "./cacheService";

type UsedDestinyManifestSlice = DestinyManifestSlice<(
    "DestinyEnergyTypeDefinition"
    | "DestinyDamageTypeDefinition"
    | "DestinyEquipmentSlotDefinition"
    | "DestinyItemCategoryDefinition"
    | "DestinyItemTierTypeDefinition"
    | "DestinySeasonDefinition"
    | "DestinyInventoryItemDefinition"
    | "DestinyPlugSetDefinition"
    | "DestinyStatDefinition"
    | "DestinySandboxPerkDefinition"
    | "DestinySocketCategoryDefinition"
    | "DestinySocketTypeDefinition"
    | "DestinyPowerCapDefinition"
)[]>;

class DestinyApiService {
    public retrieveManifest = async (language: DestinyManifestLanguage) => {
        // Get manifest metadata
        const manifestInfoPromise = Destiny2.getDestinyManifest(this.makeRequest);
        // const cachedManifestPromise = cacheService.getCachedManifest();
        // const [manifestInfo, cachedManifest] = await Promise.all([manifestInfoPromise, cachedManifestPromise]);
        const manifestInfo = await manifestInfoPromise;
        const cachedManifest: any = null;

        if (cachedManifest) {
            const cachedJsonComponentUrls = cachedManifest.manifestInfo.jsonWorldComponentContentPaths["en"];
            const retrievedJsonComponentUrls = manifestInfo.Response.jsonWorldComponentContentPaths["en"];
            // Apparently the URLs are better for checking the manifest version as they contain a
            // hash of the contents, and sometimes this will change without the actual version changing.
            if (cachedJsonComponentUrls["DestinyInventoryItemDefinition"] === retrievedJsonComponentUrls["DestinyInventoryItemDefinition"]) {
                return cachedManifest.manifestData;
            }
        }

        // Get manifest slices we care about
        const manifestSlice = await Destiny2.getDestinyManifestSlice(this.makeRequest, {
            destinyManifest: manifestInfo.Response,
            language: language,
            tableNames: [
                // Possibly needed for filter
                "DestinyEnergyTypeDefinition",
                "DestinyDamageTypeDefinition",
                "DestinyEquipmentSlotDefinition",
                "DestinyItemCategoryDefinition",
                "DestinyItemTierTypeDefinition",
                "DestinySeasonDefinition",
                // List of items - need to find weapons
                "DestinyInventoryItemDefinition",
                "DestinyPlugSetDefinition",
                "DestinyStatDefinition",
                "DestinySandboxPerkDefinition",
                "DestinySocketCategoryDefinition",
                "DestinySocketTypeDefinition",
                "DestinyPowerCapDefinition",
            ],
        });

        // Remove redacted values
        for (const key in manifestSlice) {
            const table = key as keyof UsedDestinyManifestSlice;
            const component = manifestSlice[table];

            // Add the redacted items to a list as we can't modify a collection while iterating it.
            const itemHashesToRemove: number[] = [];
            for (const hash in component) {
                const item = component[hash];
                if (item.redacted) {
                    itemHashesToRemove.push(item.hash);
                }
            }

            // Remove redacted items
            for (const hash of itemHashesToRemove) {
                delete component[hash];
            }
        }

        cacheService.setCachedManifest({ manifestInfo: manifestInfo.Response, manifestData: manifestSlice, })
            .catch(err => console.error("Failed to cache manifest.", err));
        return manifestSlice;
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
export const destinyApiService = new DestinyApiService();
