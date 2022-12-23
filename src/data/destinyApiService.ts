import { Destiny2 } from "bungie-api-ts";
import type { DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import { cacheService } from "./cacheService";
import { DestinyManifestProcessor } from "./destinyManifestProcessor";
import type { Destiny2GameData, IWeapon } from "./types";

class DestinyApiService {
    public retrieveManifest = async (language: DestinyManifestLanguage) => {
        // Get manifest metadata
        const manifestInfoPromise = Destiny2.getDestinyManifest(this.makeRequest);
        const cachedManifestPromise = cacheService.getCachedManifest();
        const [manifestInfo, cachedManifest] = await Promise.all([manifestInfoPromise, cachedManifestPromise]);

        console.log("manifest info", manifestInfo);

        /*
        if (cachedManifest) {
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

        console.log(manifestSlice);

        const manifestProcessor = new DestinyManifestProcessor(manifestSlice);

        const weapons = manifestProcessor.weapons;
        const weaponsLookup: { [weaponItemHash: number]: IWeapon } = {};
        for (const weapon of weapons) {
            weaponsLookup[weapon.weapon.hash] = weapon;
        }

        const gameData: Destiny2GameData = {
            damageTypes: manifestProcessor.damageTypes,
            damageTypesLookup: manifestProcessor.damageTypeLookup,
            energyTypes: manifestProcessor.energyTypes,
            energyTypesLookup: manifestProcessor.energyTypeLookup,
            equipmentSlots: manifestProcessor.equipmentSlots,
            equipmentSlotsLookup: manifestProcessor.equipmentSlotsLookup,
            itemCategories: manifestProcessor.itemCategories,
            itemCategoriesLookup: manifestProcessor.itemCategoriesLookup,
            itemTierTypes: manifestProcessor.itemTierTypes,
            itemTierTypesLookup: manifestProcessor.itemTierTypesLookup,
            seasons: manifestProcessor.seasons,
            seasonsLookup: manifestProcessor.seasonsLookup,
            weapons: weapons,
            weaponsLookup: weaponsLookup,

            statsLookup: manifestProcessor.statsLookup,
            itemLookup: manifestProcessor.itemLookup,
            plugSetLookup: manifestProcessor.plugSetLookup,
            sandboxPerksLookup: manifestProcessor.sandboxPerksLookup,
            socketCategoryLookup: manifestProcessor.socketCategoryLookup,
            socketTypeLookup: manifestProcessor.socketTypeLookup,

            originPerkCategory: manifestProcessor.originPerkCategory!,
            weaponIntrinsicCategory: manifestProcessor.weaponIntrinsicCategory!,
            weaponPerkCategory: manifestProcessor.weaponPerkCategory!,
        };

        console.log("weapons", gameData.weapons);

        cacheService.setCachedManifest({ manifestInfo: manifestInfo.Response, manifestData: gameData, })
            .catch(err => console.error("Failed to cache manifest.", err));
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
export const destinyApiService = new DestinyApiService();
