const arrayConstructors = new Set([String, Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array]);

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
                for (let x of self._iterable)
                    yield fn(x, i++);
            },
        });
    }

    public filter(predicate: (value: T, index: number) => unknown): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    if (predicate(x, i++))
                        yield x;
            },
        });
    }

    public group<K>(keyFn: (value: T, index: number) => K): IterQuery<readonly [K, T[]]> {
        const self = this;
        return new IterQuery<readonly [K, T[]]>({
            [Symbol.iterator]: function* () {
                const map = new Map<K, T[]>();
                let i = 0, key: K, vals: T[] | undefined;
                for (let x of self._iterable) {
                    key = keyFn(x, i++);
                    vals = map.get(key);
                    if (!vals) map.set(key, [x]);
                    else vals.push(x);
                }
                yield* map;
            },
        });
    }

    public concat(...iterables: Iterable<T>[]): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                yield* self._iterable;
                for (let x of iterables)
                    yield* x;
            },
        });
    }

    public skip(count: number): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                const iter = self._iterable[Symbol.iterator]();
                let cur = iter.next(), i = 0;
                while (!cur.done && i++ < count)
                    cur = iter.next();
                while (!cur.done) {
                    yield cur.value;
                    cur = iter.next();
                }
            },
        });
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
        return new IterQuery<T>({
            [Symbol.iterator]: () => [...this._iterable].sort(compareFn)[Symbol.iterator](),
        });
    }

    public reverse(): IterQuery<T> {
        const self = this;
        return new IterQuery<T>({
            [Symbol.iterator]: function* () {
                if (self._isArray()) {
                    const arr = self._iterable as T[];
                    for (let i = arr.length - 1; i >= 0; i--)
                        yield arr[i];
                }
                else yield* [...self._iterable].reverse();
            },
        });
    }

    public find(predicate: (value: T, index: number) => unknown): T | undefined {
        let i = 0;
        for (let x of this._iterable)
            if (predicate(x, i++))
                return x;
        return undefined;
    }

    public reduce<TResult>(fn: (accumulator: TResult, value: T, index: number) => TResult, initialValue: TResult): TResult {
        let i = 0;
        for (let x of this._iterable)
            initialValue = fn(initialValue, x, i++);
        return initialValue;
    }

    public count(): number {
        if (this._isArray())
            return (this._iterable as T[]).length;

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

    public toMap<K, V>(keyFn: (value: T, index: number) => K, valFn: (value: T, index: number) => V): Map<K, V> {
        return new Map(this.map<readonly [K, V]>((x, i) => [keyFn(x, i), valFn(x, i)]));
    }

    public forEach(fn: (value: T, index: number) => void) {
        let i = 0; for (let x of this._iterable) fn(x, i++);
    }

    private _isArray() {
        return arrayConstructors.has((this._iterable as any).constructor);
    }
}