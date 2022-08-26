import { IterQuery } from './iterq'

const iterExpTag = 'iterq';
const iterExpFn = function<T>(this: Iterable<T>) { return new IterQuery<T>(this); };

for(let x of [Array, Set, Map] as any)
    if(!x.prototype[iterExpTag])
        x.prototype[iterExpTag] = iterExpFn;
        
declare global {
    interface Array<T> {
        [iterExpTag](): IterQuery<T>;
    }
    interface Set<T> {
        [iterExpTag](): IterQuery<T>;
    }
    interface Map<K,V> {
        [iterExpTag](): IterQuery<readonly [K,V]>;
    }
}