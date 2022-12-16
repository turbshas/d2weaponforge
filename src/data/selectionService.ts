import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ref } from "vue";
import type { IPerkOption } from "./types";

class SelectionService {
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
}
export const selectionService = new SelectionService();