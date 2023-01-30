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
    stats: IStats;
    misc: IMisc;
}
