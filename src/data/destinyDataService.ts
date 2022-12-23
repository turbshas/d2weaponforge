import type {
    DestinyInventoryItemDefinition,
    DestinyPlugSetDefinition,
    DestinyPlugWhitelistEntryDefinition,
} from "bungie-api-ts/destiny2/interfaces";
import { reactive } from "vue";
import { destinyApiService } from "./destinyApiService";
import { DataSearchString, ItemTierIndex, type IWeapon, type Destiny2GameData, type IPerkOption, type IPerkSlotOptions } from "./types";
import { findItemInTable } from "./util";

type GameDataReactiveWrapper = { gameData: Destiny2GameData | null, weapons: IWeapon[], weaponLookup: { [hash: number]: IWeapon | undefined } };

class DestinyDataService {
    private initialized: boolean = false;
    public manifestLoaded: Promise<void> | null = null;

    private gameDataReactiveWrapper: GameDataReactiveWrapper = reactive<GameDataReactiveWrapper>({ gameData: null, weapons: [], weaponLookup: {}, });

    public get gameData() {
        return this.gameDataReactiveWrapper.gameData;
    }

    public get weapons() {
        return this.gameDataReactiveWrapper.weapons;
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

    public get basicItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Basic); }
    public get commonItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Common); }
    public get uncommonItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Uncommon); }
    public get rareItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Rare); }
    public get legendaryItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Legendary); }
    public get exoticItemTier() { return this.itemTiers.find(tier => tier.index === ItemTierIndex.Exotic); }

    public get rpmStatDefinition() {
        return this.gameData ? findItemInTable(this.gameData.statsLookup, i => i.displayProperties.name === DataSearchString.RpmStatName) : undefined;
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

    public getWeapon = (hash: number) => {
        return this.gameDataReactiveWrapper.weaponLookup[hash];
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

    public getSandboxPerkDefinition = (perkHash: number) => {
        return this.gameData?.sandboxPerksLookup[perkHash];
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

    public getIntrinsicForWeapon = (weapon: DestinyInventoryItemDefinition) => {
        const weaponSocketCategories = weapon.sockets?.socketCategories || [];
        const weaponSockets = weapon.sockets?.socketEntries || [];

        const intrinsicSocketCategory = weaponSocketCategories.find(c => this.isIntrinsicPerkSocketCategory(c.socketCategoryHash));
        const intrinsicPerkSocketEntry = intrinsicSocketCategory && intrinsicSocketCategory.socketIndexes.length > 0
            ? weaponSockets[intrinsicSocketCategory.socketIndexes[0]]
            : undefined;

        const intrinsicPlugSet = intrinsicPerkSocketEntry && intrinsicPerkSocketEntry.reusablePlugSetHash
            ? this.getPlugSetDefinition(intrinsicPerkSocketEntry.reusablePlugSetHash)
            : undefined;

        const intrinsicPerk = intrinsicPlugSet && intrinsicPlugSet.reusablePlugItems.length > 0
            ? this.getItemDefinition(intrinsicPlugSet.reusablePlugItems[0].plugItemHash)
            : undefined;
        return intrinsicPerk;
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

        // Either one or the other should be defined of randomizedPlugSetHash and reusablePlugSetHash
        const perkPlugSets = perkSocketsNoTracker.map(ps => this.getPlugSetDefinition(ps.randomizedPlugSetHash || ps.reusablePlugSetHash!));
        const perkSlotOptions = perkPlugSets.map(this.getPerkOptionsFromPlugSet);
        return perkSlotOptions;
    }

    private getPerkOptionsFromPlugSet = (plugSet: DestinyPlugSetDefinition | undefined) => {
        const currentlyCanRollMap: { [plugItemHash: number]: boolean } = {};
        const seenPlugItems: { [plugItemHash: number]: boolean } = {};
        const perksInSlot: DestinyInventoryItemDefinition[] = [];

        // Remove duplicates and group by name to capture normal + enhanced perks together
        for (const plugItem of plugSet?.reusablePlugItems || []) {
            if (seenPlugItems[plugItem.plugItemHash]) continue;
            // TODO: Apparently everything works without this so figure that out
            // seenPlugItems[plugItem.plugItemHash] = true;
            currentlyCanRollMap[plugItem.plugItemHash] = plugItem.currentlyCanRoll;

            const definition = destinyDataService.getItemDefinition(plugItem.plugItemHash);
            if (!definition) continue;
            perksInSlot.push(definition);
        }

        const normalPerks = perksInSlot.filter(p => {
            if (!p.inventory) return false;
            const itemTier = this.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Common;
        });
        const enhancedPerks = perksInSlot.filter(p => {
            if (!p.inventory) return false;
            const itemTier = this.getItemTierDefinition(p.inventory.tierTypeHash);
            return itemTier && itemTier.index === ItemTierIndex.Uncommon;
        });

        const perkOptions: IPerkOption[] = [];
        for (const perk of normalPerks) {
            const enhancedPerk = enhancedPerks.find(p => p.displayProperties.name.includes(perk.displayProperties.name));

            const perkOption: IPerkOption = {
                perk: perk,
                enhancedPerk: enhancedPerk,
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
        const start = Date.now();
        const gameData = await destinyApiService.retrieveManifest("en");
        const end = Date.now();
        console.log("loading manifest took", end - start);
        console.log(gameData);

        this.gameDataReactiveWrapper.gameData = gameData;
        const weapons = gameData.weapons.map<IWeapon>(w => {
            const intrinsic = this.getIntrinsicForWeapon(w);
            const perks = this.getPerkOptionsForWeapon(w);
            return {
                weapon: w,
                intrinsic: intrinsic,
                perks: perks,
            };
        });
        const lookup: { [hash: number]: IWeapon | undefined } = {};
        for (const weapon of weapons) {
            lookup[weapon.weapon.hash] = weapon;
        }
        this.gameDataReactiveWrapper.weapons = weapons;
        this.gameDataReactiveWrapper.weaponLookup = lookup;
    }
}

export const destinyDataService = new DestinyDataService();
