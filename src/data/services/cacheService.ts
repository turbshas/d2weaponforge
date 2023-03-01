import type { DestinyManifest, DestinyManifestLanguage } from "bungie-api-ts/destiny2";
import type { Destiny2GameData, ILanguageInfo } from "../interfaces";

interface ICachedManifest {
    /** Version specific to this app, and the data it expects from the cache. Not the Bungie manifest version. */
    version: number;
    language: DestinyManifestLanguage;
    manifestInfo: DestinyManifest;
    manifestData: Destiny2GameData;
}

interface IPreferences {
    language: ILanguageInfo;
    hideRetiredPerks: boolean;
    showCraftedBonus: boolean;
    rawStatValues: boolean;
}

const ManifestDatabaseName = "d2weaponforge_manifest_database";
const ManifestObjectStoreName = "manifestObjectStore";
const PreferencesCacheKey = "d2weaponforge_preferences";

const VersionKey = "version";
const LanguageKey = "language";
const ManifestInfoKey = "manifest_info";

export class CacheService {
    private readonly dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.openIndexedDb();
    }

    // TODO: support caching settings e.g. language, show crafted bonus, etc.
    // TODO: when to close DB?
    public getCachedManifest = async () => {
        const objectStore = await this.getObjectStore("readonly");

        const promises = [
            this.getValueFromObjectStore<number>(objectStore, VersionKey),
            this.getValueFromObjectStore<DestinyManifestLanguage>(objectStore, LanguageKey),
            this.getValueFromObjectStore<DestinyManifest>(objectStore, ManifestInfoKey),

            this.getGameDataPropertyFromObjectStore(objectStore, "collectionsLists"),
            this.getGameDataPropertyFromObjectStore(objectStore, "damageTypes"),
            this.getGameDataPropertyFromObjectStore(objectStore, "itemTierTypes"),
            this.getGameDataPropertyFromObjectStore(objectStore, "masterworkLookup"),
            this.getGameDataPropertyFromObjectStore(objectStore, "modLookup"),
            this.getGameDataPropertyFromObjectStore(objectStore, "perkInsights"),
            this.getGameDataPropertyFromObjectStore(objectStore, "perkLookup"),
            this.getGameDataPropertyFromObjectStore(objectStore, "seasons"),
            this.getGameDataPropertyFromObjectStore(objectStore, "weaponTypes"),
            this.getGameDataPropertyFromObjectStore(objectStore, "weapons"),
        ] as const;

        const [
            version,
            language,
            manifestInfo,

            collectionsLists,
            damageTypes,
            itemTierTypes,
            masterworkLookup,
            modLookup,
            perkInsights,
            perkLookup,
            seasons,
            weaponTypes,
            weapons,
        ] = await Promise.all(promises);

        if (!version
            || !language
            || !manifestInfo
            || !collectionsLists
            || !damageTypes
            || !itemTierTypes
            || !masterworkLookup
            || !modLookup
            || !perkInsights
            || !perkLookup
            || !seasons
            || !weaponTypes
            || !weapons) {
                return undefined;
            }

        const gameData: Destiny2GameData = {
            collectionsLists: collectionsLists,
            damageTypes: damageTypes,
            itemTierTypes: itemTierTypes,
            masterworkLookup: masterworkLookup,
            modLookup: modLookup,
            perkInsights: perkInsights,
            perkLookup: perkLookup,
            seasons: seasons,
            weaponTypes: weaponTypes,
            weapons: weapons,
        };
        const cachedManifest: ICachedManifest = {
            version: version,
            language: language,
            manifestInfo: manifestInfo,
            manifestData: gameData,
        };
        return cachedManifest;
    }

    public setCachedManifest = async (cachedManifest: ICachedManifest) => {
        const objectStore = await this.getObjectStore("readwrite");

        const promises = [
            this.setValueInObjectStore(objectStore, cachedManifest.version, VersionKey),
            this.setValueInObjectStore(objectStore, cachedManifest.language, LanguageKey),
            this.setValueInObjectStore(objectStore, cachedManifest.manifestInfo, ManifestInfoKey),

            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.collectionsLists, "collectionsLists"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.damageTypes, "damageTypes"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.itemTierTypes, "itemTierTypes"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.masterworkLookup, "masterworkLookup"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.modLookup, "modLookup"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.perkInsights, "perkInsights"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.perkLookup, "perkLookup"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.seasons, "seasons"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.weaponTypes, "weaponTypes"),
            this.setGameDataPropertyInObjectStore(objectStore, cachedManifest.manifestData.weapons, "weapons"),
        ] as const;

        await Promise.all(promises);
    }

    public getPreferences = async () => this.getValue<IPreferences>(PreferencesCacheKey);
    public setPreferences = async (preferences: IPreferences) => { this.setValue(PreferencesCacheKey, preferences); }

    private getValue = async <T>(key: IDBValidKey | IDBKeyRange): Promise<T | undefined> => {
        const objectStore = await this.getObjectStore("readonly");
        const value = await this.getValueFromObjectStore<T>(objectStore, key);
        return value;
    }

    private setValue = async <T>(key: IDBValidKey, value: T) => {
        const objectStore = await this.getObjectStore("readwrite");
        await this.setValueInObjectStore(objectStore, value, key);
    }

    private getGameDataPropertyFromObjectStore = async <T extends keyof Destiny2GameData>
        (
            objectStore: IDBObjectStore,
            property: T
        ) => {
        return await this.getValueFromObjectStore<Destiny2GameData[T]>(objectStore, property);
    }

    private setGameDataPropertyInObjectStore = async <T extends keyof Destiny2GameData>
        (
            objectStore: IDBObjectStore,
            value: Destiny2GameData[T],
            property: T
        ) => {
        await this.setValueInObjectStore(objectStore, value, property);
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
            openRequest.onupgradeneeded = (ev) => {
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

    private setValueInObjectStore = <T>(objectStore: IDBObjectStore, value: T, key?: IDBValidKey) => {
        return new Promise<void>((resolve, reject) => {
            const setRequest = objectStore.put(value, key);
            setRequest.onsuccess = () => { resolve(); };
            setRequest.onerror = () => { reject(setRequest.error); };
        });
    }
}
