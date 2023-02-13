import type { IPerkGrid } from "../interfaces";
import type { PerkColumn } from "./perkColumn";

export class PerkGrid implements IPerkGrid {
    constructor(public readonly perkColumns: PerkColumn[]) {
    }
}
