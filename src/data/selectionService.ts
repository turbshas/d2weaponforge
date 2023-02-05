import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ref } from "vue";
import { cacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import type { ILanguageInfo, IPerkOption } from "./interfaces";

class SelectionService {
    constructor() {
        this.initializePreferences();
    }

    private initializePreferences = async () => {
        const language = await cacheService.getLanguage();
        if (language) {
            this.languageWrapper.value = language;
        }
    }

    private selectedWeaponWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);
    private selectedPerksWrapper = ref<(IPerkOption | undefined)[]>([]);
    private selectedMasterworkWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);
    private selectedModWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);

    public get selectedWeapon() { return this.selectedWeaponWrapper.value; }
    public set selectedWeapon(value: DestinyInventoryItemDefinition | undefined) { this.selectedWeaponWrapper.value = value; }

    public get selectedPerks() { return this.selectedPerksWrapper.value; }
    public set selectedPerks(value: (IPerkOption | undefined)[]) { this.selectedPerksWrapper.value = value; }

    public get selectedMasterwork() { return this.selectedMasterworkWrapper.value; }
    public set selectedMasterwork(value: DestinyInventoryItemDefinition | undefined) { this.selectedMasterworkWrapper.value = value; }

    public get selectedMod() { return this.selectedModWrapper.value; }
    public set selectedMod(value: DestinyInventoryItemDefinition | undefined) { this.selectedModWrapper.value = value; }

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
