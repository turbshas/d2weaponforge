import AxiosStatic from "axios";
import { Destiny2 } from "bungie-api-ts";
import type {
    DestinyDamageTypeDefinition,
    DestinyEnergyTypeDefinition,
    DestinyEquipmentSlotDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyManifest,
    DestinyPlugSetDefinition,
    DestinyPlugWhitelistEntryDefinition,
    DestinySandboxPerkDefinition,
    DestinySeasonDefinition,
    DestinySocketCategoryDefinition,
    DestinySocketTypeDefinition,
    DestinyStatDefinition
} from "bungie-api-ts/destiny2/interfaces";
import type { HttpClientConfig } from "bungie-api-ts/http";
import { reactive } from "vue";

interface Destiny2GameData {
    manifestMetadata: DestinyManifest;

    damageTypes: DestinyDamageTypeDefinition[];
    damageTypesLookup: { [hash: number]: DestinyDamageTypeDefinition };

    energyTypes: DestinyEnergyTypeDefinition[];
    energyTypesLookup: { [hash: number]: DestinyEnergyTypeDefinition };

    equipmentSlots: DestinyEquipmentSlotDefinition[];
    equipmentSlotsLookup: { [hash: number]: DestinyEquipmentSlotDefinition };

    itemCategories: DestinyItemCategoryDefinition[];
    itemCategoriesLookup: { [hash: number]: DestinyItemCategoryDefinition };

    itemTierTypes: DestinyItemTierTypeDefinition[];
    itemTierTypesLookup: { [hash: number]: DestinyItemTierTypeDefinition };

    seasons: DestinySeasonDefinition[];
    seasonsLookup: { [hash: number]: DestinySeasonDefinition };

    weapons: DestinyInventoryItemDefinition[];
    weaponsLookup: { [hash: number]: DestinyInventoryItemDefinition };

    statsLookup: { [hash: number]: DestinyStatDefinition };
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    sandboxPerksLookup: { [hash: number]: DestinySandboxPerkDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };

    weaponCategory: DestinyItemCategoryDefinition;
    originPerkCategory: DestinyItemCategoryDefinition;
    weaponIntrinsicCategory: DestinySocketCategoryDefinition;
    weaponPerkCategory: DestinySocketCategoryDefinition;
}

type GameDataReactiveWrapper = { gameData: Destiny2GameData | null };

class DestinyDataService {
    private initialized: boolean = false;
    private client = new AxiosStatic.Axios({});

    private gameDataReactiveWrapper: GameDataReactiveWrapper = reactive<GameDataReactiveWrapper>({ gameData: null });

    public get weapons() {
        return this.gameDataReactiveWrapper.gameData && this.gameDataReactiveWrapper.gameData.weapons;
    }

    public initialize = async () => {
        if (this.initialized) return;

        await this.refreshGameData();

        this.initialized = true;
    }

    public getImageUrl = (imgFileName: string) => {
        return `https://www.bungie.net${imgFileName}`;
    }

    public getDamageType = (hash: number) => {
        return this.gameDataReactiveWrapper.gameData?.damageTypesLookup[hash];
    }

    public getStatDefinition = (statHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.statsLookup[statHash];
    }

    public getItemDefinition = (itemHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.itemLookup[itemHash];
    }

    public getItemCategoryDefinition = (itemCategoryHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.itemCategoriesLookup[itemCategoryHash];
    }

    public getPlugSetDefinition = (plugSetHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.plugSetLookup[plugSetHash];
    }
    
    public getSocketTypeDefinition = (socketTypeHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.socketTypeLookup[socketTypeHash];
    }

    public getSocketCategoryDefinition = (socketCategoryHash: number) => {
        return this.gameDataReactiveWrapper.gameData?.socketCategoryLookup[socketCategoryHash];
    }

    public isIntrinsicPerkSocketCategory = (perkItemHash: number) => {
        if (!this.gameDataReactiveWrapper.gameData) return false;
        return this.gameDataReactiveWrapper.gameData.weaponIntrinsicCategory.hash === perkItemHash;
    }

    public isWeaponPerkSocketCategory = (perkItemHash: number) => {
        if (!this.gameDataReactiveWrapper.gameData) return false;
        return this.gameDataReactiveWrapper.gameData.weaponPerkCategory.hash === perkItemHash;
    }

    public isOriginPerkItemCategory = (itemCategoryHash: number) => {
        if (!this.gameDataReactiveWrapper.gameData) return false;
        return this.gameDataReactiveWrapper.gameData.originPerkCategory.hash === itemCategoryHash;
    }

