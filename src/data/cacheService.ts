import type { DestinyManifest, DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { Destiny2GameData, ILanguageInfo } from "./interfaces";

interface ICachedManifest {
    /** Version specific to this app, and the data it expects from the cache. Not the Bungie manifest version. */
    version: number;
    language: DestinyManifestLanguage;
    manifestInfo: DestinyManifest;
    manifestData: Destiny2GameData;
}

const ManifestDatabaseName = "d2gunsmith_2_manifest_database";
const ManifestObjectStoreName = "manifestObjectStore";
const ManifestCacheKey = "d2gunsmith_2_destiny_manifest";
const LanguageCacheKey = "d2gunsmith_2_language";

class CacheService {
    private readonly dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.openIndexedDb();
    }

    // TODO: support caching settings e.g. language, show crafted bonus, etc.
    // TODO: use DB or local storage for settings?
    // TODO: open DB in constructor?
    // TODO: when to close DB?
    public getCachedManifest = () => this.getValue<ICachedManifest>(ManifestCacheKey);
    public setCachedManifest = async (cachedManifest: ICachedManifest) => this.setValue(ManifestCacheKey, cachedManifest);

    public getLanguage = async () => this.getValue<ILanguageInfo>(LanguageCacheKey);
    public setLanguage = async (language: ILanguageInfo) => this.setValue(LanguageCacheKey, language);

    private getValue = async <T>(key: IDBValidKey | IDBKeyRange): Promise<T | undefined> => {
        const objectStore = await this.getObjectStore("readonly");
        const value = await this.getValueFromObjectStore<T>(objectStore, key);
        return value;
    }

    private setValue = async <T>(key: IDBValidKey, value: T) => {
        const objectStore = await this.getObjectStore("readwrite");
        await this.setValueInObjectStore(objectStore, key, value);
    }

    private getObjectStore = async (transactionMode: IDBTransactionMode) => {
        const db = await this.dbPromise;
        const transaction = db.transaction(ManifestObjectStoreName, transactionMode);
        const objectStore = transaction.objectStore(ManifestObjectStoreName);
        return objectStore;
    }

    private openIndexedDb = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const openRequest = window.indexedDB.open(ManifestDatabaseName, 1);
            openRequest.onsuccess = () => {
                resolve(openRequest.result);
            };
            openRequest.onerror = () => {
                reject(openRequest.error);
            };
            openRequest.onupgradeneeded = () => {
                const db = openRequest.result;
                // Use out-of-line keys
                db.createObjectStore(ManifestObjectStoreName, { autoIncrement: false, });
            };
        });
    }

    private getValueFromObjectStore = <T>(objectStore: IDBObjectStore, key: IDBValidKey | IDBKeyRange): Promise<T | undefined> => {
        return new Promise<T | undefined>((resolve, reject) => {
            const getRequest = objectStore.get(key);
            getRequest.onsuccess = () => { resolve(getRequest.result); };
            getRequest.onerror = () => { reject(getRequest.error); };
        });
    }

    private setValueInObjectStore = <T>(objectStore: IDBObjectStore, key: IDBValidKey, value: T) => {
        return new Promise<void>((resolve, reject) => {
            const setRequest = objectStore.put(value, key);
            setRequest.onsuccess = () => { resolve(); };
            setRequest.onerror = () => { reject(setRequest.error); };
        });
    }
}
export const cacheService = new CacheService();
