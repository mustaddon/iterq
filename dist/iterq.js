const arrayConstructors = new Set([String, Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array]);
export class IterQuery {
    constructor(iterable) {
        this._iterable = iterable;
    }
    [Symbol.iterator]() {
        return this._iterable[Symbol.iterator]();
    }
    map(fn) {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    yield fn(x, i++);
            },
        });
    }
    filter(predicate) {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    if (predicate(x, i++))
                        yield x;
            },
        });
    }
    group(keyFn) {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                const map = new Map();
                let i = 0, key, vals;
                for (let x of self._iterable) {
                    key = keyFn(x, i++);
                    vals = map.get(key);
                    if (!vals)
                        map.set(key, [x]);
                    else
                        vals.push(x);
                }
                yield* map;
            },
        });
    }
    concat(...iterables) {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                yield* self._iterable;
                for (let x of iterables)
                    yield* x;
            },
        });
    }
    skip(count) {
        const self = this;
        return new IterQuery({
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
    take(count) {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (let x of self._iterable)
                    if (i++ < count)
                        yield x;
                    else
                        break;
            },
        });
    }
    sort(compareFn) {
        return new IterQuery({
            [Symbol.iterator]: () => [...this._iterable].sort(compareFn)[Symbol.iterator](),
        });
    }
    reverse() {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: function* () {
                if (self._isArray()) {
                    const arr = self._iterable;
                    for (let i = arr.length - 1; i >= 0; i--)
                        yield arr[i];
                }
                else
                    yield* [...self._iterable].reverse();
            },
        });
    }
    find(predicate) {
        let i = 0;
        for (let x of this._iterable)
            if (predicate(x, i++))
                return x;
        return undefined;
    }
    reduce(fn, initialValue) {
        let i = 0;
        for (let x of this._iterable)
            initialValue = fn(initialValue, x, i++);
        return initialValue;
    }
    count() {
        if (this._isArray())
            return this._iterable.length;
        let result = 0;
        for (let x of this._iterable)
            result++;
        return result;
    }
    any() {
        return !this._iterable[Symbol.iterator]().next().done;
    }
    toArray() {
        return [...this._iterable];
    }
    toSet() {
        return new Set(this._iterable);
    }
    toMap(keyFn, valFn) {
        return new Map(this.map((x, i) => [keyFn(x, i), valFn(x, i)]));
    }
    forEach(fn) {
        let i = 0;
        for (let x of this._iterable)
            fn(x, i++);
    }
    _isArray() {
        return arrayConstructors.has(this._iterable.constructor);
    }
}
//# sourceMappingURL=iterq.js.map