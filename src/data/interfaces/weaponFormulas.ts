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
