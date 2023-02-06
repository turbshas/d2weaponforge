import type { Ref } from "vue";
import type { SelectedPerkMap } from "../interfaces";
import type { Masterwork } from "./masterwork";
import type { Mod } from "./mod";
import type { Weapon } from "./weapon";

export class SelectedGear {
    constructor(
        private readonly weapon: Ref<Weapon>,
        private readonly perks: Ref<SelectedPerkMap>,
        private readonly masterwork: Ref<Masterwork>,
        private readonly mod: Ref<Mod>,
        ) {
    }
}
