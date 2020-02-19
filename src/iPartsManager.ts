export interface IPartsManager<T> {
    resetMaterial(): void;
    getPartByName(name: string): T;
    setVisibleForAllParts(value: boolean): void;
    unhideParts(partsNames: string[]): void;
}
