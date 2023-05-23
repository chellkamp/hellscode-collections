# hellscode-collections
Collections library for TypeScript/JavaScript.

**Author:** *Christopher Hellkamp ([chris.hellkamp@gmail.com](mailto:chris.hellkamp@gmail.com))*

JavaScript lacks some common generic collections out-of-the-box, such as heaps and trees.  I needed some for my own projects and bundled them into a package for anyone else.

Source for this package is written in TypeScript.

## Dependencies
### Usage Dependencies
- Uses "node16" TypeScript module resolution.


### Dependencies for Development/Test
- @types/mocha: 10.0.1,
- @types/node: 20.1.7,
- mocha: 10.2.0,
- typescript: 5.0.4

## Collections offered

### AVLTreeSet
Sorted set collection implemented as a self-balancing binary tree. Each element can only exist once in the tree.

```
import { AVLTreeSet } from "hellscode-collections";

let tree = new AVLTreeSet<number>(function(x: number, y: number): number {
    return x - y;
});

tree.insert(5);
tree.insert(10);

console.log(tree.hasValue(5)); // true
console.log(tree.hasValue(0)); // false

console.log(tree.remove(10)); // 10
```

### PriorityQueue
Max heap implementation of a priority queue.

```
import { PriorityQueue } from "hellscode-collections";

let q = new PriorityQueue<number>((x: number, y: number)=>{return x - y});

q.enqueue(3);
q.enqueue(3);
q.enqueue(10);
q.enqueue(1);

console.log(q.dequeue()); // 10
console.log(q.dequeue()); // 3
console.log(q.dequeue()); // 3
console.log(q.dequeue()); // 1
console.log(q.dequeue()); // null
```

### LinkedList
Doubly-linked list.  Elements can be added to the back or the front.

```
import { LinkedList } from "hellscode-collections";

let list = new LinkedList<number>();

list.addLast(1);
list.addFirst(2);
list.addLast(3);
list.addFirst(4);

// list, from first to last, is in order {4, 2, 1, 3}

console.log(list.removeFirst()); // 4
console.log(list.removeLast()); // 3

// remove last two
list.removeFirst();
list.removeFirst();

console.log(list.removeFirst()) // null
console.log(list.removeLast()); // null
```

## Development Actions

### Clean/Build source for package

If you're modifying this package for your own needs and want to run `npm pack` to bundle the useful parts up, you'll want
to *build* first.

If you've been deleting or moving files, you may want to start with a clean build directory:
> npm run cleanPackage

Build the source files into *lib*:
> npm run buildPackage

### Unit Tests

This package currently uses the *mocha* testing framework to run unit tests found in the *test/src* directory. To run unit testing,
you'll need to transpile the \*.ts files from the *test/src* directory into \*.js files under the *test/lib* directory.

Clean test build area, if desired:
> npm run cleanTest

Build test source files into *test/lib*:
> npm run buildTest

Run the tests on the newly-built JS files:
> npm run test
