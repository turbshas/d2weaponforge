import type { DestinyManifest, DestinyManifestSlice } from "bungie-api-ts/destiny2";

type UsedDestinyManifestSlice = DestinyManifestSlice<(
    "DestinyEnergyTypeDefinition"
    | "DestinyDamageTypeDefinition"
    | "DestinyEquipmentSlotDefinition"
    | "DestinyItemCategoryDefinition"
    | "DestinyItemTierTypeDefinition"
    | "DestinySeasonDefinition"
    | "DestinyInventoryItemDefinition"
    | "DestinyPlugSetDefinition"
    | "DestinyStatDefinition"
    | "DestinySandboxPerkDefinition"
    | "DestinySocketCategoryDefinition"
    | "DestinySocketTypeDefinition"
    | "DestinyPowerCapDefinition"
)[]>;

interface ICachedManifest {
    manifestInfo: DestinyManifest;
    manifestData: UsedDestinyManifestSlice;
}

const ManifestDatabaseName = "d2gunsmith_2_manifest_database";
const ManifestObjectStoreName = "manifestObjectStore";
const ManifestInfoIndexName = "manifestInfo";
const ManifestIndexName = "manifestData";
const ManifestCacheKey = "d2gunsmith_2_destiny_manifest";

class CacheService {
    public getCachedManifest = async () => {
        const start = Date.now();
        const db = await this.openIndexedDb();
        const readTransaction = db.transaction(ManifestObjectStoreName, "readonly");
        const manifestObjectStore = readTransaction.objectStore(ManifestObjectStoreName);
        const manifest = await this.getManifestFromObjectStore(manifestObjectStore);
        const end = Date.now();
        console.log("retrieving cache took", end - start);
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
                const objectStore = db.createObjectStore(ManifestObjectStoreName, { autoIncrement: false, });
                // One column for the manifest info (metadata), one for the manifest itself
                objectStore.createIndex(ManifestInfoIndexName, ManifestInfoIndexName, { unique: false, });
                objectStore.createIndex(ManifestIndexName, ManifestIndexName, { unique: false, });
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
