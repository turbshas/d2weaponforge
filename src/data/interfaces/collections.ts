import type { ItemHash } from "./common";

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
