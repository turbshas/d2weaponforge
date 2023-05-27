import { computed } from "vue";
import { type LookupMap, type IWeaponRangeValues, type IWeaponReloadValues, type IWeaponHandlingValues, type IWeaponAmmoSizeValues, type IWeaponFormulaOverrides, type ItemHash, TraitId } from "../interfaces";

/** Values from: https://github.com/oh-yes-0-fps/D2_Calculation_API */ 
export const WeaponCategoryRangeValuesMap = computed(() => {
    const map: LookupMap<TraitId, IWeaponRangeValues> = {
        [TraitId.AutoRifle]: {
            baseFalloffStart: 11.75,
            falloffEnd: 41.0,
            hipFireStartPerStat: 0.09615,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.FusionRifle]: {
            baseFalloffStart: 10.73,
            falloffEnd: 14.705,
            hipFireStartPerStat: 0.0404,
            hipFireEndPerStat: 0.318,
        } as IWeaponRangeValues,

        [TraitId.HandCannon]: {
            baseFalloffStart: 16.83,
            falloffEnd: 29.67,
            hipFireStartPerStat: 0.0877,
            hipFireEndPerStat: 0.0352,
        } as IWeaponRangeValues,

        [TraitId.MachineGun]: {
            baseFalloffStart: 28.5,
            falloffEnd: 38.2,
            hipFireStartPerStat: 0.0223,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.PulseRifle]: {
            baseFalloffStart: 16.329,
            falloffEnd: 40.4,
            hipFireStartPerStat: 0.07378,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.ScoutRifle]: {
            baseFalloffStart: 30.25,
            falloffEnd: 60.75,
            hipFireStartPerStat: 0.1568,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.Shotgun]: {
            baseFalloffStart: 3.77,
            falloffEnd: 14.5,
            hipFireStartPerStat: 0.0294,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.Sidearm]: {
            baseFalloffStart: 11.85,
            falloffEnd: 22.85,
            hipFireStartPerStat: 0.0295,
            hipFireEndPerStat: 0.0287,
        } as IWeaponRangeValues,

        [TraitId.SubmachineGun]: {
            baseFalloffStart: 10,
            falloffEnd: 23.35,
            hipFireStartPerStat: 0.07,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,

        [TraitId.TraceRifle]: {
            baseFalloffStart: 14.756,
            falloffEnd: 35.9,
            hipFireStartPerStat: 0.1017,
            hipFireEndPerStat: 0,
        } as IWeaponRangeValues,
    };
    return map;
});

export const WeaponCategoryReloadValuesMap = computed(() => {
    const map: LookupMap<TraitId, IWeaponReloadValues> = {
        // Note: Same across all archetypes.
        [TraitId.AutoRifle]: {
            a: 0.0000855689,
            b: -0.0242021,
            c: 2.80673006666667,
            ammoTime: 0,
        } as IWeaponReloadValues,

        [TraitId.Bow]: {
            a: 0.00006152,
            b: -0.00125,
            c: 1.1,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.FusionRifle]: {
            a: 0.0000615281,
            b: -0.0198054,
            c: 2.82857040000000,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: these are for heavy GLs (other than Rapid-Fire frames).
        [TraitId.GrenadeLauncher]: {
            a: 0.0000755233,
            b: -0.0248947,
            c: 4.12880153333333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.HandCannon]: {
            a: 0.000129019,
            b: -0.0363945,
            c: 4.19575,
            ammoTime: 0.71,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.LinearFusion]: {
            a: 0.0000588462,
            b: -0.0199884,
            c: 2.87206463333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.MachineGun]: {
            a: 0.0000905351,
            b: -0.0305819,
            c: 6.12199050000000,
            ammoTime: 0.65,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.PulseRifle]: {
            a: 0.0000926208,
            b: -0.0256877,
            c: 2.92627266666667,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.RocketLauncher]: {
            a: 0.000103959,
            b: -0.0252069,
            c: 4.09182213333333,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.ScoutRifle]: {
            a: 0.000102915,
            b: -0.0276889,
            c: 3.11797356666666,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.Shotgun]: {
            a: 0.0000640462,
            b: -0.0141721,
            c: 1.25061,
            ammoTime: 0,
        } as IWeaponReloadValues,

        [TraitId.Sidearm]: {
            a: 0.0000238311,
            b: -0.0124553,
            c: 2.14667245000000,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.SniperRifle]: {
            a: 0.0000674498,
            b: -0.0231542,
            c: 3.8384,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.SubmachineGun]: {
            a: 0.0000608642,
            b: -0.0191345,
            c: 2.62769,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.Glaive]: {
            a: 0.0,
            b: -0.0175,
            c: 3.5,
            ammoTime: 0,
        } as IWeaponReloadValues,

        // Note: Same across all archetypes.
        [TraitId.TraceRifle]: {
            a: 0.00005,
            b: -0.0155,
            c: 2.65,
            ammoTime: 0,
        } as IWeaponReloadValues,
    };
    return map;
});

export const WeaponCategoryHandlingValuesMap = computed(() => {
    const map: LookupMap<TraitId, IWeaponHandlingValues> = {
        // Note: Same across all archetypes.
        [TraitId.AutoRifle]: {
            ready: { valuePerPoint: -0.00279338, offset: 0.51985381 },
            stow: { valuePerPoint: -0.00268436, offset: 0.48414822 },
            ads: { valuePerPoint: -0.001875,   offset: 0.38975    },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.Bow]: {
            ready: { valuePerPoint: -0.002909930716, offset: 0.7364549654 },
            stow: { valuePerPoint: -0.00179330254,  offset: 0.5396466513 },
            ads: { valuePerPoint: -0.001855658199, offset: 0.5293778291 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.FusionRifle]: {
            ready: { valuePerPoint: -0.001448069241, offset: 0.4990612517 },
            stow: { valuePerPoint: -0.002863515313, offset: 0.4445712383 },
            ads: { valuePerPoint: -0.001693741678, offset: 0.4112330226 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.GrenadeLauncher]: {
            ready: { valuePerPoint: -0.00272791, offset: 0.55133684 },
            stow: { valuePerPoint: -0.00232786, offset: 0.48726765 },
            ads: { valuePerPoint: -0.00187072, offset: 0.50019128 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.HandCannon]: {
            ready: { valuePerPoint: -0.002942857143, offset: 0.4782571429 },
            stow: { valuePerPoint: -0.002952380952, offset: 0.5133809524 },
            ads: { valuePerPoint: -0.001666666667, offset: 0.3316666667 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.LinearFusion]: {
            ready: { valuePerPoint: -0.001448069241, offset: 0.4990612517 },
            stow: { valuePerPoint: -0.002863515313, offset: 0.4445712383 },
            ads: { valuePerPoint: -0.001693741678, offset: 0.4112330226 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.MachineGun]: {
            ready: { valuePerPoint: -0.002391721353, offset: 0.4950499748 },
            stow: { valuePerPoint: -0.002041393236, offset: 0.4547501262 },
            ads: { valuePerPoint: -0.001234477537, offset: 0.4574687027 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.PulseRifle]: {
            ready: { valuePerPoint: -0.00312085, offset: 0.54370932 },
            stow: { valuePerPoint: -0.00355450, offset: 0.55005845 },
            ads: { valuePerPoint: -0.00196208, offset: 0.45746870 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.RocketLauncher]: {
            ready: { valuePerPoint: -0.003998740554, offset: 0.6635944584 },
            stow: { valuePerPoint: -0.003296509536, offset: 0.5463332134 },
            ads: { valuePerPoint: -0.002139258726, offset: 0.5289841670 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.ScoutRifle]: {
            ready: { valuePerPoint: -0.002853368560, offset: 0.540561867 },
            stow: { valuePerPoint: -0.002941215324, offset: 0.527217745 },
            ads: { valuePerPoint: -0.001693527081, offset: 0.4114236019 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.Shotgun]: {
            ready: { valuePerPoint: -0.003271255061, offset: 0.5388744939 },
            stow: { valuePerPoint: -0.003388663968, offset: 0.5711336032 },
            ads: { valuePerPoint: -0.002338056680, offset:0.451194332 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.Sidearm]: {
            ready: { valuePerPoint: -0.00264010989, offset: 0.4232582418 },
            stow: { valuePerPoint: -0.00197527473, offset: 0.4298956044 },
            ads: { valuePerPoint: -0.00222939560, offset: 0.3435796703 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.SniperRifle]: {
            ready: { valuePerPoint: -0.002623944983, offset: 0.5079465458 },
            stow: { valuePerPoint: -0.002083932479, offset: 0.4392525789 },
            ads: { valuePerPoint: -0.00194998437, offset: 0.5021325414 },
        } as IWeaponHandlingValues,

        [TraitId.SubmachineGun]: {
            ready: { valuePerPoint: -0.002376970528, offset: 0.4710178204 },
            stow: { valuePerPoint: -0.002547978067, offset: 0.4481295408 },
            ads: { valuePerPoint: -0.001873200822, offset: 0.3581576422 },
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.Sword]: {
            ready: { valuePerPoint: -0.199386, offset: 33.3015 },
            stow: { valuePerPoint: -0.153306, offset: 28.8991 },
            ads: { valuePerPoint: 0, offset: 0, }
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.Glaive]: {
            ready: { valuePerPoint: -0.199386, offset: 33.3015 },
            stow: { valuePerPoint: -0.153306, offset: 28.8991 },
            ads: { valuePerPoint: 0, offset: 0, }
        } as IWeaponHandlingValues,

        // Note: Same across all archetypes.
        [TraitId.TraceRifle]: {
            ready: { valuePerPoint: -0.00279338, offset: 0.51985381 },
            stow: { valuePerPoint: -0.00268436, offset: 0.48414822 },
            ads: { valuePerPoint: -0.001875,   offset: 0.38975    },
        } as IWeaponHandlingValues,
    };
    return map;
});

export const WeaponCategoryAmmoSizeValuesMap = computed(() => {
    const map: LookupMap<TraitId, IWeaponAmmoSizeValues> = {
        [TraitId.FusionRifle]: {
            mag: { a: 0, b: 0, c: 0 },
            reservesCalc: (_rawMagSize, _magStat, _inventorySizeStat) => 21,
        } as IWeaponAmmoSizeValues,

        // Note: Same across all archetypes.
        [TraitId.Glaive]: {
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

        [TraitId.LinearFusion]: {
            mag: { a: 0, b: 0, c: 0 },
            reservesCalc: (_rawMagSize, _magStat, _inventorySizeStat) => 21,
        } as IWeaponAmmoSizeValues,

        // Note: This is for "small" MGs.
        [TraitId.MachineGun]: {
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
        [TraitId.RocketLauncher]: {
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
        [TraitId.Shotgun]: {
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
        [TraitId.SniperRifle]: {
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
        [TraitId.TraceRifle]: {
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
    return map;
});

/** For weapons where range is not applicable or unknown, hides the range calculation. */
const CancelRangeValues: IWeaponRangeValues = {
    baseFalloffStart: 0,
    falloffEnd: 0,
    hipFireStartPerStat: 0,
    hipFireEndPerStat: 0,
};

const CancelRangeOverride: IWeaponFormulaOverrides = {
    range: CancelRangeValues,
};

const SpecialGrenadeLauncherOverrides: IWeaponFormulaOverrides = {
    ammo: {
        mag: { a: 0, b: 0, c: 0 },
        reservesCalc: () => 21,
    },
    reload: {
        a: 0.0000724199,
        b: -0.0216432,
        c: 3.24104606666667,
        ammoTime: 0,
    },
};

const enum ArchetypeOverrideHash {
    GL_Wave = 1395789926,
    GL_Lightweight = 474269988,
    GL_DoubleFire = 1759472859,
    GL_RapidFire = 2353477480,
    GL_Adaptive = 1294026524,
    GL_CompressedWave = 2571259936,
    HC_120RPM = 2757685314,
    MG_RapidFire = 878286503,
    Scout_Aggressive = 3468089894,
    Shotgun_Slug = 918679156,
}

export const WeaponCategoryValuesArchetypeOverrideMap = computed(() => {
    const map: LookupMap<TraitId, LookupMap<ItemHash, IWeaponFormulaOverrides>> = {
        [TraitId.GrenadeLauncher]: {
            // Special GLs
            [ArchetypeOverrideHash.GL_Wave]: SpecialGrenadeLauncherOverrides,
            [ArchetypeOverrideHash.GL_Lightweight]: SpecialGrenadeLauncherOverrides,
            [ArchetypeOverrideHash.GL_DoubleFire]: SpecialGrenadeLauncherOverrides,
        
            // Heavy GLs
            [ArchetypeOverrideHash.GL_RapidFire]: {
                ammo: {
                    mag: { a: 0, b: 0, c: 0 },
                    reservesCalc: () => 20,
                },
            },
            [ArchetypeOverrideHash.GL_Adaptive]: {
                ammo: {
                    mag: { a: 0, b: 0, c: 0 },
                    reservesCalc: () => 18,
                },
            },
            [ArchetypeOverrideHash.GL_CompressedWave]: {
                ammo: {
                    mag: { a: 0, b: 0, c: 0 },
                    reservesCalc: () => 18,
                },
            },
        },

        [TraitId.HandCannon]: {
            [ArchetypeOverrideHash.HC_120RPM]: {
                range: {
                    baseFalloffStart: 18.65,
                    falloffEnd: 32.8,
                    hipFireStartPerStat: 0.102,
                    hipFireEndPerStat: 0.0205,
                },
            },
        },

        [TraitId.MachineGun]: {
            [ArchetypeOverrideHash.MG_RapidFire]: {
                ammo: {
                    mag: { a: 0, b: 0, c: 0 },
                    reservesCalc: () => 400,
                },
            },
        },

        [TraitId.ScoutRifle]: {
            [ArchetypeOverrideHash.Scout_Aggressive]: {
                // 120 RPMs don't really have a reload that makes sense, since they reload 2 bullets at a time.
                reload: { a: 0, b: 0, c: 0, ammoTime: 0, },
            },
        },

        [TraitId.Shotgun]: {
            [ArchetypeOverrideHash.Shotgun_Slug]: {
                range: {
                    baseFalloffStart: 5.77,
                    falloffEnd: 12.75,
                    hipFireStartPerStat: 0.0295,
                    hipFireEndPerStat: 0,
                },
            },
        },
    };
    return map;
});

const ExoticBowOverrides: IWeaponFormulaOverrides = {
    reload: {
        a: 0.00006152,
        b: -0.00917,
        c: 1.15,
        ammoTime: 0,
    },
};

const enum ExoticOverrideHash {
    Cerberus = 1541131350,
    HardLight = 4124984448,
    SweetBusiness = 1345867570,
    WishEnder = 814876684,
    TrinityGhoul = 814876685,
    LeMonarque = 3588934839,
    TicuusDivination = 3260753130,
    HierarchyOfNeeds = 4174431791,
    LeviathansBreath = 2591746970,
    OneThousandVoice = 2069224589,
    Telesto = 2208405142,
    Jotunn = 417164956,
    VexMythoclast = 4289226715,
    Anarchy = 2376481550,
    Parasite = 2812324400,
    ErianasVow = 3524313097,
    TheLastWord = 1364093401,
    Xenophage = 1395261499,
    GrandOverture = 1763584999,
    HeirApparent = 2084878005,
    DeadMansTale = 3468089894,
    LordOfWolves = 3413860063,
    Duality = 3460576091,
    TractorCannon = 3580904581,
    Forerunner = 2179048386,
    OsteoStriga = 46524085,
}

export const WeaponCategoryValuesExoticOverrideMap = computed<LookupMap<ItemHash, IWeaponFormulaOverrides>>(() => {
    const map: LookupMap<ItemHash, IWeaponFormulaOverrides> = {
        [ExoticOverrideHash.Cerberus]: CancelRangeOverride,
        [ExoticOverrideHash.HardLight]: {
            range: {
                baseFalloffStart: 11.75,
                falloffEnd: 41,
                hipFireStartPerStat: 0.09615,
                hipFireEndPerStat: 0,
            },
        },
        [ExoticOverrideHash.SweetBusiness]: {
            ammo: {
                mag: { a: 0, b: 0, c: 150, },
                reservesCalc: () => 0,
            },
        },

        [ExoticOverrideHash.WishEnder]: ExoticBowOverrides,
        [ExoticOverrideHash.TrinityGhoul]: ExoticBowOverrides,
        [ExoticOverrideHash.LeMonarque]: ExoticBowOverrides,
        [ExoticOverrideHash.TicuusDivination]: ExoticBowOverrides,
        [ExoticOverrideHash.HierarchyOfNeeds]: ExoticBowOverrides,
        [ExoticOverrideHash.LeviathansBreath]: {
            ...ExoticBowOverrides,
            ammo: {
                mag: { a: 0, b: 0, c: 1, },
                reservesCalc: () => 10, // TODO: is like... 15 with catalyst?
            }
        },
        
        [ExoticOverrideHash.OneThousandVoice]: CancelRangeOverride,
        [ExoticOverrideHash.Telesto]: CancelRangeOverride,
        [ExoticOverrideHash.Jotunn]: CancelRangeOverride,
        [ExoticOverrideHash.VexMythoclast]: {
            // Is basically an auto rifle.
            range: {
                baseFalloffStart: 11.75,
                falloffEnd: 41,
                hipFireStartPerStat: 0.09615,
                hipFireEndPerStat: 0,
            },
            reload: {
                a: 0.0000855689,
                b: -0.0242021,
                c: 2.80673006666667,
                ammoTime: 0,
            },
            handling: {
                ready: { valuePerPoint: -0.00279338, offset: 0.51985381 },
                stow: { valuePerPoint: -0.00268436, offset: 0.48414822 },
                ads: { valuePerPoint: -0.001875, offset: 0.38975 },
            },
        },

        [ExoticOverrideHash.Anarchy]: {
            ammo: {
                mag: { a: 0, b: 0, c: 6, },
                reservesCalc: () => 18,
            },
        },
        [ExoticOverrideHash.Parasite]: {
            ammo: {
                mag: { a: 0, b: 0, c: 1, },
                reservesCalc: () => 9,
            },
        },

        [ExoticOverrideHash.ErianasVow]: {
            range: {
                baseFalloffStart: 38,
                falloffEnd: 70,
                hipFireStartPerStat: 0,
                hipFireEndPerStat: 0,
            },
            ammo: {
                mag: { a: 0, b: 0.1, c: 3.5, },
                reservesCalc: (_rawMagSize, _magStat, inventorySizeStat) => {
                    // Quadratic using inventory size.
                    const reserves = -0.00126 * (inventorySizeStat * inventorySizeStat) + inventorySizeStat * 0.225 + 29.5;
                    return Math.ceil(reserves);
                },
            },
        },
        [ExoticOverrideHash.TheLastWord]: {
            range: {
                baseFalloffStart: 19.3,
                falloffEnd: 29.67,
                hipFireStartPerStat: 0,
                hipFireEndPerStat: 0,
            },
        },

        // The Queenbreaker
        // Arbalest
        // Sleeper Simulant
        // Lorentz Driver

        [ExoticOverrideHash.Xenophage]: {
            range: CancelRangeValues,
            ammo: {
                mag: { a: 0, b: 0, c: 13, },
                reservesCalc: (_rawMagSize, _magStat, inventorySizeStat) => {
                    // Quadratic based on inventory size.
                    const reserves = 0.01 * (inventorySizeStat * inventorySizeStat) + inventorySizeStat * 0.56 + 25.91;
                    return Math.ceil(reserves);
                },
            },
        },
        [ExoticOverrideHash.GrandOverture]: {
            range: CancelRangeValues,
            ammo: {
                mag: { a: 0, b: 0, c: 20, },
                reservesCalc: (_rawMagSize, _magStat, inventorySizeStat) => {
                    // Quadratic based on inventory size.
                    const reserves = 0.005 * (inventorySizeStat * inventorySizeStat) + inventorySizeStat * -0.4 + 67.375;
                    return Math.ceil(reserves);
                },
            },
        },
        [ExoticOverrideHash.HeirApparent]: {
            ammo: {
                mag: { a: 0, b: 0.7, c: 45, },
                reservesCalc: () => 400,
            },
        },

        [ExoticOverrideHash.DeadMansTale]: {
            // 120 RPMs don't really have a reload that makes sense, since they reload 2 bullets at a time.
            reload: { a: 0, b: 0, c: 0, ammoTime: 0, },
        },

        [ExoticOverrideHash.LordOfWolves]: {
            // No data for LoW, and it works differently than other shotguns.
            range: { baseFalloffStart: 0, falloffEnd: 0, hipFireStartPerStat: 0, hipFireEndPerStat: 0, },
            ammo: {
                mag: { a: 0, b: 0, c: 0, },
                reservesCalc: () => 120,
            },
        },
        [ExoticOverrideHash.Duality]: {
            // No data for Duality, and it works differently than other shotguns.
            range: { baseFalloffStart: 0, falloffEnd: 0, hipFireStartPerStat: 0, hipFireEndPerStat: 0, },
        },
        [ExoticOverrideHash.TractorCannon]: {
            // No data for Tractor Cannon, and it works differently than other shotguns.
            range: { baseFalloffStart: 0, falloffEnd: 0, hipFireStartPerStat: 0, hipFireEndPerStat: 0, },
        },

        [ExoticOverrideHash.Forerunner]: {
            range: {
                baseFalloffStart: 28.3,
                falloffEnd: 43.2,
                hipFireStartPerStat: 0,
                hipFireEndPerStat: 0,
            },
            ammo: {
                mag: { a: 0, b: 0, c: 12, },
                reservesCalc: (_rawMagSize, _magStat, inventorySizeStat) => {
                    const reserves = (inventorySizeStat * 0.325) + 53.45;
                    return Math.ceil(reserves);
                },
            }
        },

        [ExoticOverrideHash.OsteoStriga]: {
            range: {
                baseFalloffStart: 9.0835,
                falloffEnd: 28.11,
                hipFireStartPerStat: 0.1247,
                hipFireEndPerStat: 0,
            },
            handling: {
                ready: { valuePerPoint: -0.199386, offset: 33.3015 },
                stow: { valuePerPoint: -0.153306, offset: 28.8991 },
                ads: { valuePerPoint: -0.001873200822, offset: 0.3581576422 },
            },
        },
    };
    return map;
});
