import type {
    DestinyDamageTypeDefinition,
    DestinyItemCategoryDefinition,
    DestinyItemTierTypeDefinition,
    DestinyManifestLanguage,
    DestinyManifestSlice,
    DestinySeasonDefinition,
    DestinyStatDefinition,
    DestinyStatDisplayDefinition} from "bungie-api-ts/destiny2";
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
    | "DestinyObjectiveDefinition"
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
    /**
     * When the screen is narrow, default is to hide the sidebar and show the weapon viewer.
     * When the screen is wide enough, the sidebar is always displayed so the default is the weapon list.
     */
    Default = "Default",
}

export enum StatDisplayType {
    Bar = "Bar",
    Angle = "Angle",
    Number = "Number",
}

export enum WeaponSocketCategoryHash {
    Intrinsic = 3956125808,
    /** Includes regular perks, origin perks, and trackers. */
    Perks = 4241085061,
    /** Includes mods, masterworks, and maybe red border socket? */
    Mods = 2685412949,
}

export enum ItemTierIndex {
    Basic = 0,
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Legendary = 4,
    Exotic = 5,
}

/** Non-ambient copy of enum. */
export enum SocketPlugSources {
    /** If there's no way we can detect to insert new plugs. */
    None = 0,
    /**
     * Use plugs found in the player's inventory, based on the socket type rules (see
     * DestinySocketTypeDefinition for more info)
     *
     * Note that a socket - like Shaders - can have *both* reusable plugs and inventory
     * items inserted theoretically.
     */
    InventorySourced = 1,
    /**
     * Use the DestinyItemSocketsComponent.sockets.reusablePlugs property to determine
     * which plugs are valid for this socket. This may have to be combined with other
     * sources, such as plug sets, if those flags are set.
     *
     * Note that "Reusable" plugs may not necessarily come from a plug set, nor from
     * the "reusablePlugItems" in the socket's Definition data. They can sometimes be "
     * randomized" in which case the only source of truth at the moment is still the
     * runtime DestinyItemSocketsComponent.sockets.reusablePlugs property.
     */
    ReusablePlugItems = 2,
    /**
     * Use the ProfilePlugSets (DestinyProfileResponse.profilePlugSets) component data
     * to determine which plugs are valid for this socket.
     */
    ProfilePlugSet = 4,
    /**
     * Use the CharacterPlugSets (DestinyProfileResponse.characterPlugSets) component
     * data to determine which plugs are valid for this socket.
     */
    CharacterPlugSet = 8,
}

/** Non-ambient copy of enum. */
export enum ItemPerkVisibility {
    Visible = 0,
    Disabled = 1,
    Hidden = 2,
}

export type ItemHash = number;

/** The value of @see {@link DestinyStatDefinition.index}. Used as if it was a hash. */
export enum StatIndex {
    Accuracy = 17,
    AimAssistance = 30,
    AirborneEffectiveness = 43,
    AmmoCapacity = 40,
    BlastRadius = 21,
    ChargeRate = 19,
    ChargeTime = 18,
    DrawTime = 50,
    GuardEfficiency = 39,
    GuardEndurance = 41,
    GuardResistance = 38,
    Handling = 26,
    Impact = 15,
    InventorySize = 25,
    MagSize = 24,
    Range = 16,
    RecoilDirection = 31,
    ReloadSpeed = 27,
    Rpm = 14,
    ShieldDuration = 42,
    Stability = 22,
    SwingSpeed = 37,
    Velocity = 20,
    Zoom = 32,
}

export enum TraitId {
    Weapon =            "item.weapon",
    AutoRifle =         "item.weapon.auto_rifle",
    Bow =               "item.weapon.bow",
    FusionRifle =       "item.weapon.fusion_rifle",
    Glaive =            "item.weapon.glaive",
    GrenadeLauncher =   "item.weapon.grenade_launcher",
    HandCannon =        "item.weapon.hand_cannon",
    LinearFusion =      "item.weapon.linear_fusion_rifle",
    MachineGun =        "item.weapon.machinegun",
    PulseRifle =        "item.weapon.pulse_rifle",
    RocketLauncher =    "item.weapon.rocket_launcher",
    ScoutRifle =        "item.weapon.scout_rifle",
    Shotgun =           "item.weapon.shotgun",
    Sidearm =           "item.weapon.sidearm",
    SniperRifle =       "item.weapon.sniper_rifle",
    SubmachineGun =     "item.weapon.submachinegun",
    Sword =             "item.weapon.sword",
    TraceRifle =        "item.weapon.trace_rifle",
    ExoticCatalyst =    "item.exotic_catalyst",
}