    public isTrackerPlugCategory = (plug: DestinyPlugWhitelistEntryDefinition) => {
        return plug.categoryIdentifier === "v400.plugs.weapons.masterworks.trackers";
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
    private refreshGameData = async () => {
        // Get manifest metadata
        const manifestInfo = await Destiny2.getDestinyManifest(this.makeRequest);

        // Get manifest slices we care about
        const manifestSlice = await Destiny2.getDestinyManifestSlice(this.makeRequest, {
            destinyManifest: manifestInfo.Response,
            language: "en",
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
            ],
        });
        console.log(manifestSlice);
        let perksCategory: DestinySocketCategoryDefinition | null = null;
        for (const key in manifestSlice.DestinySocketCategoryDefinition) {
            const category = manifestSlice.DestinySocketCategoryDefinition[key];
            if (category.displayProperties.name === "WEAPON PERKS") {
                console.log("found perks category", category);
                perksCategory = category;
                break;
            }
        }

        const perkTypes: DestinySocketTypeDefinition[] = [];
        if (perksCategory) {
            for (const key in manifestSlice.DestinySocketTypeDefinition) {
                const type = manifestSlice.DestinySocketTypeDefinition[key];
                if (type.socketCategoryHash === perksCategory.hash) {
                    perkTypes.push(type);
                }
            }
        }
        console.log("perk infos", perksCategory, perkTypes);

        const itemCategories: DestinyItemCategoryDefinition[] = [];
        this.convertToArray(itemCategories, manifestSlice.DestinyItemCategoryDefinition);
        const socketCategories: DestinySocketCategoryDefinition[] = [];
        this.convertToArray(socketCategories, manifestSlice.DestinySocketCategoryDefinition);

        // Get ItemCategoryDefinition for "weapon"
        const weaponCategory = itemCategories.find(category => category.displayProperties.name === "Weapon");
        const originPerkCategory = itemCategories.find(category => category.displayProperties.name === "Weapon Mods: Origin Traits");
        const weaponIntrinsicCategory = socketCategories.find(category => category.displayProperties.name == "INTRINSIC TRAITS");
        const weaponPerkCategory = socketCategories.find(category => category.displayProperties.name == "WEAPON PERKS");

        const gameData: Destiny2GameData = {
            manifestMetadata: manifestInfo.Response,

            damageTypes: [],
            damageTypesLookup: manifestSlice.DestinyDamageTypeDefinition,
            energyTypes: [],
            energyTypesLookup: manifestSlice.DestinyEnergyTypeDefinition,
            equipmentSlots: [],
            equipmentSlotsLookup: manifestSlice.DestinyEquipmentSlotDefinition,
            itemCategories: itemCategories,
            itemCategoriesLookup: manifestSlice.DestinyItemCategoryDefinition,
            itemTierTypes: [],
            itemTierTypesLookup: manifestSlice.DestinyItemTierTypeDefinition,
            seasons: [],
            seasonsLookup: manifestSlice.DestinySeasonDefinition,
            weapons: [],
            weaponsLookup: {},

            statsLookup: manifestSlice.DestinyStatDefinition,
            itemLookup: manifestSlice.DestinyInventoryItemDefinition,
            plugSetLookup: manifestSlice.DestinyPlugSetDefinition,
            sandboxPerksLookup: manifestSlice.DestinySandboxPerkDefinition,
            socketCategoryLookup: manifestSlice.DestinySocketCategoryDefinition,
            socketTypeLookup: manifestSlice.DestinySocketTypeDefinition,

            weaponCategory: weaponCategory!,
            originPerkCategory: originPerkCategory!,
            weaponIntrinsicCategory: weaponIntrinsicCategory!,
            weaponPerkCategory: weaponPerkCategory!,
        };

        this.convertToArray(gameData.damageTypes, manifestSlice.DestinyDamageTypeDefinition);
        this.convertToArray(gameData.energyTypes, manifestSlice.DestinyEnergyTypeDefinition);
        this.convertToArray(gameData.equipmentSlots, manifestSlice.DestinyEquipmentSlotDefinition);
        this.convertToArray(gameData.itemTierTypes, manifestSlice.DestinyItemTierTypeDefinition);
        this.convertToArray(gameData.seasons, manifestSlice.DestinySeasonDefinition);

        // Get list of weapons
        for (const key in manifestSlice.DestinyInventoryItemDefinition) {
            const item = manifestSlice.DestinyInventoryItemDefinition[key];
            if (!item.redacted && item.displayProperties.name && item.itemCategoryHashes && item.itemCategoryHashes.includes(weaponCategory!.hash)) {
                gameData.weapons.push(item);
                gameData.weaponsLookup[key] = item;
            }
        }

        gameData.weapons = gameData.weapons.filter(w => !!w.screenshot);// TODO: weapons without screenshots are presumably crafting menu items?
        gameData.weapons.sort((a, b) => b.index - a.index);
        console.log("weapons", gameData.weapons);

        // example of getting perks of a weapon - weapons[1] is taipan, socketEntries[1] is the first entry in the list with randomized plug set hash
        const socketEntry = gameData.weapons[1].sockets!.socketEntries[1];
        const plugSet = manifestSlice.DestinyPlugSetDefinition[socketEntry!.randomizedPlugSetHash!];
        const items = plugSet.reusablePlugItems.map(i => manifestSlice.DestinyInventoryItemDefinition[i.plugItemHash]);
        console.log("test", socketEntry, plugSet, items);

        this.gameDataReactiveWrapper.gameData = gameData;
    }

    private convertToArray = <T>(destination: T[], sourceMap: { [key: number]: T }) => {
        if (!destination || !sourceMap) return;

        for (const key in sourceMap) {
            const value = sourceMap[key];
            if (value) {
                destination.push(value);
            }
        }
    }

    private makeRequest = async (config: HttpClientConfig) => {
        const response = await this.client.request({
            method: config.method,
            url: config.url,
            params: config.params,
            data: config.body,
        });
        return JSON.parse(response.data);
    }
}

export const destinyDataService = new DestinyDataService();
