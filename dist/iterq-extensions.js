import { IterQuery } from './iterq.js';
const iterExpTag = 'query';
const iterExpFn = function () { return new IterQuery(this); };
for (let x of [Array, Set, Map])
    if (!x.prototype[iterExpTag])
        x.prototype[iterExpTag] = iterExpFn;
//# sourceMappingURL=iterq-extensions.js.map