export type LookupMap<K extends string | number | symbol, V> = { [key in K]?: V };

export interface ILanguageInfo {
    language: DestinyManifestLanguage;
    flagIcon: string;
    text: string;
}

export type FilterCategory = "Damage Type" | "Weapon" | "Archetype" | "Collections" | "Rarity" | "Misc";

export type FilterPredicate = (item: IWeapon) => boolean;

export interface ISelectedFilters {
    includeSunset: boolean;
    selectedPerks: LookupMap<string, IPerkFilterInfo>;
    selectedFiltersMap: Record<FilterCategory, LookupMap<string, IFilterButton>>;
}

export interface IPerkFilterInfo {
    name: string;
    /** There are some duplicate perks with different hashes but the same name. */
    perkHashes: ItemHash[];
}

export interface IFilterButton {
    text: string;
    iconUrl: string;
    filter: FilterPredicate;
}

export interface IArchetypeFilter extends IFilterButton {
    /** Whatever constitutes as an "RPM" for this weapon type. (Fusion are charge time, bows are draw time, etc.) */
    rpm: number;
    /** The name of the archetype. */
    name: string;
}

export interface IWeaponFilterButton extends IFilterButton {
    archetypes: IArchetypeFilter[];
}

export interface IAppliedFilters {
    includeSunsetWeapons: boolean;
    perkFilter: FilterPredicate | undefined;
    collectionsFilters: FilterPredicate[];
    damageFilters: FilterPredicate[];
    miscFilters: FilterPredicate[];
    rarityFilters: FilterPredicate[];
    weaponFilters: FilterPredicate[];
    perkNames: string[];
}

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

export interface IWeaponRangeValues {
    /** Distance where damage falloff starts at 0 range. */
    baseFalloffStart: number;
    /** Distance where damage falloff bottoms out (stops). */
    falloffEnd: number;
    /** Distance gained to the damage falloff start per point of range stat. */
    hipFireStartPerStat: number;
    /** Distance gained to the damage falloff end per point of range stat. */
    hipFireEndPerStat: number;
}

/** Constants of a quadratic equation. */
export interface IWeaponReloadValues {
    /** The x^2 constant. */
    a: number;
    /** The x^1 constant. */
    b: number;
    /** The x^0 constant. */
    c: number;
    /**
     * Percentage of time through the reload animation where ammo loads into the magazine,
     * as a decimal in the range (0, 1).
     * A value of 0 indicates the ammo loading takes the entire length of the animation.
     */
    ammoTime: number;
}

/** Weapon handling formula values as constants of a line equation. */
export interface IWeaponHandlingEquation {
    /** The slope (m) of the line. */
    valuePerPoint: number;
    /** The offset (b) of the line. */
    offset: number;
}

export interface IWeaponHandlingValues {
    ready: IWeaponHandlingEquation;
    stow: IWeaponHandlingEquation;
    ads: IWeaponHandlingEquation;
}

/** Constants of a quadratic equation. */
export interface IMagSizeEquation {
    /** The x^2 constant. */
    a: number;
    /** The x^1 constant. */
    b: number;
    /** The x^0 constant. */
    c: number;
}

export interface IWeaponAmmoSizeValues {
    mag: IMagSizeEquation;
    reservesCalc: (rawMagSize: number, magStat: number, inventorySizeStat: number) => number;
}

export interface IWeaponFormulaOverrides {
    range?: IWeaponRangeValues;
    reload?: IWeaponReloadValues;
    handling?: IWeaponHandlingValues;
    ammo?: IWeaponAmmoSizeValues;
}

