# iterq [![npm version](https://badge.fury.io/js/iterq.svg)](https://www.npmjs.com/package/iterq)
Memory usage optimization in cascading iterable queries

```ts
import { IterQuery } from "iterq";

let query = new IterQuery('someone iterable object for example')
    // filtering doesn't generate any arrays
    .filter(x => x != ' ')
    // grouping will create one temp Map, but only after executing the query
    .group(x => x)
    // mapping doesn't generate any arrays
    .map(g => ({ char: g[0], count: g[1].length }))
    // take/skip works like a filter
    .take(4); 

// query execution. callbacks/predicates has not been executed before this line
for (let x of query)
    console.log(x);

//// Console output:
// {char: 's', count: 1}
// {char: 'o', count: 4}
// {char: 'm', count: 2}
// {char: 'e', count: 7}
```
