import { CacheService } from "./cacheService";
import { DataSearchStrings } from "./dataSearchStringService";
import { DestinyApiService } from "./destinyApiService";
import { DestinyDataService } from "./destinyDataService";
import { SelectionService } from "./selectionService";

const cacheService = new CacheService();
const destinyApiService = new DestinyApiService(cacheService);

export const destinyDataService = new DestinyDataService(destinyApiService);
export const selectionService = new SelectionService(cacheService);

export {
    DataSearchStrings,
};
