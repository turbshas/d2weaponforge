import type {
    DestinyDamageTypeDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyManifestLanguage,
    DestinyManifestSlice,
    DestinyPlugSetDefinition,
    DestinySeasonDefinition,
    DestinySocketCategoryDefinition,
    DestinySocketTypeDefinition,
    DestinyStatDefinition,
    DestinyStatDisplayDefinition,
    DestinyStatGroupDefinition
} from "bungie-api-ts/destiny2";
import type { ComputedRef, Ref } from "vue";

export type UsedDestinyManifestSlice = DestinyManifestSlice<(
    "DestinyDamageTypeDefinition"
    | "DestinyItemCategoryDefinition"
    | "DestinyItemTierTypeDefinition"
    | "DestinySeasonDefinition"
    | "DestinyInventoryItemDefinition"
    | "DestinyPlugSetDefinition"
    | "DestinySandboxPerkDefinition"
    | "DestinyStatDefinition"
    | "DestinyStatGroupDefinition"
    | "DestinySocketCategoryDefinition"
    | "DestinySocketTypeDefinition"
    | "DestinyPowerCapDefinition"
)[]>;

export enum PageSelection {
    Home = "Home",
    Glossary = "Glossary",
    Compare = "Compare",
    Weapon = "Weapon",
}

export enum SidebarPanelSelection {
    Weapons = "Weapons",
    Filters = "Filters",
    Languages = "Languages",
}

export enum StatDisplayType {
    Bar = "Bar",
    Angle = "Angle",
    Number = "Number",
}

export enum ItemTierIndex {
    Basic = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Legendary = 4,
    Exotic = 5,
}

export enum ItemPerkVisibility {
    Visible = 0,
    Disabled = 1,
    Hidden = 2,
}

export interface ILanguageInfo {
    language: DestinyManifestLanguage;
    flagIcon: string;
    text: string;
}

export type FilterCategory = "Damage Type" | "Weapon" | "Archetype" | "Collections" | "Rarity";

export type FilterPredicate = (item: IWeapon) => boolean;

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
}

export interface IArchetypeFilter {
    /** Whatever constitutes as an "RPM" for this weapon type. (Fusion are charge time, bows are draw time, etc.) */
    rpm: number;
    /** The name of the archetype. */
    name: string;
    text: string;
    filter: FilterPredicate;
}

export interface IWeaponFilterButton extends IFilterButton {
    archetypes: IArchetypeFilter[];
}

export interface IAppliedFilters {
    includeSunsetWeapons: boolean;
    collectionsFilters: FilterPredicate[];
    damageFilters: FilterPredicate[];
    rarityFilters: FilterPredicate[];
    weaponFilters: FilterPredicate[];
    perkNames: string[];
}

export interface Destiny2GameData {
    damageTypes: DestinyDamageTypeDefinition[];
    damageTypesLookup: { [hash: number]: DestinyDamageTypeDefinition };

    itemCategories: DestinyItemCategoryDefinition[];
    itemCategoriesLookup: { [hash: number]: DestinyItemCategoryDefinition };

    itemTierTypes: DestinyItemTierTypeDefinition[];
    itemTierTypesLookup: { [hash: number]: DestinyItemTierTypeDefinition };

    seasons: DestinySeasonDefinition[];
    seasonsLookup: { [hash: number]: DestinySeasonDefinition };

    weapons: IWeapon[];
    weaponsLookup: { [weaponHash: number]: IWeapon };

    weaponTypes: IWeaponTypeInfo[];

    statsLookup: { [hash: number]: DestinyStatDefinition };
    statGroupsLookup: { [hash: number]: DestinyStatGroupDefinition };
    itemLookup: { [hash: number]: DestinyInventoryItemDefinition };
    plugSetLookup: { [hash: number]: DestinyPlugSetDefinition };
    socketCategoryLookup: { [hash: number]: DestinySocketCategoryDefinition };
    socketTypeLookup: { [hash: number]: DestinySocketTypeDefinition };
}

export type PerkColumnNumber = 1 | 2 | 3 | 4 | 5;
export type ISelectedPerkMap<T> = { [column in keyof PerkColumnNumber as PerkColumnNumber]: T | undefined };

