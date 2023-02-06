import type { IPerkColumn } from "../interfaces";
import type { PerkOption } from "./perkOption";

export class PerkColumn implements IPerkColumn {
    constructor(public readonly perks: PerkOption[]) {
    }
}
