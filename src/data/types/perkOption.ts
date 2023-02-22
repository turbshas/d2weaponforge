import type { ICraftingInfo, IPerkOption, ItemHash } from "../interfaces";

export class PerkOption implements IPerkOption {
    constructor(
        public readonly perk: ItemHash,
        public readonly enhancedPerk: ItemHash | undefined,
        public readonly craftingInfo: ICraftingInfo | undefined,
        public readonly currentlyCanRoll: boolean,
        ) {
    }
}
