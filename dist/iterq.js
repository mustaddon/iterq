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
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: () => [...self._iterable].sort(compareFn)[Symbol.iterator](),
        });
    }
    reverse() {
        const self = this;
        return new IterQuery({
            [Symbol.iterator]: () => [...self._iterable].reverse()[Symbol.iterator](),
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
        const length = this._iterable.length;
        if (Number.isInteger(length))
            return length;
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
}
//# sourceMappingURL=iterq.js.map