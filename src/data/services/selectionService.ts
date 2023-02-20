import { ref } from "vue";
import type { CacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import type { ILanguageInfo, IMasterwork, IMod, IPerkBonus, IPerkOption, IWeapon, PerkColumnNumber, ISelectedPerkMap } from "../interfaces";
import { SelectedGear } from "../types/selectedGear";

export class SelectionService {
    public readonly preferencesLoaded: Promise<void>;
    public readonly selectedGear = new SelectedGear();

    constructor(private readonly cacheService: CacheService) {
        this.preferencesLoaded = this.initializePreferences();
    }

    private readonly initializePreferences = async () => {
        const preferences = await this.cacheService.getPreferences();
        if (preferences) {
            this.languageWrapper.value = preferences.language;
            this.hideRetiredPerksWrapper.value = preferences.hideRetiredPerks;
            this.showCraftedBonusWrapper.value = preferences.showCraftedBonus;
            this.rawStatValuesWrapper.value = preferences.rawStatValues;
        }
    }

    private readonly setPreferences = async () => {
        const language = this.languageWrapper.value;

        this.cacheService.setPreferences({
            // Need to clone object here to get rid of vue inserted properties/methods.
            language: {
                ...language,
            },
            hideRetiredPerks: this.hideRetiredPerksWrapper.value,
            showCraftedBonus: this.showCraftedBonusWrapper.value,
            rawStatValues: this.rawStatValuesWrapper.value,
        });
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

    public readonly displayValueIfAddingBonus = (bonus: IPerkBonus, column?: PerkColumnNumber) => this.selectedGear.displayValueIfAddingBonus(bonus, column);

    // Preferences - storing them here for lack of a better place
    private readonly languageWrapper = ref<ILanguageInfo>(DataSearchStrings.DefaultLanguage);
    private readonly hideRetiredPerksWrapper = ref(false);
    private readonly showCraftedBonusWrapper = ref(false);
    private readonly rawStatValuesWrapper = ref(false);

    public get language() { return this.languageWrapper.value; }
    public set language(value: ILanguageInfo) {
        this.languageWrapper.value = value;
        this.setPreferences();
    }

    public get hideRetiredPerks() { return this.hideRetiredPerksWrapper.value; }
    public set hideRetiredPerks(value: boolean) {
        this.hideRetiredPerksWrapper.value = value;
        this.setPreferences();
    }

    public get showCraftedBonus() { return this.showCraftedBonusWrapper.value; }
    public set showCraftedBonus(value: boolean) {
        this.showCraftedBonusWrapper.value = value;
        this.setPreferences();
    }

    public get rawStatValues() { return this.rawStatValuesWrapper.value; }
    public set rawStatValues(value: boolean) {
        this.rawStatValuesWrapper.value = value;
        this.setPreferences();
    }
}
