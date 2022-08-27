export declare class IterQuery<T> implements Iterable<T> {
    constructor(iterable: Iterable<T>);
    private readonly _iterable;
    [Symbol.iterator](): Iterator<T>;
    map<TNew>(fn: (value: T, index: number) => TNew): IterQuery<TNew>;
    filter(predicate: (value: T, index: number) => unknown): IterQuery<T>;
    group<K>(keyFn: (value: T, index: number) => K): IterQuery<readonly [K, T[]]>;
    concat(...iterables: Iterable<T>[]): IterQuery<T>;
    skip(count: number): IterQuery<T>;
    take(count: number): IterQuery<T>;
    sort(compareFn?: (a: T, b: T) => number): IterQuery<T>;
    reverse(): IterQuery<T>;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    reduce<TResult>(fn: (accumulator: TResult, value: T, index: number) => TResult, initialValue: TResult): TResult;
    count(): number;
    any(): boolean;
    toArray(): T[];
    toSet(): Set<T>;
    toMap<K, V>(keyFn: (value: T, index: number) => K, valFn: (value: T, index: number) => V): Map<K, V>;
    forEach(fn: (value: T, index: number) => void): void;
    private _isArray;
}
