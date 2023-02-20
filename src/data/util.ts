type PropertiesOfType<T, U> = { [key in keyof T]: T[key] extends U ? key : never };
type PropertyNamesOfType<T, U> = PropertiesOfType<T, U>[keyof T];

type HashMap<T> = Record<string | number, T>;

type HashMapIndex<T> = keyof HashMap<T>;
type HashMapIndexesOf<T> = PropertyNamesOfType<T, HashMapIndex<T>>;
type ArrayToHashMapItem<T> = { [key in HashMapIndexesOf<T>]: HashMapIndex<T> };

export function hashMapToArray<T>(hashMap: HashMap<T>) {
    const ret: T[] = [];
    if (!hashMap) return ret;
    for (const key in hashMap) {
        if (hashMap.hasOwnProperty(key)) {
            const value = hashMap[key];
            if (value) {
                ret.push(value);
            }
        }
    }
    return ret;
}

export function arrayToHashMap<T extends ArrayToHashMapItem<T>>(array: T[], key: HashMapIndexesOf<T>): HashMap<T> {
    const map: HashMap<T> = {};
    for (const item of array) {
        const keyValue: keyof HashMap<T> = item[key];
        map[keyValue] = item;
    }
    return map;
}

export function arrayToExistenceMap<T extends string | number | symbol>(array: T[]): { [key in T]?: boolean } {
    const map: { [key in T]?: boolean } = {};
    for (const item of array) {
        map[item] = true;
    }
    return map;
}

export function findItemInTable<T>(table: { [hash: number]: T }, predicate: (item: T) => boolean) {
    for (const key in table) {
        const item = table[key];
        if (predicate(item)) {
            return item;
        }
    }
}

export function findItemsInTable<T>(table: { [hash: number]: T }, predicate: (item: T) => boolean) {
    const items: T[] = [];
    for (const key in table) {
        const item = table[key];
        if (predicate(item)) {
            items.push(item);
        }
    }
    return items;
}

export class Signal<T = undefined> {
    private nextId: number = 1;
    private callbacks: { [id: number]: (data: T) => void } = {};

    public subscribe = (callback: (data: T) => void) => {
        const id = this.nextId;
        this.nextId += 1;
        this.callbacks[id] = callback;
        return () => { delete this.callbacks[id]; };
    }

    public publish = (data: T) => {
        for (const key in this.callbacks) {
            const callback = this.callbacks[key];
            callback(data);
        }
    }
}
