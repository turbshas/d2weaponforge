import { ref } from "vue";
import { cacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import type { ILanguageInfo, IMasterwork, IMod, IPerkBonus, IPerkOption, IWeapon, PerkColumnNumber, ISelectedPerkMap } from "./interfaces";
import { SelectedGear } from "./types/selectedGear";

class SelectionService {
    public readonly selectedGear = new SelectedGear();

    constructor() {
        this.initializePreferences();
    }

    private initializePreferences = async () => {
        const language = await cacheService.getLanguage();
        if (language) {
            this.languageWrapper.value = language;
        }
    }

    public readonly setWeapon = (weapon: IWeapon | undefined) => {
        this.selectedGear.weapon.value = weapon;
        this.selectedGear.perkOptionsMap.value = {
            1: undefined,
            2: undefined,
            3: undefined,
            4: undefined,
            5: undefined,
        };
        this.selectedGear.masterwork.value = undefined;
        this.selectedGear.mod.value = undefined;
    }

    public readonly setPerk = (column: PerkColumnNumber, perk: IPerkOption | undefined) => {
        this.selectedGear.perkOptionsMap.value[column] = perk;
    }

    public readonly setPerks = (perks: ISelectedPerkMap<IPerkOption>) => {
        this.selectedGear.perkOptionsMap.value = perks;
    }

    public readonly setMasterwork = (masterwork: IMasterwork | undefined) => {
        this.selectedGear.masterwork.value = masterwork;
    }

    public readonly setMod = (mod: IMod | undefined) => {
        this.selectedGear.mod.value = mod;
    }

    public readonly displayValueIfAddingBonus = (column: PerkColumnNumber, bonus: IPerkBonus) => this.selectedGear.displayValueIfAddingBonus(column, bonus);

    // Preferences - storing them here for lack of a better place
    private languageWrapper = ref<ILanguageInfo>(DataSearchStrings.DefaultLanguage);
    private hideRetiredPerksWrapper = ref(false);
    private showCraftedBonusWrapper = ref(false);

    public get language() { return this.languageWrapper.value; }
    public set language(value: ILanguageInfo) {
        this.languageWrapper.value = value;
        cacheService.setLanguage(value);
    }

    public get hideRetiredPerks() { return this.hideRetiredPerksWrapper.value; }
    public set hideRetiredPerks(value: boolean) { this.hideRetiredPerksWrapper.value = value; }

    public get showCraftedBonus() { return this.showCraftedBonusWrapper.value; }
    public set showCraftedBonus(value: boolean) { this.showCraftedBonusWrapper.value = value; }
}
export const selectionService = new SelectionService();