export interface ISelectedGear {
    weapon: Ref<IWeapon | undefined>;
    perkOptionsMap: Ref<ISelectedPerkMap<IPerkOption>>;
    perkOptionsList: ComputedRef<(IPerkOption | undefined)[]>;
    masterwork: Ref<IMasterwork | undefined>;
    mod: Ref<IMod | undefined>;

    modifiedWeaponStats: ComputedRef<IModifiedStat[]>;
    modifiedWeaponDisplayStats: ComputedRef<IModifiedStat[]>;
}

export interface IModifiedStat {
    index: number;
    statHash: number;
    statName: string;
    statDisplay: DestinyStatDisplayDefinition | undefined;
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
    traitId: string;
    weaponCategoryRegex: string;
    damageType: IDamageType;
    statBlock: IStatBlock;
    archetype: IArchetype | undefined;
    perks: IPerkGrid;
    curated: IPerkGrid;
    masterworks: IMasterwork[];
    mods: IMod[];
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

export interface IArchetype extends IPerk {
    rpmStatHash: number | undefined;
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
    useEnhanced: boolean,
    perk: IPerk;
    enhancedPerk: IPerk | undefined;
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
}

export interface IPerkBonus {
    statHash: number;
    statName: string;
    value: number;
}

export interface IMasterwork extends IPerk { }
export interface IMod extends IPerk { }

export interface IWeaponTypeInfo {
    /** User-friendly name of the weapon type. */
    weaponTypeName: string;
    /** The trait ID of this weapon type (@see {@link DestinyInventoryItemDefinition.traitIds}). */
    traitId: string;
    /** The regex from @see {@link DestinyItemCategoryDefinition.itemTypeRegex} that matches this weapon type. */
    weaponCategoryRegex: string;
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
    /** Name of the archetype's intrinsic perk. */
    name: string;
    /** The RPM of the archetype, or equivalent. */
    rpm: number;
    /** The hash of the stat used to get the RPM. */
    statHash: number;
}

export interface IWeaponRangeValues {
    baseFalloffStart: number;
    hipFireRangePerStat: number;
    zoomAdjustment: number;
}

export enum PerkHashes {
    Adagio = 3673922083,
    AdagioEnhanced = 2889515627,
    AdaptiveMunitions = 1048183818,
    AdaptiveMunitionsEnhanced = 3431277734,
    AdrenalineJunkie = 11612903,
    AdrenalineJunkieEnhanced = 2422968039,
    AirAssault = 3722653512,
    AirAssaultEnhanced = 2898218424,
    Alacrity = 2988596335,
    AlloyMag = 1431678320,
    AmbitiousAssassin = 2010801679,
    AmbitiousAssassinEnhanced = 3797647183,
    ArchersTempo = 201365942,
    ArchersTempoEnhanced = 3523746922,
    ArmorPiercingRounds = 1968497646,
    AssassinsBlade = 354401740,
    AutoLoadingHolster = 3300816228,
    AutoLoadingHolsterEnhanced = 3528046508,
    BackupPlan = 1600092898,
    BaitAndSwitch = 3078487919,
    BaitAndSwitchEnhanced = 3744057135,
    Bitterspite = 4154828211,
    BluntExecutionRounds = 454085387,
    BoxBreathing = 2551157718,
    BoxBreathingEnhanced = 23371658,
    CascadePoint = 3751912585,
    CascadePointEnhanced = 331667533,
    Celerity = 1264398905,
    ChainReaction = 2396489472,
    ChillClip = 2978966579,
    ClassyContender = 1702976605,
    CloseToMelee = 1782407750,
    CloseToMeleeEnhanced = 2241043034,
    ClownCartridge = 2284787283,
    ClownCartridgeEnhanced = 3563868667,
    ClusterBomb = 1275731761,
    ColdSteel = 3650930298,
    CompulsiveReloader = 671806388,
    CompulsiveReloaderEnhanced = 595108252,
    Cornered = 1799762209,
    CorneredEnhanced = 1008128453,
    Counterattack = 3016987351,
    DangerZone = 960810156,
    Demolitionist = 3523296417,
    DemolitionistEnhanced = 1906147653,
    Desperado = 3047969693,
    DisruptionBreak = 1683379515,
    Dragonfly = 2848615171,
    DynamicSwayReduction = 1359896290,
    DynamicSwayReductionEnhanced = 3060983774,
    EagerEdge = 2077819806,
    EagerEdgeEnhanced = 1618208178,
    ElementalCapacitor = 3511092054,
    Encore = 1195158366,
    EncoreEnhanced = 838873202,
    EnergyTransfer = 2030760728,
    EnGarde = 1685431615,
    Ensemble = 2621346526,
    EnsembleEnhanced = 2495011826,
    ExplosiveHead = 3365897133,
    ExplosiveLight = 3194351027,
    ExplosiveLightEnhanced = 2275087323,
    ExplosivePayload = 3038247973,
    EyeOfTheStorm = 699525795,
    FeedingFrenzy = 2779035018,
    FieldPrep = 2869569095,
    Firefly = 3824105627,
    FiringLine = 1771339417,
    FiringLineEnhanced = 395388285,
    FirmlyPlanted = 280464955,
    FlashCounter = 2244851822,
    FocusedFury = 2896038713,
    FocusedFuryEnhanced = 2402480669,
    FourthTimesTheCharm = 1354429876,
    FourthTimesTheCharmEnhanced = 848860060,
    FragileFocus = 2451262963,
    FragileFocusEnhanced = 1609056795,
    Frenzy = 4104185692,
    FrenzyEnhanced = 3007133316,
    FullAutoTriggerSystem = 2117683199,
    FullChoke = 1047830412,
    FullCourt = 2888557110,
    Genesis = 3096702027,
    GenesisEnhanced = 1658784563,
    GoldenTricorn = 2610012052,
    GoldenTricornEnhanced = 4290541820,
    GraveRobber = 1631667848,
    GutShotStraight = 1365187766,
    GutShotStraightEnhanced = 4200236906,
    HäkkeBreachArmaments = 1607056502,
    Harmony = 438098033,
    HarmonyEnhanced = 2748801589,
    Headseeker = 460017080,
    Headstone = 124408337,
    HeatingUp = 1570042021,
    HeatingUpEnhanced = 2748258257,
    HighCaliberRounds = 1561002382,
    HighImpactReserves = 2213355989,
    HighImpactReservesEnhanced = 2002547233,
    HipFireGrip = 1866048759,
    ImmovableObject = 3800201097,
    ImmovableObjectEnhanced = 3674673997,
    ImpactCasing = 3796465595,
    ImpulseAmplifier = 951095735,
    Incandescent = 4293542123,
    IncandescentEnhanced = 2675184851,
    InvaderTracker = 515704826,
    Kickstart = 1754714824,
    KillClip = 1015611457,
    KillClipEnhanced = 2923251173,
    KillingTally = 557221067,
    KillingWind = 2450788523,
    LandTank = 1536798515,
    LastingImpression = 3927722942,
    LeadFromGold = 1556840489,
    LeadFromGoldEnhanced = 3442762221,
    MovingTarget = 588594999,
    Mulligan = 3513791699,
    MulliganEnhanced = 162561147,
    MultiKillClip = 2458213969,
    MultiKillClipEnhanced = 2570477205,
    NoDistractions = 2866798147,
    OffhandStrike = 2416023159,
    OmolonFluidDynamics = 2839173408,
    OneForAll = 4049631843,
    OneForAllEnhanced = 859780267,
    OneQuietMoment = 4091460919,
    OneTwoPunch = 2679249093,
    OneTwoPunchEnhanced = 788178929,
    OpeningShot = 47981717,
    Outlaw1 = 1168162263,
    Outlaw2 = 1528281896,
    Overflow = 3643424744,
    OverflowEnhanced = 2682205016,
    PerfectFloat = 2272927194,
    PerpetualMotion = 1428297954,
    PerpetualMotionEnhanced = 2014892510,
    PhaseMag = 830282363,
    Psychohack = 79448657,
    Psychohack1 = 1598147670,
    Psychohack2 = 82180537,
    Psychohack3 = 357495645,
    Psychohack4 = 567997816,
    Psychohack5 = 883366072,
    Psychohack6 = 1471995745,
    Psychohack7 = 2171055345,
    Psychohack8 = 3717985200,
    Psychohack9 = 3754350707,
    Pugilist = 691659142,
    PugilistEnhanced = 536173722,
    PulseMonitor = 972757866,
    Quickdraw = 706527188,
    Rampage = 3425386926,
    RampageEnhanced = 288411554,
    Rangefinder = 2846385770,
    RapidHit = 247725512,
    Recombination = 469285294,
    RecombinationEnhanced = 3335686050,
    Reconstruction = 1523832109,
    Redirection = 3201496230,
    RedirectionEnhanced = 1545231802,
    RelentlessStrikes = 1749209109,
    RepulsorBrace = 776531651,
    RepulsorBraceEnhanced = 2541826827,
    ReservoirBurst = 1427256713,
    RewindRounds = 3418782618,
    SeraphRounds = 1140096971,
    ShieldDisorient = 3275789089,
    ShootToLoot = 3700496672,
    SkulkingWolf = 3989629871,
    SleightOfHand = 2172504645,
    SleightOfHandEnhanced = 1172098417,
    Slickdraw = 1821614984,
    Slideshot = 3161816588,
    Slideways = 2039302152,
    SlidewaysEnhanced = 2396422520,
    SnapshotSights = 957782887,
    SneakBow = 908147344,
    Souldrinker = 3363267119,
    SpikeGrenades = 3301904089,
    StatsForAll = 1583705720,
    StatsForAllEnhanced = 1409206216,
    SteadyHands = 509074078,
    Subsistence = 1820235745,
    SubsistenceEnhanced = 4245865861,
    SuccessfulWarmUp = 2652708987,
    SuccessfulWarmUpEnhanced = 617966211,
    SUROSSynergy = 4008116374,
    Surplus = 3436462433,
    Surrounded = 3708227201,
    SurroundedEnhanced = 781192741,
    Swashbuckler = 4082225868,
    SwashbucklerEnhanced = 1161469972,
    SympatheticArsenal = 3350417888,
    SympatheticArsenalEnhanced = 1537607344,
    TapTheTrigger = 1890422124,
    TapTheTriggerEnhanced = 1523649716,
    ThreatDetector = 4071163871,
    Thresh = 2726471870,
    ThreshEnhanced = 1172413778,
    TimedPayload = 1954620775,
    TirelessBlade = 2590710093,
    ToExcess = 1905044254,
    TrenchBarrel = 2360754333,
    TripleTap = 3400784728,
    TripleTapEnhanced = 573122728,
    TunnelVision = 2946784966,
    TurnaboutEnhanced = 2000295559,
    Underdog = 205890336,
    UnderOver = 1870851715,
    UnderPressure = 1645158859,
    Unrelenting = 3108830275,
    UnrelentingEnhanced = 3755250867,
    UnstoppableForce = 2224838837,
    UnstoppableForceEnhanced = 3102670337,
    VanguardsVindication = 744217850,
    VEISTStinger = 3988215619,
    Voltshot = 2173046394,
    VoltshotEnhanced = 1720528630,
    VorpalWeapon = 1546637391,
    WellRounded = 744594675,
    Wellspring = 3592538738,
    WellspringEnhanced = 2675361166,
    WhirlwindBlade = 3913600130,
    ZenMoment = 2387244414,
}

export enum ModHashes {
    RampageSpec = 666440382,
    MajorSpec = 984527513,
    SurroundedSpec = 1471333428,
    TakenSpec = 1513326571,
    DragonflySpec = 1837151577,
    BossSpec = 2788909693,
    MinorSpec = 4091000557,
}

export interface IPerkInsightCollection {
    weaponPerks: IPerkInsights<PerkHashes>;
    weaponMods: IPerkInsights<ModHashes>;
}

export type IPerkInsights<T extends string | number | symbol> = {
    [key in T]: IPerkInsight;
};

export interface IPerkInsight {
    description: string;
}

export enum Collections {
    WorldCurrent,
    WorldOld,
    VanguardOps,
    Crucible,
    Gambit,
    IronBanner,
    TrialsOfOsiris,
    Nightfall,
    Ikelos,
    KingsFall,
    Duality,
    Opulent,
    VowOfTheDisciple,
    ThroneWorld,
    Anniversary,
    VaultOfGlass,
    Europa,
    DeepStoneCrypt,
    Prophecy,
    AltarsOfSorrow,
    PitOfHeresy,
    Dreambane,
    GardenOfSalvation,
    TheDreamingCity,
    LastWish,
    Seraph,
    Plunder,
    Haunted,
    Risen,
    Lost,
    Splicer,
    Chosen,
    Hunt,
    Arrivals,
    Worthy,
}

export type ICollectionsLists = {
    [key in Collections]: number[];
}
