export interface IPartsManager<T> {
    getPartByName(name: string): T;
    setVisibleForAllParts(value: boolean): void;
    unhideParts(partsNames: string[]): void;
}
