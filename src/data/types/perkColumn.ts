import type { IPerkOption } from "../interfaces";

export class PerkColumn {
    constructor(private readonly perks: IPerkOption[]) {
    }

    public get perkOptions() { return this.perks; }
}
