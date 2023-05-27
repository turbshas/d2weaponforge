export type ItemHash = number;

export type LookupMap<K extends string | number | symbol, V> = { [key in K]?: V };
