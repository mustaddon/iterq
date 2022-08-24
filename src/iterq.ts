export interface Grouping<K, V> {
    readonly key: K;
    readonly values: V[];
}

export class IterQuery<T> implements Iterable<T> {
    constructor(iterable: Iterable<T>) { 
        this._iterable = iterable;
    }

    private readonly _iterable: Iterable<T>;

    [Symbol.iterator](): Iterator<T> {
        return this._iterable[Symbol.iterator]();
    }

    public map<TNew>(fn: (value: T, index: number) => TNew): IterQuery<TNew> {
        const self = this;
        return new IterQuery<TNew>({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable) yield fn(x, i++);
            },
        });
    }

    public filter(predicate: (value: T, index: number) => unknown): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    if (predicate(x, i++)) yield x;
            },
        });
    }

    public group<K>(keyFn: (value: T, index: number) => K): IterQuery<Grouping<K, T>> {
        const self = this;
        return new IterQuery<Grouping<K, T>>({
            [Symbol.iterator]: function* () {
                const map = new Map<K, T[]>();
                let i = 0;

                for (let x of self._iterable) {
                    let key = keyFn(x, i++);
                    let val = map.get(key);
                    if (!val) map.set(key, (val = []));
                    val.push(x);
                }

                for (let x of map) yield { key: x[0], values: x[1] };
            },
        });
    }

    public concat(...iterables: Iterable<T>[]): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                for (let x of self._iterable) yield x;
                for (let x of iterables) 
                    for (let xx of x) yield xx;
            },
        });
    }

    public skip(count: number): IterQuery<T> {
        return this.filter((x, i) => i >= count);
    }

    public take(count: number): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    if (i++ < count) yield x;
                    else break;
            },
        });
    }

    public sort(compareFn?: (a: T, b: T) => number): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: () => [...self._iterable].sort(compareFn)[Symbol.iterator](),
        });
    }

    public reverse(): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: () => [...self._iterable].reverse()[Symbol.iterator](),
        });
    }

    public find(predicate: (value: T, index: number) => unknown): T | undefined {
        let i = 0;
        for (let x of this._iterable)
            if (predicate(x, i++)) return x;
        return undefined;
    }

    public reduce<TResult>(fn: (accumulator: TResult, value: T, index: number) => TResult, initialValue: TResult): TResult {
        let i = 0;
        for (let x of this._iterable) initialValue = fn(initialValue, x, i++);
        return initialValue;
    }

    public count(): number {
        let result = 0;
        for (let x of this._iterable) result++;
        return result;
    }

    public any(): boolean {
        return !this._iterable[Symbol.iterator]().next().done;
    }

    public toArray(): T[] {
        return [...this._iterable];
    }

    public toSet(): Set<T> {
        return new Set(this._iterable);
    }

    public toMap<K,V>(keyFn: (value: T, index: number) => K, valFn: (value: T, index: number) => V): Map<K,V> {
        return new Map(this.map<readonly [K, V]>((x,i) => [keyFn(x, i), valFn(x, i)]));
    }
    
    public forEach(fn: (value: T, index: number) => void) {
        let i = 0;
        for (let x of this._iterable) fn(x, i++);
    }
}
