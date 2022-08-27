import { IterQuery } from '../iterq'

let a : number[] = [11,22,33,33];
let b : readonly number[] = [44,55,66,66];
let query = new IterQuery(a);

console.log('iterable', [...query]);
console.log('extension', [...a.iterq().reverse()]);
console.log('map', query.map((x,i)=>({index:i,value:x})).toArray());
console.log('filter', query.filter(x=>x>20).toArray());
console.log('skip', query.skip(2).toArray());
console.log('take', query.take(2).toArray());
console.log('group', query.group(x=>x).toArray());
console.log('concat', query.concat(b,a).toArray());
console.log('reverse', query.reverse().toArray());
console.log('sort', query.sort((a,b)=>a>b?-1:a<b?1:0).toArray());
console.log('find', query.find(x=>x>20));
console.log('reduce', query.reduce((a,x) => a+x, 0));
console.log('count', query.concat(b).count());
console.log('any', query.any());
console.log('toArray', query.toArray());
console.log('toSet', query.toSet());
console.log('toMap', query.toMap(x=>x, (x,i)=>i));
console.log('forEach');
query.forEach((x,i)=>console.log(` ${i}: ${x}`));
console.log('done');
