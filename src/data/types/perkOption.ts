import type { ICraftingInfo } from "../interfaces";
import type { Perk } from "./perk";

export class PerkOption {
    constructor(
        private readonly _perk: Perk,
        private readonly _enhancedPerk: Perk | undefined,
        public readonly craftingInfo: ICraftingInfo | undefined,
        public readonly currentlyCanRoll: boolean,
        public readonly useEnhanced: boolean,
        ) {
    }

    public get perk() { return this._enhancedPerk || this._perk; }
}
