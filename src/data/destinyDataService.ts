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
import { destinyApiService } from "./destinyApiService";
import { DataSearchString, ItemTierIndex, type IPerkOption, type IPerkSlotOptions } from "./types";
import { hashMapToArray } from "./util";

interface Destiny2GameData {
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
    public manifestLoaded: Promise<void> | null = null;

    private gameDataReactiveWrapper: GameDataReactiveWrapper = reactive<GameDataReactiveWrapper>({ gameData: null });

    public get gameData() {
        return this.gameDataReactiveWrapper.gameData;
    }

    public get weapons() {
        return this.gameData ? this.gameData.weapons : [];
    }

    public get damageTypes() {
        return this.gameData ? this.gameData.damageTypes : [];
    }

    public get itemCategories() {
        return this.gameData ? this.gameData.itemCategories : [];
    }

    public get seasons() {
        const sorted = this.gameData ? this.gameData.seasons : []
        sorted.sort((a, b) => b.seasonNumber - a.seasonNumber);
        return sorted;
    }

    public get itemTiers() {
        return this.gameData ? this.gameData.itemTierTypes : [];
    }

    public initialize = async () => {
        if (this.initialized) return;

        this.manifestLoaded = new Promise<void>(async (resolve) => {
            await this.refreshGameData();
            resolve();
        });
        await this.manifestLoaded;

        this.initialized = true;
    }

    public getImageUrl = (imgFileName: string) => {
        return `https://www.bungie.net${imgFileName}`;
    }

    public getDamageType = (hash: number) => {
        return this.gameData?.damageTypesLookup[hash];
    }

    public getStatDefinition = (statHash: number) => {
        return this.gameData?.statsLookup[statHash];
    }

    public getItemDefinition = (itemHash: number) => {
        return this.gameData?.itemLookup[itemHash];
    }

    public getItemCategoryDefinition = (itemCategoryHash: number) => {
        return this.gameData?.itemCategoriesLookup[itemCategoryHash];
    }

    public getItemTierDefinition = (itemTierHash: number) => {
        return this.gameData?.itemTierTypesLookup[itemTierHash];
    }

    public getPlugSetDefinition = (plugSetHash: number) => {
        return this.gameData?.plugSetLookup[plugSetHash];
    }
    
    public getSocketTypeDefinition = (socketTypeHash: number) => {
        return this.gameData?.socketTypeLookup[socketTypeHash];
    }

    public getSocketCategoryDefinition = (socketCategoryHash: number) => {
        return this.gameData?.socketCategoryLookup[socketCategoryHash];
    }

    public isIntrinsicPerkSocketCategory = (perkItemHash: number) => {
        return !!this.gameData && (this.gameData.weaponIntrinsicCategory.hash === perkItemHash);
    }

    public isWeaponPerkSocketCategory = (perkItemHash: number) => {
        return !!this.gameData && (this.gameData.weaponPerkCategory.hash === perkItemHash);
    }

    public isOriginPerkItemCategory = (itemCategoryHash: number) => {
        return !!this.gameData && (this.gameData.originPerkCategory.hash === itemCategoryHash);
    }

    public isTrackerPlugCategory = (plug: DestinyPlugWhitelistEntryDefinition) => {
        return plug.categoryIdentifier === DataSearchString.TrackerCategoryId;
    }

    public getPerkOptionsForWeapon = (weapon: DestinyInventoryItemDefinition) => {
        const weaponSockets = weapon.sockets?.socketEntries || [];
        const weaponSocketCategories = weapon.sockets?.socketCategories || [];

        const weaponPerkSocketCategory = weaponSocketCategories.find(c => this.isWeaponPerkSocketCategory(c.socketCategoryHash));
        const weaponPerkSockets = weaponPerkSocketCategory ? weaponPerkSocketCategory.socketIndexes.map(i => weaponSockets[i]) : [];

        const perkSocketsNoTracker = weaponPerkSockets.filter(s => {
            const type = this.getSocketTypeDefinition(s.socketTypeHash);
            return type && !type.plugWhitelist.some(this.isTrackerPlugCategory);
        });

        // Either one of the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const perkPlugSets = perkSocketsNoTracker.map(ps => this.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
        const perkSlotOptions = perkPlugSets.map(this.getPerkOptionsFromPlugSet);
        return perkSlotOptions;
    }

