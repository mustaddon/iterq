import { IterQuery } from './iterq';
declare const iterExpTag = "query";
declare global {
    interface Array<T> {
        [iterExpTag](): IterQuery<T>;
    }
    interface Set<T> {
        [iterExpTag](): IterQuery<T>;
    }
    interface Map<K, V> {
        [iterExpTag](): IterQuery<readonly [K, V]>;
    }
}
export {};
