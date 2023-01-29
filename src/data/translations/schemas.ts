export interface IArchetypes {
    adaptive: string;
    adaptiveBurst: string;
    aggressive: string;
    aggressiveBurst: string;
    caster: string;
    hakkePrecision: string;
    highImpact: string;
    lightweight: string;
    omolonAdaptive: string;
    pinpointSlug: string;
    precision: string;
    rapidFire: string;
    surosRapidFire: string;
    veistRapidFire: string;
    vortex: string;
    waveFrame: string;
}

export interface ICategoryNames {
    modItem: string;
    weaponIntrinsicPerk: string;
    weaponItem: string;
    weaponModsSocket: string;
    weaponOriginPerk: string;
    weaponPerkSocket: string;
}

export interface IStats {
    accuracyStatName: string;
    aimAssistanceStatName: string;
    airborneEffectivenessStatName: string;
    blastRadiusStatName: string;
    chargeTimeStatName: string;
    drawTimeStatName: string;
    magSizeStatName: string;
    impactStatName: string;
    handlingStatName: string;
    rangeStatName: string;
    recoilDirectionStatName: string;
    reloadSpeedStatName: string;
    rpmStatName: string;
    stabilityStatName: string;
    velocityStatName: string;
    zoomStatName: string;
}

export interface IMisc {
    adept: string;
    harrowed: string;
    rangefinderPerk: string;
    timelost: string;
}

export interface IDataSearchStrings {
    archetypes: IArchetypes;
    categoryNames: ICategoryNames;
    stats: IStats;
    misc: IMisc;
}