    private getPerkOptionsFromPlugSet = (plugSet: DestinyPlugSetDefinition | undefined) => {
        const perkOptionsByName: { [name: string]: DestinyInventoryItemDefinition[] } = {};
        const currentlyCanRollMap: { [plugItemHash: number]: boolean } = {};
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of plugSet?.reusablePlugItems || []) {
            if (seenPlugItems[plugItem.plugItemHash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[plugItem.plugItemHash] = plugItem.currentlyCanRoll;

            const definition = destinyDataService.getItemDefinition(plugItem.plugItemHash);
            if (!definition) continue;

            const name = definition.displayProperties.name;
            if (!perkOptionsByName[name]) {
                perkOptionsByName[name] = [definition];
            } else {
                perkOptionsByName[name].push(definition);
            }
        }

        const perkOptions: IPerkOption[] = [];
        for (const key in perkOptionsByName) {
            const options = perkOptionsByName[key];
            const perk = options.find(o => {
                const tier = destinyDataService.getItemTierDefinition(o.inventory!.tierTypeHash);
                return !!tier && (tier.index === ItemTierIndex.Common);
            });
            if (!perk) continue; // If no non-enhanced version, just ignore.

            const perkOption: IPerkOption = {
                perk: perk,
                enhancedPerk: options.find(o => {
                    const tier = destinyDataService.getItemTierDefinition(o.inventory!.tierTypeHash);
                    return !!tier && tier.index === ItemTierIndex.Uncommon;
                }),
                currentlyCanRoll: currentlyCanRollMap[perk.hash],
                useEnhanced: false,
            };
            perkOptions.push(perkOption);
        }

        const slotOptions: IPerkSlotOptions = {
            options: perkOptions,
        };
        return slotOptions;
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

        // Get manifest slices we care about
        const manifestSlice = await destinyApiService.retrieveManifest("en");
        console.log(manifestSlice);
        let perksCategory: DestinySocketCategoryDefinition | null = null;
        for (const key in manifestSlice.DestinySocketCategoryDefinition) {
            const category = manifestSlice.DestinySocketCategoryDefinition[key];
            if (category.displayProperties.name === DataSearchString.WeaponPerkSocketCategoryName) {
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

        const itemCategories = hashMapToArray(manifestSlice.DestinyItemCategoryDefinition);
        const socketCategories = hashMapToArray(manifestSlice.DestinySocketCategoryDefinition);

        // Get ItemCategoryDefinition for "weapon"
        const weaponCategory = itemCategories.find(category => category.displayProperties.name === DataSearchString.WeaponItemCategoryName);
        const originPerkCategory = itemCategories.find(category => category.displayProperties.name === DataSearchString.WeaponOriginPerkItemCategoryName);
        const weaponIntrinsicCategory = socketCategories.find(category => category.displayProperties.name === DataSearchString.WeaponIntrinsicPerkCategoryName);
        const weaponPerkCategory = socketCategories.find(category => category.displayProperties.name === DataSearchString.WeaponPerkSocketCategoryName);

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

        // Get list of weapons
        for (const key in manifestSlice.DestinyInventoryItemDefinition) {
            const item = manifestSlice.DestinyInventoryItemDefinition[key];
            if (item.redacted) continue;

            if (item.displayProperties.name && item.itemCategoryHashes && item.itemCategoryHashes.includes(weaponCategory!.hash)) {
                gameData.weapons.push(item);
                gameData.weaponsLookup[key] = item;
            }
        }

        gameData.weapons = gameData.weapons.filter(w => !!w.screenshot);// TODO: weapons without screenshots are presumably crafting menu items?
        gameData.weapons.sort((a, b) => b.index - a.index);
        // gameData.weapons.sort((a, b) => {
        //     const seasonA = a.seasonHash ? gameData.seasonsLookup[a.seasonHash] : undefined;
        //     const seasonB = b.seasonHash ? gameData.seasonsLookup[b.seasonHash!] : undefined;
        //     const seasonNumberA = seasonA ? seasonA.seasonNumber : -1;
        //     const seasonNumberB = seasonB ? seasonB.seasonNumber : -1;
        //     return seasonNumberB - seasonNumberA;
        // });
        console.log("weapons", gameData.weapons);

        this.gameDataReactiveWrapper.gameData = gameData;
    }
}

export const destinyDataService = new DestinyDataService();
