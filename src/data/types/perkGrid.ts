import type { IPerkSlotOptions } from "../interfaces";
import { PerkColumn } from "./perkColumn";

export class PerkGrid {
    private readonly perkColumns: PerkColumn[];

    constructor(perkSlotOptions: IPerkSlotOptions[]) {
        this.perkColumns = perkSlotOptions.map(s => new PerkColumn(s.options));
    }

    public get firstColumn() { return this.perkColumns.length > 0 ? this.perkColumns[0].perkOptions : []; }
    public get secondColumn() { return this.perkColumns.length > 1 ? this.perkColumns[1].perkOptions : []; }
    public get thirdColumn() { return this.perkColumns.length > 2 ? this.perkColumns[2].perkOptions : []; }
    public get fourthColumn() { return this.perkColumns.length > 3 ? this.perkColumns[3].perkOptions : []; }
}
