import type { IPerkColumn, IPerkGrid } from "../interfaces";

export class PerkGrid implements IPerkGrid {
    constructor(public readonly perkColumns: IPerkColumn[]) {
    }
}
