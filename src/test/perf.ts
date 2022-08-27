import { IterQuery } from '../iterq'

let largeArray = new Array<number>(1000000).fill(0).map((x,i)=>i);
let largeMap = new Map(largeArray.map(x=>[x,x]));

let time = (tag:string, fn:any) => { 
    const start = new Date(); 
    let res = fn().test; 
    console.log(`${tag}: ${(new Date().getTime()-start.getTime())} ms`);
}
let comp = (tag:string, iterqFn:any, nativeFn:any) => {
    console.log(tag);
    time('  iterq ', iterqFn);
    time('  native', nativeFn); 
}


comp('fmf Arr',
    () => largeArray.iterq().filter(x=>x>1000).map((x,i)=>({val:i})).filter(x=>x.val>10000).toArray(),
    () => largeArray.filter(x=>x>1000).map((x,i)=>({val:i})).filter(x=>x.val>10000));

comp('map Arr',
    () => largeArray.iterq().map((x,i)=>({val:i})).toArray(),
    () => largeArray.map((x,i)=>({val:i})));

comp('filter Arr',
    () => largeArray.iterq().filter(x=>x>1000).toArray(),
    () => largeArray.filter(x=>x>1000));
    
comp('filter Map',
    () => largeMap.iterq().filter(x=>x[0]>1000).toArray(),
    () => [...largeMap].filter(x=>x[0]>1000));
    
comp('count Arr',
    () => largeArray.iterq().count(),
    () => largeArray.length);
    
comp('count Map',
    () => largeMap.iterq().count(),
    () => [...largeMap].length);
    
comp('concat Arr',
    () => largeArray.iterq().concat(largeArray).toArray(),
    () => largeArray.concat(largeArray));
    
comp('reverse Arr',
    () => largeArray.iterq().reverse().toArray(),
    () => [...largeArray].reverse());

console.log('done');