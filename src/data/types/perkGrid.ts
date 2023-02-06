import type { PerkColumn } from "./perkColumn";

export class PerkGrid {
    constructor(public readonly perkColumns: PerkColumn[]) {
    }

    public get firstColumn() { return this.perkColumns.length > 0 ? this.perkColumns[0].perks : []; }
    public get secondColumn() { return this.perkColumns.length > 1 ? this.perkColumns[1].perks : []; }
    public get thirdColumn() { return this.perkColumns.length > 2 ? this.perkColumns[2].perks : []; }
    public get fourthColumn() { return this.perkColumns.length > 3 ? this.perkColumns[3].perks : []; }
}