/** The hash of every perk. */
export enum PerkHash {
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
    DesperadoEnhanced = 624891305,
    DisruptionBreak = 1683379515,
    Dragonfly = 2848615171,
    DropMag = 4134353779,
    DuelistsTrance = 3705817207,
    DuelistsTranceEnhanced = 1646437399,
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
    FeedingFrenzyEnhanced = 1171147302,
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
    KeepAway = 3619207468,
    Kickstart = 1754714824,
    KillClip = 1015611457,
    KillClipEnhanced = 2923251173,
    KillingTally = 557221067,
    KillingWind = 2450788523,
    KineticTremors = 3891536761,
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
    OutlawEnhanced = 1347741687,
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
    ReconstructionEnhanced = 461595545,
    Redirection = 3201496230,
    RedirectionEnhanced = 1545231802,
    RelentlessStrikes = 1749209109,
    RepulsorBrace = 776531651,
    RepulsorBraceEnhanced = 2541826827,
    ReservoirBurst = 1427256713,
    RewindRounds = 3418782618,
    SeraphRounds = 1140096971,
    ShatteringBlade = 818211479,
    ShieldDisorient = 3275789089,
    ShootToLoot = 3700496672,
    ShotSwap = 2586829431,
    SkulkingWolf = 3989629871,
    SleightOfHand = 2172504645,
    SleightOfHandEnhanced = 1172098417,
    Slickdraw = 1821614984,
    SlickdrawEnhanced = 1942880504,
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
    SwapMag = 3721627275,
    Swashbuckler = 4082225868,
    SwashbucklerEnhanced = 1161469972,
    SympatheticArsenal = 3350417888,
    SympatheticArsenalEnhanced = 1537607344,
    TapTheTrigger = 1890422124,
    TapTheTriggerEnhanced = 1523649716,
    TargetLock = 365154968,
    TargetLockEnhanced = 2939589096,
    ThreatDetector = 4071163871,
    ThreatDetectorEnhanced = 494941759,
    Thresh = 2726471870,
    ThreshEnhanced = 1172413778,
    TiltingAtWindmills = 3526486541,
    TiltingAtWindmillsEnhanced = 1738338041,
    TimedPayload = 1954620775,
    TirelessBlade = 2590710093,
    ToExcess = 1905044254,
    TrenchBarrel = 2360754333,
    TripleTap = 3400784728,
    TripleTapEnhanced = 573122728,
    TunnelVision = 2946784966,
    Turnabout = 2209918983,
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

export enum ModHash {
    MajorSpec = 984527513,
    TakenSpec = 1513326571,
    BossSpec = 2788909693,
    MinorSpec = 4091000557,
}

export interface IPerkInsightCollection {
    weaponPerks: IPerkInsights<PerkHash>;
    weaponMods: IPerkInsights<ModHash>;
}

export type IPerkInsights<T extends string | number | symbol> = LookupMap<T, IPerkInsight>;

export interface IPerkInsight {
    description: string;
}

export enum Collection {
    WorldCurrent = "WorldCurrent",
    WorldOld = "WorldOld",

    VanguardOps = "VanguardOps",
    Crucible = "Crucible",
    Gambit = "Gambit",
    IronBanner = "IronBanner",
    TrialsOfOsiris = "TrialsOfOsiris",
    Nightfall = "Nightfall",

    Ikelos = "Ikelos",

    KingsFall = "KingsFall",

    Duality = "Duality",
    Opulent = "Opulent",

    VowOfTheDisciple = "VowOfTheDisciple",
    ThroneWorld = "ThroneWorld",

    Anniversary = "Anniversary",

    VaultOfGlass = "VaultOfGlass",

    Europa = "Europa",
    DeepStoneCrypt = "DeepStoneCrypt",
    Prophecy = "Prophecy",

    AltarsOfSorrow = "AltarsOfSorrow",
    PitOfHeresy = "PitOfHeresy",
    Dreambane = "Dreambane",
    GardenOfSalvation = "GardenOfSalvation",

    TheDreamingCity = "TheDreamingCity",
    LastWish = "LastWish",

    Seraph = "Seraph",
    Plunder = "Plunder",
    Haunted = "Haunted",
    Risen = "Risen",
    Lost = "Lost",
    Splicer = "Splicer",
    Chosen = "Chosen",
    Hunt = "Hunt",
    Arrivals = "Arrivals",
    Worthy = "Worthy",

    Dawn = "Dawn",
    Undying = "Undying",
    Opulence = "Opulence",
    Drifter = "Drifter",
    Forge = "Forge",
    Outlaw = "Outlaw",
    Warmind = "Warmind",
    CurseOfOsiris = "CurseOfOsiris",
    TheRedWar = "TheRedWar",
}

export type ICollectionsLists = {
    [key in Collection]: ItemHash[];
}

export type SeasonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |18 | 19;

export interface IInsightDisplay {
    hash: ItemHash;
    name: string;
    iconUrl: string;
    description: string;
}