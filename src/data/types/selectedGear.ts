import { computed, type Ref } from "vue";
import type { IMasterwork, IMod, IPerk, IPerkBonus, IStatInfo, IWeapon, SelectedPerkMap } from "../interfaces";
import { selectionService } from "../selectionService";

export class SelectedGear {
    constructor(
        private readonly weapon: Ref<IWeapon>,
        private readonly perksOptionsMap: Ref<SelectedPerkMap>,
        private readonly masterwork: Ref<IMasterwork>,
        private readonly mod: Ref<IMod>,
        ) {
    }

    private readonly weaponStats = computed(() => this.weapon.value.statBlock.statInfos);

    private readonly perkOptionsList = computed(() => [
        this.perksOptionsMap.value[1],
        this.perksOptionsMap.value[2],
        this.perksOptionsMap.value[3],
        this.perksOptionsMap.value[4],
        this.perksOptionsMap.value[5]
    ]);

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

    private readonly allBonuses = computed(() =>
        this.perkBonuses.value
            .concat(this.masterworkBonuses.value)
            .concat(this.modBonuses.value)
    );

    private readonly bonusStatMap = computed(() => {
        const map: { [statHash: number]: IPerkBonus[] | undefined } = {};
        for (const bonus of this.allBonuses.value) {
            if (!map[bonus.statHash]) {
                map[bonus.statHash] = [];
            }
            map[bonus.statHash]!.push(bonus);
        }
        return map;
    });

    private readonly modifiedWeaponStats = computed(() => {
        return this.weaponStats.value.map(s => {
            const bonuses = this.bonusStatMap.value[s.statHash] || [];
            const bonusTotal = bonuses.reduce((total, current) => total += current.value, 0);
            const statInfo: IStatInfo = {
                statHash: s.statHash,
                statDisplay: s.statDisplay,
                statName: s.statName,
                investmentValue: s.investmentValue + bonusTotal,
            };
            return statInfo;
        });
    });

    public get currentStats() {
        return this.modifiedWeaponStats.value;
    }

    private readonly getBonusesForPerk = (perk: IPerk | undefined) => {
        if (!perk) return [];
        const bonuses = perk.mainBonuses;
        return (selectionService.showCraftedBonus || this.weapon.value.isAdept)
            ? bonuses.concat(perk.adeptOrCraftedBonuses)
            : bonuses;
    }
}
