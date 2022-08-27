# iterq [![npm version](https://badge.fury.io/js/iterq.svg)](https://www.npmjs.com/package/iterq)
Memory usage optimization in cascading iterable queries

```ts
import { IterQuery } from "iterq";

new IterQuery("someone iterable object")
    .filter(x => x != ' ')
    .group(x => x)
    .map(g => ({ char:g[0], count:g[1].length }))
    .take(4)
    // callbacks/predicates has not been executed before this line
    .forEach(x => console.log(x));

//// console output
// {char: 's', count: 1}
// {char: 'o', count: 3}
// {char: 'm', count: 1}
// {char: 'e', count: 5}
```
