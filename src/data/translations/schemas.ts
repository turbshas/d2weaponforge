export interface IStats {
    accuracy: string;
    aimAssistance: string;
    airborneEffectiveness: string;
    ammoCapacity: string;
    blastRadius: string;
    chargeRate: string;
    chargeTime: string;
    drawTime: string;
    guardEfficiency: string;
    guardResistance: string;
    handling: string;
    impact: string;
    magSize: string;
    range: string;
    recoilDirection: string;
    reloadSpeed: string;
    rpm: string;
    stability: string;
    swingSpeed: string;
    velocity: string;
    zoom: string;
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
