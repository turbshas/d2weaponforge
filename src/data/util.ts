export function hashMapToArray<T>(hashMap: { [hash: number]: T }) {
    const ret: T[] = [];
    for (const key in hashMap) {
        if (hashMap.hasOwnProperty(key)) {
            ret.push(hashMap[key]);
        }
    }
    return ret;
}
