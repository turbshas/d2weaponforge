import type { DestinyStatDisplayDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import type { IMasterwork, IMod, IModifiedStat, IPerk, IPerkBonus, IPerkOption, ISelectedGear, IWeapon, ISelectedPerkMap, PerkColumnNumber } from "../interfaces";
import { selectionService } from "../services";
import { hashMapToArray } from "../util";

export class SelectedGear implements ISelectedGear {
    constructor(
        ) {
    }

    public readonly weapon = ref<IWeapon | undefined>(undefined);
    public readonly perkOptionsMap = ref<ISelectedPerkMap<IPerkOption>>({
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
    });
    public readonly perkOptionsList = computed(() => hashMapToArray(this.perkOptionsMap.value));
    public readonly masterwork = ref<IMasterwork | undefined>(undefined);
    public readonly mod = ref<IMod | undefined>(undefined);

    public readonly modifiedWeaponStats = computed(() => {
        return this.modifiedWeaponStatsMasterworkMods.value.map(s => {
            const perk1Bonus = this.perk1BonusesStatMap.value[s.statHash] || 0;
            const perk2Bonus = this.perk2BonusesStatMap.value[s.statHash] || 0;
            const perk3Bonus = this.perk3BonusesStatMap.value[s.statHash] || 0;
            const perk4Bonus = this.perk4BonusesStatMap.value[s.statHash] || 0;
            const perk5Bonus = this.perk5BonusesStatMap.value[s.statHash] || 0;
            const bonusTotal = perk1Bonus + perk2Bonus + perk3Bonus + perk4Bonus + perk5Bonus;

            const statInfo: IModifiedStat = {
                index: s.index,
                statHash: s.statHash,
                statDisplay: s.statDisplay,
                statName: s.statName,
                baseStat: s.baseStat,
                modifiedStat: s.modifiedStat + bonusTotal,
            };
            return statInfo;
        });
    });

    public readonly modifiedWeaponDisplayStats = computed(() =>
        this.modifiedWeaponStats.value.map(s => {
            const baseDisplayValue = this.convertToDisplayValue(s.baseStat, s.statDisplay);
            const modifiedDisplayValue = this.convertToDisplayValue(s.modifiedStat, s.statDisplay);
            const statInfo: IModifiedStat = {
                index: s.index,
                statHash: s.statHash,
                statName: s.statName,
                statDisplay: s.statDisplay,
                baseStat: baseDisplayValue,
                modifiedStat: modifiedDisplayValue,
            };
            return statInfo;
        })
    );

    public readonly displayValueIfAddingBonus = (bonus: IPerkBonus, column?: PerkColumnNumber) => {
        const currentStat = this.modifiedStatMap.value[bonus.statHash];
        if (!currentStat) return bonus.value;
        const perkBonusesMap = column && this.perkBonusesMap.value[column] || {};
        const currentColumnBonuses = perkBonusesMap[bonus.statHash] || 0;
        const currentStatWithoutColumn = currentStat.modifiedStat - currentColumnBonuses;
        const currentDisplayStat = this.convertToDisplayValue(currentStatWithoutColumn, currentStat.statDisplay);
        const afterBonus = this.convertToDisplayValue(currentStatWithoutColumn + bonus.value, currentStat.statDisplay);
        return afterBonus - currentDisplayStat;
    }

    private readonly weaponStats = computed(() => this.weapon.value ? this.weapon.value.statBlock.statInfos : []);
    private readonly isWeaponAdept = computed(() => !!this.weapon.value && this.weapon.value.isAdept);
    private readonly perkMap = computed(() => {
        const map:  ISelectedPerkMap<IPerk> = {
            1: this.getPerkFromOption(this.perkOptionsMap.value[1]),
            2: this.getPerkFromOption(this.perkOptionsMap.value[2]),
            3: this.getPerkFromOption(this.perkOptionsMap.value[3]),
            4: this.getPerkFromOption(this.perkOptionsMap.value[4]),
            5: this.getPerkFromOption(this.perkOptionsMap.value[5]),
        };
        return map;
    });

    private readonly masterworkBonuses = computed(() => this.getBonusesForPerk(this.masterwork.value));
    private readonly modBonuses = computed(() => this.getBonusesForPerk(this.mod.value));

    private readonly masterworksModsBonusesMap = computed(() => {
        const map: { [hash: number]: number | undefined } = {};
        for (const bonus of this.masterworkBonuses.value) {
            const current = map[bonus.statHash] || 0;
            map[bonus.statHash] = current + bonus.value;
        }
        for (const bonus of this.modBonuses.value) {
            const current = map[bonus.statHash] || 0;
            map[bonus.statHash] = current + bonus.value;
        }
        return map;
    });

    private readonly perk1BonusesStatMap = computed(() => this.getBonusesStatMapForPerk(this.perkMap.value[1]));
    private readonly perk2BonusesStatMap = computed(() => this.getBonusesStatMapForPerk(this.perkMap.value[2]));
    private readonly perk3BonusesStatMap = computed(() => this.getBonusesStatMapForPerk(this.perkMap.value[3]));
    private readonly perk4BonusesStatMap = computed(() => this.getBonusesStatMapForPerk(this.perkMap.value[4]));
    private readonly perk5BonusesStatMap = computed(() => this.getBonusesStatMapForPerk(this.perkMap.value[5]));
    private readonly perkBonusesMap = computed(() => {
        const map: ISelectedPerkMap<{ [hash: number]: number | undefined }> = {
            1: this.perk1BonusesStatMap.value,
            2: this.perk2BonusesStatMap.value,
            3: this.perk3BonusesStatMap.value,
            4: this.perk4BonusesStatMap.value,
            5: this.perk5BonusesStatMap.value,
        }
        return map;
    });

    private readonly modifiedWeaponStatsMasterworkMods = computed(() => {
        return this.weaponStats.value.map(s => {
            const masterworkModsBonus = this.masterworksModsBonusesMap.value[s.statHash] || 0;
            const statInfo: IModifiedStat = {
                index: s.index,
                statHash: s.statHash,
                statDisplay: s.statDisplay,
                statName: s.statName,
                baseStat: s.investmentValue,
                modifiedStat: s.investmentValue + masterworkModsBonus,
            };
            return statInfo;
        });
    });

    private readonly modifiedStatMap = computed(() => {
        const map: { [statHash: number]: IModifiedStat | undefined } = {};
        for (const stat of this.modifiedWeaponStats.value) {
            map[stat.statHash] = stat;
        }
        return map;
    });

    private readonly getPerkFromOption = (perkOption: IPerkOption | undefined) => {
        if (!perkOption) return undefined;
        return perkOption.useEnhanced ? perkOption.enhancedPerk : perkOption.perk;
    }

    private readonly getBonusesForPerk = (perk: IPerk | undefined) => {
        if (!perk) return [];
        const bonuses = perk.mainBonuses;
        return (selectionService.showCraftedBonus || this.isWeaponAdept.value)
            ? bonuses.concat(perk.adeptOrCraftedBonuses)
            : bonuses;
    }

    private readonly getBonusesStatMapForPerk = (perk: IPerk | undefined) => {
        const bonuses = this.getBonusesForPerk(perk);
        const map: { [hash: number]: number | undefined } = {};
        for (const bonus of bonuses) {
            const current = map[bonus.statHash] || 0;
            map[bonus.statHash] = current + bonus.value;
        }
        return map;
    }

    private readonly convertToDisplayValue = (statValue: number, statDisplay: DestinyStatDisplayDefinition | undefined) => {
        const clampedValue = this.clampStatForDisplay(statValue, statDisplay);
        if (!statDisplay) return clampedValue;
        const displayInterpolation = statDisplay.displayInterpolation;

        // Check if values has an exact match.
        const existing = displayInterpolation.find(d => d.value === clampedValue);
        if (existing) return existing.weight;

        // Else, we need to interpolate.
        // The ranges are *mostly* linear. Sometimes archetypes each get their own subdivision in the range, and each subdivision is linear.
        const start = displayInterpolation.slice().reverse().find(d => d.value < clampedValue);
        const end = displayInterpolation.find(d => d.value > clampedValue);
        if (!start || !end) return clampedValue;

        const stepSize = end.value - start.value;
        const rangeSize = end.weight - start.weight;
        const valueWithinStep = clampedValue - start.value;
        const offset = Math.ceil(rangeSize * (valueWithinStep / stepSize));
        const value = offset + start.weight;
        // For some stats, a higher value is a lower weight (like charge time).
        const upperBound = Math.max(start.weight, end.weight);
        const lowerBound = Math.min(start.weight, end.weight);
        if (value < lowerBound) return lowerBound;
        if (value > upperBound) return upperBound;
        return value;
    }

    private readonly clampStatForDisplay = (statValue: number, statDisplay: DestinyStatDisplayDefinition | undefined) => {
        // The min is always 0.
        const max = statDisplay ? statDisplay.maximumValue : 100;
        if (statValue < 0) return 0;
        if (statValue > max) return max;
        return statValue;
    }
}
