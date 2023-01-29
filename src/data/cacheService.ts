import type { DestinyManifest, DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { Destiny2GameData } from "./types";

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

class CacheService {
    public getCachedManifest = async () => {
        const db = await this.openIndexedDb();
        const readTransaction = db.transaction(ManifestObjectStoreName, "readonly");
        const manifestObjectStore = readTransaction.objectStore(ManifestObjectStoreName);
        const manifest = await this.getManifestFromObjectStore(manifestObjectStore);
        return manifest;
    }

    public setCachedManifest = async (cachedManifest: ICachedManifest) => {
        const db = await this.openIndexedDb();
        const writeTransaction = db.transaction(ManifestObjectStoreName, "readwrite");
        const manifestObjectStore = writeTransaction.objectStore(ManifestObjectStoreName);
        await this.setManifestInObjectStore(manifestObjectStore, cachedManifest);
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

    private getManifestFromObjectStore = (objectStore: IDBObjectStore) => {
        return new Promise<ICachedManifest | undefined>((resolve, reject) => {
            const getRequest = objectStore.get(ManifestCacheKey);
            getRequest.onsuccess = () => { resolve(getRequest.result); };
            getRequest.onerror = () => { reject(getRequest.error); };
        });
    }

    private setManifestInObjectStore = (objectStore: IDBObjectStore, cachedManifest: ICachedManifest) => {
        return new Promise<void>((resolve, reject) => {
            const setRequest = objectStore.put(cachedManifest, ManifestCacheKey);
            setRequest.onsuccess = () => { resolve(); };
            setRequest.onerror = () => { reject(setRequest.error); };
        });
    }
}
export const cacheService = new CacheService();
