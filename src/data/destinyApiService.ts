import { Destiny2 } from "bungie-api-ts";
import type { DestinyInventoryItemDefinition, DestinyManifestLanguage, DestinyManifestSlice } from "bungie-api-ts/destiny2";
import type { HttpClientConfig } from "bungie-api-ts/http";
import { cacheService } from "./cacheService";
import { DataSearchString, ItemTierIndex, type Destiny2GameData } from "./types";
import { findItemInTable, hashMapToArray } from "./util";

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
        const cachedManifestPromise = cacheService.getCachedManifest();
        const [manifestInfo, cachedManifest] = await Promise.all([manifestInfoPromise, cachedManifestPromise]);

        console.log("manifest info", manifestInfo);

        // /*
        if (cachedManifest) {
            const cachedJsonComponentUrls = cachedManifest.manifestInfo.jsonWorldComponentContentPaths["en"];
            const retrievedJsonComponentUrls = manifestInfo.Response.jsonWorldComponentContentPaths["en"];
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

        const itemCategories = hashMapToArray(manifestSlice.DestinyItemCategoryDefinition);
        const socketCategories = hashMapToArray(manifestSlice.DestinySocketCategoryDefinition);
        const originPerkCategory = itemCategories.find(category => category.displayProperties.name === DataSearchString.WeaponOriginPerkItemCategoryName);
        const weaponIntrinsicCategory = socketCategories.find(category => category.displayProperties.name === DataSearchString.WeaponIntrinsicPerkCategoryName);
        const weaponPerkCategory = socketCategories.find(category => category.displayProperties.name === DataSearchString.WeaponPerkSocketCategoryName);

        const weaponCategories = itemCategories.filter(category => category.displayProperties.name === DataSearchString.WeaponItemCategoryName);
        // Includes anything that modifies an item - perks, mods, masterworks, etc.
        const modCategories = itemCategories.filter(category => category.displayProperties.name === DataSearchString.ModItemCategoryName);
        const weaponCategoryHashes = weaponCategories.map(c => c.hash);
        const modCategoryHashes = modCategories.map(c => c.hash);

        // Remove everything we don't need - this makes loading from cache much faster (and actually usable).
        // Only doing this for DestinyInventoryItemDefinition as it is by far the largest table.
        // The others are fairly small and don't need this.
        const neededItemCategoryHashes = weaponCategoryHashes.concat(modCategoryHashes);
        const itemHashesToRemove: number[] = [];
        for (const key in manifestSlice.DestinyInventoryItemDefinition) {
            const item = manifestSlice.DestinyInventoryItemDefinition[key];
            if (
                (!item.itemCategoryHashes || !item.itemCategoryHashes.some(h => neededItemCategoryHashes.includes(h)))
                &&
                // Some perks don't have any item categories.
                (!item.plug || item.plug.plugCategoryIdentifier !== DataSearchString.FramesPlugCategoryId)
                ) {
                itemHashesToRemove.push(item.hash);
            }
        }
        for (const hash of itemHashesToRemove) {
            delete manifestSlice.DestinyInventoryItemDefinition[hash];
        }

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

        const weapons: DestinyInventoryItemDefinition[] = [];
        for (const key in manifestSlice.DestinyInventoryItemDefinition) {
            const item = manifestSlice.DestinyInventoryItemDefinition[key];
            // No categories, ignore. No display name means it's probably not an item we care about.
            if (!item.itemCategoryHashes || !item.displayProperties.name) continue;

            // Seem to be duplicates for some weapons that don't have a screenshot - this
            // is probably the item used for the crafting menu, so ignore it.
            if (item.itemCategoryHashes.some(h => weaponCategoryHashes.includes(h)) && !!item.screenshot) {
                weapons.push(item);
            }
        }
        // Sort the weapons newest to oldest (roughly).
        // TODO: find a better way to sort, or manually curate the order to show recent weapons.
        weapons.sort((a, b) => b.index - a.index);

        const gameData: Destiny2GameData = {
            damageTypes: hashMapToArray(manifestSlice.DestinyDamageTypeDefinition),
            damageTypesLookup: manifestSlice.DestinyDamageTypeDefinition,
            energyTypes: hashMapToArray(manifestSlice.DestinyEnergyTypeDefinition),
            energyTypesLookup: manifestSlice.DestinyEnergyTypeDefinition,
            equipmentSlots: hashMapToArray(manifestSlice.DestinyEquipmentSlotDefinition),
            equipmentSlotsLookup: manifestSlice.DestinyEquipmentSlotDefinition,
            itemCategories: itemCategories,
            itemCategoriesLookup: manifestSlice.DestinyItemCategoryDefinition,
            itemTierTypes: hashMapToArray(manifestSlice.DestinyItemTierTypeDefinition),
            itemTierTypesLookup: manifestSlice.DestinyItemTierTypeDefinition,
            seasons: hashMapToArray(manifestSlice.DestinySeasonDefinition),
            seasonsLookup: manifestSlice.DestinySeasonDefinition,
            weapons: weapons,

            statsLookup: manifestSlice.DestinyStatDefinition,
            itemLookup: manifestSlice.DestinyInventoryItemDefinition,
            plugSetLookup: manifestSlice.DestinyPlugSetDefinition,
            sandboxPerksLookup: manifestSlice.DestinySandboxPerkDefinition,
            socketCategoryLookup: manifestSlice.DestinySocketCategoryDefinition,
            socketTypeLookup: manifestSlice.DestinySocketTypeDefinition,

            originPerkCategory: originPerkCategory!,
            weaponIntrinsicCategory: weaponIntrinsicCategory!,
            weaponPerkCategory: weaponPerkCategory!,
        };
        // This seems to sort from common -> exotic nicely
        gameData.itemTierTypes.sort((a, b) => a.index - b.index);

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
