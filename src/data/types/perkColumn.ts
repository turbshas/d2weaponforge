import type { IPerkColumn, IPerkOption } from "../interfaces";

export class PerkColumn implements IPerkColumn {
    constructor(public readonly perks: IPerkOption[]) {
    }
}
