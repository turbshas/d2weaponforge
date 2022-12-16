import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ref } from "vue";

class SelectionService {
    private selectedWeaponWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);
    private selectedPerksWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);
    private selectedMasterworkWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);
    private selectedModWrapper = ref<DestinyInventoryItemDefinition | undefined>(undefined);

    public get selectedWeapon() {
        return this.selectedWeaponWrapper.value;
    }

    public get selectedPerks() {
        return this.selectedPerksWrapper.value;
    }

    public get selectedMasterwork() {
        return this.selectedMasterworkWrapper.value;
    }

    public get selectedMod() {
        return this.selectedModWrapper.value;
    }
}
export const selectionService = new SelectionService();
