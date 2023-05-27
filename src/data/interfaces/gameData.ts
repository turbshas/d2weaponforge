import type { DestinyDamageTypeDefinition, DestinyItemTierTypeDefinition, DestinySeasonDefinition, DestinyStatDisplayDefinition } from "bungie-api-ts/destiny2";
import type { ItemHash, LookupMap } from "./common";
import type { ICollectionsLists } from "./collections";
import type { ComputedRef, Ref } from "vue";
import type { IPerkInsightCollection } from "./perkInsights";
import type { TraitId } from "./gameValues";

export interface Destiny2GameData {
    damageTypes: DestinyDamageTypeDefinition[];
    itemTierTypes: DestinyItemTierTypeDefinition[];
    seasons: DestinySeasonDefinition[];

    weapons: IWeapon[];
    weaponTypes: IWeaponTypeInfo[];

    perkLookup: IPerkLookup;
    masterworkLookup: LookupMap<ItemHash, IMasterwork>;
    modLookup: LookupMap<ItemHash, IMod>;
    catalystLookup: LookupMap<ItemHash, ICatalyst>;
    sandboxPerkLookup: LookupMap<ItemHash, ISandboxPerk>;

    perkInsights: IPerkInsightCollection;
    collectionsLists: ICollectionsLists;
}

export interface IPerkLookup {
    normal: LookupMap<ItemHash, IPerk>;
    enhanced: LookupMap<ItemHash, IPerk>;
    perkPairs: IPerkPair[];
    /** Keyed by the normal perk hash. */
    perkPairLookup: LookupMap<ItemHash, IPerkPair>;
}

export interface IPerkPair {
    perk: ItemHash;
    enhanced: ItemHash | undefined;
}

export type PerkColumnNumber = 1 | 2 | 3 | 4 | 5;
export type ISelectedPerkMap<T> = { [column in keyof PerkColumnNumber as PerkColumnNumber]: T | undefined };

export interface ISelectedGear {
    weapon: Ref<IWeapon | undefined>;
    perkOptionsMap: Ref<ISelectedPerkMap<ISelectedPerk>>;
    perkOptionsList: ComputedRef<(ISelectedPerk | undefined)[]>;
    masterwork: Ref<IMasterwork | undefined>;
    mod: Ref<IMod | undefined>;
    catalyst: Ref<ICatalyst | undefined>;

    modifiedWeaponStats: ComputedRef<IModifiedStat[]>;
    modifiedWeaponDisplayStats: ComputedRef<IModifiedStat[]>;
}

export interface ISelectedPerk {
    perkOption: IPerkOption;
    useEnhanced: boolean;
}

export interface IModifiedStat {
    index: number;
    statHash: number;
    statName: string;
    statDisplay: DestinyStatDisplayDefinition | undefined;
    /** Whether the stat modification was good or bad. */
    isBenefit: boolean;
    baseStat: number;
    modifiedStat: number;
}

export interface IWeapon {
    index: number;
    hash: number;
    name: string;
    description: string;
    itemTypeDisplayName: string;
    screenshotUrl: string;
    iconUrl: string;
    iconWatermarkUrl: string;
    isAdept: boolean;
    isCraftable: boolean;
    isSunset: boolean;
    tierTypeIndex: number;
    traitId: TraitId;
    damageType: IDamageType;
    statBlock: IStatBlock;
    archetype: IArchetype | undefined;
    perks: IPerkGrid;
    curated: IPerkGrid;
    masterworks: ItemHash[];
    mods: ItemHash[];
    catalysts: ItemHash[];
    seasonHash: number | undefined;
}

export interface IDamageType {
    hash: number | undefined;
    name: string;
    iconUrl: string;
}

export interface IStatBlock {
    statInfos: IStatInfo[];
}

export interface IStatInfo {
    index: number;
    statHash: number;
    statName: string;
    investmentValue: number;
    statDisplay: DestinyStatDisplayDefinition | undefined;
}

export interface IArchetype {
    intrinsicPerkHash: ItemHash;
    rpmStatHash: ItemHash | undefined;
    rpmStatValue: number | undefined;
    rpmUnits: string;
}

export interface IPerkGrid {
    perkColumns: IPerkColumn[];
}

export interface IPerkColumn {
    perks: IPerkOption[];
}

export interface IPerkOption {
    craftingInfo: ICraftingInfo | undefined,
    currentlyCanRoll: boolean,
    perk: ItemHash;
    enhancedPerk: ItemHash | undefined;
}

export interface ICraftingInfo {
    requiredLevel: number | undefined;
    requiredLevelEnhanced: number | undefined;
}

export interface IPerk {
    hash: number;
    name: string;
    description: string;
    itemTypeDisplayName: string;
    iconUrl: string;
    iconWatermarkUrl: string;
    mainBonuses: IPerkBonus[];
    adeptOrCraftedBonuses: IPerkBonus[];
    categoryId: string;
}

export interface IPerkBonus {
    statHash: number;
    statName: string;
    value: number;
}

export interface IMasterwork extends IPerk { }
export interface IMod extends IPerk { }
export interface ICatalyst extends IPerk {
    sandboxPerks: ItemHash[];
    unlockRequirements: ICatalystUnlockRequirement[];
}

export interface ISandboxPerk {
    index: number;
    hash: ItemHash;
    name: string;
    description: string;
    iconUrl: string;
    damageTypeHash?: ItemHash;
}

export interface ICatalystUnlockRequirement {
    description: string;
    completionValue: number;
}

export interface IWeaponTypeInfo {
    /** User-friendly name of the weapon type. */
    weaponTypeName: string;
    /** The trait ID from @see {@link DestinyItemCategoryDefinition.traitId} that matches this weapon type. */
    traitId: TraitId;
    /** The hash of the weapon type's category, from @see {@link DestinyItemCategoryDefinition.hash}. */
    weaponCategoryHash: number;
    /** Whether to show the RPM value in the filter. */
    showRpm: boolean;
    /** Whether to use the RPM to compare between archetypes. If not, just the name of the intrinsic perk is used. */
    compareUsingRpm: boolean;
    /** The units that the RPM value is in, e.g. RPM or ms. */
    rpmUnits: string;
    archetypes: IArchetypeInfo[];
}

export interface IArchetypeInfo {
    /** Trait ID of the weapon archetype. */
    weaponType: string;
    /** Hash of the archetype's intrinsic perk. */
    hash: ItemHash;
    /** Name of the archetype's intrinsic perk. */
    name: string;
    /** The RPM of the archetype, or equivalent. */
    rpm: number;
    /** The hash of the stat used to get the RPM. */
    statHash: number;
}
