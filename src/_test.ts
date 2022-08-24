import './iterq-extensions'
import { IterQuery } from './iterq'

let a : number[] = [11,22,33,33];
let b : readonly number[] = [44,55,66,66];
let query = a.query(); // new IterQuery(a);

console.log(new IterQuery("test").reverse().toArray());
console.log('iterable', [...query]);
console.log('map', query.map((x,i)=>({i:i,x:x})).toArray());
console.log('filter', query.filter(x=>x>20).toArray());
console.log('skip', query.skip(2).toArray());
console.log('take', query.take(2).toArray());
console.log('group', query.group(x=>x).toArray());
console.log('concat', query.concat(b).toArray());
console.log('reverse', query.reverse().toArray());
console.log('sort', query.sort((a,b)=>a>b?-1:a<b?1:0).toArray());
console.log('find', query.find(x=>x>20));
console.log('reduce', query.reduce((a,x) => a+x, 0));
console.log('count', query.count());
console.log('any', query.any());
console.log('toArray', query.toArray());
console.log('toSet', query.toSet());
console.log('toMap', query.toMap(x=>x, (x,i)=>i));
console.log('done');
