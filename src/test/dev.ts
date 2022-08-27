import { IterQuery } from '../iterq'

let a: number[] = [11, 22, 33, 33];
let b: readonly number[] = [44, 55, 66, 66];
let q = new IterQuery(a);

console.log('iterable', [...q]);
console.log('extension', [...a.iterq().reverse()]);
console.log('map', q.map((x, i) => ({ index: i, value: x })).toArray());
console.log('filter', q.filter(x => x > 20).toArray());
console.log('skip', q.skip(2).toArray());
console.log('take', q.take(2).toArray());
console.log('group', q.group(x => x).toArray());
console.log('concat', q.concat(b, a).toArray());
console.log('reverse', q.take(3).reverse().toArray());
console.log('sort', q.sort((a, b) => a > b ? -1 : a < b ? 1 : 0).toArray());
console.log('find', q.find(x => x > 20));
console.log('reduce', q.reduce((a, x) => a + x, 0));
console.log('count', q.concat(b).count());
console.log('any', q.any());
console.log('toArray', q.toArray());
console.log('toSet', q.toSet());
console.log('toMap', q.toMap(x => x, (x, i) => i));
console.log('forEach');
q.forEach((x, i) => console.log(` ${i}: ${x}`));
console.log('done');
