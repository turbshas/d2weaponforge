export function hashMapToArray<T>(hashMap: { [hash: number]: T }) {
    const ret: T[] = [];
    for (const key in hashMap) {
        if (hashMap.hasOwnProperty(key)) {
            ret.push(hashMap[key]);
        }
    }
    return ret;
}

export function findItemInTable<T>(table: { [hash: number]: T }, predicate: (item: T) => boolean) {
    for (const key in table) {
        const item = table[key];
        if (predicate(item)) {
            return item;
        }
    }
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
