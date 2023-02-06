import type { ICraftingInfo, IPerkOption } from "../interfaces";
import type { Perk } from "./perk";

export class PerkOption implements IPerkOption {
    constructor(
        public readonly perk: Perk,
        public readonly enhancedPerk: Perk | undefined,
        public readonly craftingInfo: ICraftingInfo | undefined,
        public readonly currentlyCanRoll: boolean,
        public useEnhanced: boolean,
        ) {
    }
}
