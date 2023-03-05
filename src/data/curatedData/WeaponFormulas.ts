import { computed } from "vue";
import type { LookupMap, WeaponCategoryRegex, IWeaponRangeValues, IWeaponReloadValues, IWeaponHandlingValues, IWeaponAmmoSizeValues } from "../interfaces";
import { DataSearchStrings } from "../services";

/** Values from: https://github.com/oh-yes-0-fps/D2_Calculation_API */ 
// TODO: numbers for exotics are different, like vex that acts as an auto rifle
// TODO: override values, like for specific exotics or for archetypes
export const WeaponCategoryRangeValuesMap = computed<LookupMap<WeaponCategoryRegex, IWeaponRangeValues>>(() => {
    return {
        // TODO: some weapons have a "zoom scalar" that is added to the base zoom?
        [DataSearchStrings.WeaponCategoryRegex.AutoRifle]: {
            baseFalloffStart: 11.75,
            falloffEnd: 41.0,
            hipFireStartPerStat: 0.09615,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [DataSearchStrings.WeaponCategoryRegex.FusionRifle]: {
            baseFalloffStart: 10.73,
            falloffEnd: 14.705,
            hipFireStartPerStat: 0.0404,
            hipFireEndPerStat: 0.318,
        } as IWeaponRangeValues,

        // TODO: 120 rpm hand cannons are different
        [DataSearchStrings.WeaponCategoryRegex.HandCannon]: {
            baseFalloffStart: 16.83,
            falloffEnd: 29.67,
            hipFireStartPerStat: 0.0877,
            hipFireEndPerStat: 0.0352,
        } as IWeaponRangeValues,

        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: {
            baseFalloffStart: 28.5,
            falloffEnd: 38.2,
            hipFireStartPerStat: 0.0223,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        // TODO: pulse rifles are all over the place in zoom/"modified zoom multiplier"
        [DataSearchStrings.WeaponCategoryRegex.PulseRifle]: {
            baseFalloffStart: 16.329,
            falloffEnd: 40.4,
            hipFireStartPerStat: 0.07378,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        // TODO: aggressive scouts (120rpm) are different
        [DataSearchStrings.WeaponCategoryRegex.ScoutRifle]: {
            baseFalloffStart: 30.25,
            falloffEnd: 60.75,
            hipFireStartPerStat: 0.1568,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        // TODO: slugs are different
        [DataSearchStrings.WeaponCategoryRegex.Shotgun]: {
            baseFalloffStart: 3.77,
            falloffEnd: 14.5,
            hipFireStartPerStat: 0.0294,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [DataSearchStrings.WeaponCategoryRegex.Sidearm]: {
            baseFalloffStart: 11.85,
            falloffEnd: 22.85,
            hipFireStartPerStat: 0.0295,
            hipFireEndPerStat: 0.0287,
        } as IWeaponRangeValues,

        [DataSearchStrings.WeaponCategoryRegex.SubmachineGun]: {
            baseFalloffStart: 10,
            falloffEnd: 23.35,
            hipFireStartPerStat: 0.07,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: {
            baseFalloffStart: 14.756,
            falloffEnd: 35.9,
            hipFireStartPerStat: 0.1017,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,
    };
});

export const WeaponCategoryReloadValuesMap = computed<LookupMap<WeaponCategoryRegex, IWeaponReloadValues>>(() => {
    return {
        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.AutoRifle]: {
            a: 0.0000855689,
            b: -0.0242021,
            c: 2.80673006666667,
            ammoTime: 0,
        } as IWeaponReloadValues,

        [DataSearchStrings.WeaponCategoryRegex.Bow]: {
            a: 0.00006152,
            b: -0.00125,
            c: 1.1,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.FusionRifle]: {
            a: 0.0000615281,
            b: -0.0198054,
            c: 2.82857040000000,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // TODO: these are heavy number, also need numbers for special
        [DataSearchStrings.WeaponCategoryRegex.GrenadeLauncher]: {
            a: 0.0000755233,
            b: -0.0248947,
            c: 4.12880153333333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.HandCannon]: {
            a: 0.000129019,
            b: -0.0363945,
            c: 4.19575,
            ammoTime: 0.71,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.LinearFusion]: {
            a: 0.0000588462,
            b: -0.0199884,
            c: 2.87206463333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: {
            a: 0.0000905351,
            b: -0.0305819,
            c: 6.12199050000000,
            ammoTime: 0.65,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.PulseRifle]: {
            a: 0.0000926208,
            b: -0.0256877,
            c: 2.92627266666667,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.RocketLauncher]: {
            a: 0.000103959,
            b: -0.0252069,
            c: 4.09182213333333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.ScoutRifle]: {
            a: 0.000102915,
            b: -0.0276889,
            c: 3.11797356666666,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Shotgun]: {
            a: 0.0000640462,
            b: -0.0141721,
            c: 1.25061,
            ammoTime: 0,
        } as IWeaponReloadValues,

        [DataSearchStrings.WeaponCategoryRegex.Sidearm]: {
            a: 0.0000238311,
            b: -0.0124553,
            c: 2.14667245000000,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.SniperRifle]: {
            a: 0.0000674498,
            b: -0.0231542,
            c: 3.8384,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.SubmachineGun]: {
            a: 0.0000608642,
            b: -0.0191345,
            c: 2.62769,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Glaive]: {
            a: 0.0,
            b: -0.0175,
            c: 3.5,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: {
            a: 0.00005,
            b: -0.0155,
            c: 2.65,
            ammoTime: 0,
        } as IWeaponReloadValues,
    };
});

export const WeaponCategoryHandlingValuesMap = computed<LookupMap<WeaponCategoryRegex, IWeaponHandlingValues>>(() => {
    return {
        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.AutoRifle]: {
            ready: { valuePerPoint: -0.00279338, offset: 0.51985381 },
            stow: { valuePerPoint: -0.00268436, offset: 0.48414822 },
            ads: { valuePerPoint: -0.001875,   offset: 0.38975    },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Bow]: {
            ready: { valuePerPoint: -0.002909930716, offset: 0.7364549654 },
            stow: { valuePerPoint: -0.00179330254,  offset: 0.5396466513 },
            ads: { valuePerPoint: -0.001855658199, offset: 0.5293778291 },
        } as IWeaponHandlingValues,

        // TODO: only Vex Mythoclast is different.
        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.FusionRifle]: {
            ready: { valuePerPoint: -0.001448069241, offset: 0.4990612517 },
            stow: { valuePerPoint: -0.002863515313, offset: 0.4445712383 },
            ads: { valuePerPoint: -0.001693741678, offset: 0.4112330226 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.GrenadeLauncher]: {
            ready: { valuePerPoint: -0.00272791, offset: 0.55133684 },
            stow: { valuePerPoint: -0.00232786, offset: 0.48726765 },
            ads: { valuePerPoint: -0.00187072, offset: 0.50019128 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.HandCannon]: {
            ready: { valuePerPoint: -0.002942857143, offset: 0.4782571429 },
            stow: { valuePerPoint: -0.002952380952, offset: 0.5133809524 },
            ads: { valuePerPoint: -0.001666666667, offset: 0.3316666667 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.LinearFusion]: {
            ready: { valuePerPoint: -0.001448069241, offset: 0.4990612517 },
            stow: { valuePerPoint: -0.002863515313, offset: 0.4445712383 },
            ads: { valuePerPoint: -0.001693741678, offset: 0.4112330226 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: {
            ready: { valuePerPoint: -0.002391721353, offset: 0.4950499748 },
            stow: { valuePerPoint: -0.002041393236, offset: 0.4547501262 },
            ads: { valuePerPoint: -0.001234477537, offset: 0.4574687027 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.PulseRifle]: {
            ready: { valuePerPoint: -0.00312085, offset: 0.54370932 },
            stow: { valuePerPoint: -0.00355450, offset: 0.55005845 },
            ads: { valuePerPoint: -0.00196208, offset: 0.45746870 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.RocketLauncher]: {
            ready: { valuePerPoint: -0.003998740554, offset: 0.6635944584 },
            stow: { valuePerPoint: -0.003296509536, offset: 0.5463332134 },
            ads: { valuePerPoint: -0.002139258726, offset: 0.5289841670 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.ScoutRifle]: {
            ready: { valuePerPoint: -0.002853368560, offset: 0.540561867 },
            stow: { valuePerPoint: -0.002941215324, offset: 0.527217745 },
            ads: { valuePerPoint: -0.001693527081, offset: 0.4114236019 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Shotgun]: {
            ready: { valuePerPoint: -0.003271255061, offset: 0.5388744939 },
            stow: { valuePerPoint: -0.003388663968, offset: 0.5711336032 },
            ads: { valuePerPoint: -0.002338056680, offset:0.451194332 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Sidearm]: {
            ready: { valuePerPoint: -0.00264010989, offset: 0.4232582418 },
            stow: { valuePerPoint: -0.00197527473, offset: 0.4298956044 },
            ads: { valuePerPoint: -0.00222939560, offset: 0.3435796703 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.SniperRifle]: {
            ready: { valuePerPoint: -0.002623944983, offset: 0.5079465458 },
            stow: { valuePerPoint: -0.002083932479, offset: 0.4392525789 },
            ads: { valuePerPoint: -0.00194998437, offset: 0.5021325414 },
        } as IWeaponHandlingValues,

        // TODO: striga is different
        [DataSearchStrings.WeaponCategoryRegex.SubmachineGun]: {
            ready: { valuePerPoint: -0.002376970528, offset: 0.4710178204 },
            stow: { valuePerPoint: -0.002547978067, offset: 0.4481295408 },
            ads: { valuePerPoint: -0.001873200822, offset: 0.3581576422 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Sword]: {
            ready: { valuePerPoint: -0.199386, offset: 33.3015 },
            stow: { valuePerPoint: -0.153306, offset: 28.8991 },
            ads: { valuePerPoint: 0, offset: 0, }
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Glaive]: {
            ready: { valuePerPoint: -0.199386, offset: 33.3015 },
            stow: { valuePerPoint: -0.153306, offset: 28.8991 },
            ads: { valuePerPoint: 0, offset: 0, }
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: {
            ready: { valuePerPoint: -0.00279338, offset: 0.51985381 },
            stow: { valuePerPoint: -0.00268436, offset: 0.48414822 },
            ads: { valuePerPoint: -0.001875,   offset: 0.38975    },
        } as IWeaponHandlingValues,
    };
});

// TODO: overrides - exotics and archetypes
// TODO: small MGs (high rpm? idk) have calculates reserves, large MGs are constants (at this time, anyway)
// TODO: levi breath, fusions, small GLs (again, prob rpm?), large GLs, special GLs, linear fusions, large MGs, and lord of wolves are constants
// TODO: xeno, overture, forerunner, eriana's are calculated
export const WeaponCategoryAmmoSizeValuesMap = computed<LookupMap<WeaponCategoryRegex, IWeaponAmmoSizeValues>>(() => {
    return {
        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.Glaive]: {
            mag: {
                a: 0,
                b: 0.035,
                c: 1.75,
            },
            reservesCalc: (_rawMagSize, magStat, inventorySizeStat) => {
                const valuePerPoint = magStat >= 100 ? 0.1681 : 0.1792;
                const offset = magStat >= 100 ? 13.44 : 14.44;

                const reserves = (valuePerPoint * inventorySizeStat) + offset;
                return Math.ceil(reserves);
            },
        } as IWeaponAmmoSizeValues,

        // Note: This is for "small" MGs.
        [DataSearchStrings.WeaponCategoryRegex.MachineGun]: {
            mag: {
                a: 0,
                b: 0.45,
                c: 29.5,
            },
            reservesCalc: (rawMagSize, magStat, inventorySizeStat) => {
                const roundAmount = Math.ceil(rawMagSize) - rawMagSize;
                const offset = (-0.875 + (roundAmount * 2)) * (2 - ((100 - magStat) / 100));

                const totalOffset = 225 + offset;
                const reserves = totalOffset + ((inventorySizeStat * totalOffset) / 100);
                return Math.ceil(reserves);
            },
        } as IWeaponAmmoSizeValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.RocketLauncher]: {
            mag: {
                a: 0,
                b: 0,
                c: 1,
            },
            reservesCalc: (_rawMagSize, _magStat, inventorySizeStat) => {
                const reserves = (inventorySizeStat * 0.05) + 4.5;
                return Math.ceil(reserves);
            },
        } as IWeaponAmmoSizeValues,

        // Note: Same across all archetypes. Lord of Wolves is different.
        [DataSearchStrings.WeaponCategoryRegex.Shotgun]: {
            mag: {
                a: 0,
                b: 0.0375,
                c: 3.625,
            },
            reservesCalc: (rawMagSize, _magStat, inventorySizeStat) => {
                const realMagSize = Math.ceil(rawMagSize);
                const map: { [mag: number]: number | undefined } = {
                    7: 4,
                    6: 9,
                    5: 17,
                    4: 30,
                };
                const baseOffset = map[realMagSize] || 0;

                const base = (baseOffset / 15) + 12;
                const valuePerPoint = 2 / 300;
                const reserves = base + 1 + (valuePerPoint * inventorySizeStat);
                return Math.ceil(reserves);
            },
        } as IWeaponAmmoSizeValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.SniperRifle]: {
            mag: {
                a: 0,
                b: 0.03,
                c: 2.4,
            },
            reservesCalc: (_rawMagSize, magStat, inventorySizeStat) => {
                const valuePerPoint = magStat >= 100 ? 0.14 : 0.12;
                const offset = magStat >= 100 ? 14.0 : 12.0;

                const reserves = (valuePerPoint * inventorySizeStat) + offset;
                return Math.ceil(reserves);
            },
        } as IWeaponAmmoSizeValues,

        // Note: Same across all archetypes.
        [DataSearchStrings.WeaponCategoryRegex.TraceRifle]: {
            mag: {
                a: 0,
                b: 0.3,
                c: 73.99,
            },
            reservesCalc: (rawMagSize, _magStat, inventorySizeStat) => {
                const multiplier = (inventorySizeStat * 0.025) + 3.5;
                return Math.ceil(multiplier * rawMagSize);
            },
        } as IWeaponAmmoSizeValues,
    };
});
