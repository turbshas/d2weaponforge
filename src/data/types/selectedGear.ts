import type { DestinyStatDisplayDefinition } from "bungie-api-ts/destiny2";
import { computed, ref } from "vue";
import type { IMasterwork, IMod, IModifiedStat, IPerk, IPerkBonus, ISelectedGear, IStatInfo, IWeapon, SelectedPerkMap } from "../interfaces";
import { selectionService } from "../selectionService";
import { hashMapToArray } from "../util";

export class SelectedGear implements ISelectedGear {
    constructor(
        ) {
    }

    public readonly weapon = ref<IWeapon | undefined>(undefined);
    public readonly perkOptionsMap = ref<SelectedPerkMap>({
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
        return this.weaponStats.value.map(s => {
            const bonusTotal = this.bonusStatMap.value[s.statHash] || 0;
            const statInfo: IModifiedStat = {
                statHash: s.statHash,
                statDisplay: s.statDisplay,
                statName: s.statName,
                baseStat: s.investmentValue,
                modifiedStat: s.investmentValue + bonusTotal,
            };
            return statInfo;
        });
    });

    public readonly modifiedWeaponDisplayStats = computed(() =>
        this.modifiedWeaponStats.value.map(s => {
            const baseDisplayValue = this.convertToDisplayValue(s.baseStat, s.statDisplay);
            const modifiedDisplayValue = this.convertToDisplayValue(s.modifiedStat, s.statDisplay);
            const statInfo: IModifiedStat = {
                statHash: s.statHash,
                statName: s.statName,
                statDisplay: s.statDisplay,
                baseStat: baseDisplayValue,
                modifiedStat: modifiedDisplayValue,
            };
            return statInfo;
        })
    );

    public readonly displayValueIfAddingBonus = (bonus: IPerkBonus) => {
        const currentStat = this.modifiedStatMap.value[bonus.statHash];
        if (!currentStat) return bonus.value;
        const currentDisplayStat = this.convertToDisplayValue(currentStat.modifiedStat, currentStat.statDisplay);
        const afterBonus = this.convertToDisplayValue(currentStat.modifiedStat + bonus.value, currentStat.statDisplay);
        return afterBonus - currentDisplayStat;
    }

    public readonly displayValueIfRemovingBonus = (bonus: IPerkBonus) => {
        const currentStat = this.modifiedStatMap.value[bonus.statHash];
        if (!currentStat) return -bonus.value;
        const currentDisplayStat = this.convertToDisplayValue(currentStat.modifiedStat, currentStat.statDisplay);
        const afterBonus = this.convertToDisplayValue(currentStat.modifiedStat - bonus.value, currentStat.statDisplay);
        return afterBonus - currentDisplayStat;
    }

    private readonly weaponStats = computed(() => this.weapon.value ? this.weapon.value.statBlock.statInfos : []);
    private readonly isWeaponAdept = computed(() => !!this.weapon.value && this.weapon.value.isAdept);

    private readonly perkList = computed(() => this.perkOptionsList.value.map(o => {
        if (!o) return undefined;
        return o.useEnhanced ? o.enhancedPerk : o.perk;
    }));

    private readonly perkBonuses = computed(() => {
        return this.perkList.value
            .map(p => this.getBonusesForPerk(p))
            .reduce((total, current) => total.concat(current), []);
    });
    private readonly masterworkBonuses = computed(() => this.getBonusesForPerk(this.masterwork.value));
    private readonly modBonuses = computed(() => this.getBonusesForPerk(this.mod.value));
    private readonly allBonuses = computed(() => this.perkBonuses.value.concat(this.masterworkBonuses.value, this.modBonuses.value));

    private readonly bonusStatMap = computed(() => {
        const map: { [hash: number]: number } = {};
        for (const bonus of this.allBonuses.value) {
            const current = map[bonus.statHash] || 0;
            map[bonus.statHash] = current + bonus.value;
        }
        return map;
    });
    private readonly modifiedStatMap = computed(() => {
        const map: { [statHash: number]: IModifiedStat | undefined } = {};
        for (const stat of this.modifiedWeaponStats.value) {
            map[stat.statHash] = stat;
        }
        return map;
    });

    private readonly getBonusesForPerk = (perk: IPerk | undefined) => {
        if (!perk) return [];
        const bonuses = perk.mainBonuses;
        return (selectionService.showCraftedBonus || this.isWeaponAdept.value)
            ? bonuses.concat(perk.adeptOrCraftedBonuses)
            : bonuses;
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
