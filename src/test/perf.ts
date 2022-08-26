import { IterQuery } from '../iterq'

let largeArray = new Array<number>(1000000).fill(0);
let largeMap = new Map(largeArray.map((x,i)=>[i,i]));
let largeSet = new Set(largeArray.map((x,i)=>i));

let time = (tag:string, fn:any) => { 
    const start = new Date(); 
    let res = fn(); 
    console.log(`${tag}: ${(new Date().getTime()-start.getTime())} ms`);
}
let comp = (tag:string, iterqFn:any, nativeFn:any) => {
    console.log(tag);
    time('  iterq ', iterqFn);
    time('  native', nativeFn); 
}

comp('test Arr',
    () => largeArray.iterq().map((x,i)=>({val:i})).filter(x=>x.val>0).filter(x=>x.val>0).filter(x=>x.val>0).toArray(),
    () => largeArray.map((x,i)=>({val:i})).filter(x=>x.val>0).filter(x=>x.val>0).filter(x=>x.val>0));

comp('map2val Arr',
    () => largeArray.iterq().map((x,i)=>i).toArray(),
    () => largeArray.map((x,i)=>i));

comp('map2obj Arr',
    () => largeArray.iterq().map((x,i)=>({val:i})).toArray(),
    () => largeArray.map((x,i)=>({val:i})));
    
comp('Map to Arr',
    () => largeMap.iterq().toArray(),
    () => [...largeMap]);
    
comp('Set to Arr',
    () => largeSet.iterq().toArray(),
    () => [...largeSet]);

comp('filter Arr',
    () => largeArray.iterq().filter(x=>x>=0).toArray(),
    () => largeArray.filter(x=>x>=0));
    
comp('filter Map',
    () => largeMap.iterq().filter(x=>x[0]>=0).toArray(),
    () => [...largeMap].filter(x=>x[0]>=0));
    
comp('filter Set',
    () => largeSet.iterq().filter(x=>x[0]>=0).toArray(),
    () => [...largeSet].filter(x=>x[0]>=0));
    
comp('count Arr',
    () => largeArray.iterq().count(),
    () => largeArray.length);
    
comp('count Map',
    () => largeMap.iterq().count(),
    () => [...largeMap].length);
   
comp('count Set',
    () => largeSet.iterq().count(),
    () => [...largeSet].length);
    
comp('concat Arr',
    () => largeArray.iterq().concat(largeArray).toArray(),
    () => [...largeArray, ...largeArray]);
    
comp('reverse Arr',
    () => largeArray.iterq().reverse().toArray(),
    () => [...largeArray].reverse());

console.log('done');