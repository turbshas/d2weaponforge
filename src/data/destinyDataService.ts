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
    DestinySeasonDefinition
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

    public getIconUrl = (imgFileName: string) => {
        return `https://www.bungie.net/${imgFileName}`;
    }

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
            ]
        });

        const gameData: Destiny2GameData = {
            manifestMetadata: manifestInfo.Response,
            damageTypes: [],
            damageTypesLookup: manifestSlice.DestinyDamageTypeDefinition,
            energyTypes: [],
            energyTypesLookup: manifestSlice.DestinyEnergyTypeDefinition,
            equipmentSlots: [],
            equipmentSlotsLookup: manifestSlice.DestinyEquipmentSlotDefinition,
            itemCategories: [],
            itemCategoriesLookup: manifestSlice.DestinyItemCategoryDefinition,
            itemTierTypes: [],
            itemTierTypesLookup: manifestSlice.DestinyItemTierTypeDefinition,
            seasons: [],
            seasonsLookup: manifestSlice.DestinySeasonDefinition,
            weapons: [],
            weaponsLookup: {},
        };

        this.convertToArray(gameData.damageTypes, manifestSlice.DestinyDamageTypeDefinition);
        this.convertToArray(gameData.energyTypes, manifestSlice.DestinyEnergyTypeDefinition);
        this.convertToArray(gameData.equipmentSlots, manifestSlice.DestinyEquipmentSlotDefinition);
        this.convertToArray(gameData.itemCategories, manifestSlice.DestinyItemCategoryDefinition);
        this.convertToArray(gameData.itemTierTypes, manifestSlice.DestinyItemTierTypeDefinition);
        this.convertToArray(gameData.seasons, manifestSlice.DestinySeasonDefinition);

        // Get ItemCategoryDefinition for "weapon"
        const weaponCategory = gameData.itemCategories.find(category => category.displayProperties.name === "Weapon");

        // Get list of weapons
        for (const key in manifestSlice.DestinyInventoryItemDefinition) {
            const item = manifestSlice.DestinyInventoryItemDefinition[key];
            if (!item.redacted && item.displayProperties.name && item.itemCategoryHashes && item.itemCategoryHashes.includes(weaponCategory!.hash)) {
                gameData.weapons.push(item);
                gameData.weaponsLookup[key] = item;
            }
        }

        gameData.weapons.sort((a, b) => {
            // const aSeason: DestinySeasonDefinition = gameData.seasonsLookup[a.seasonHash!];
            // const bSeason: DestinySeasonDefinition = gameData.seasonsLookup[b.seasonHash!];
            // return bSeason.seasonNumber - aSeason.seasonNumber;
            return b.index - a.index;
        });
        console.log("weapons", gameData.weapons);

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
