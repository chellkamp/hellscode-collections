import * as assert from 'assert';

import { Comparer } from '../../src/comparer';
import { PriorityQueue } from '../../src/priorityQueue';

function validateQueueStructure<T>(q: PriorityQueue<T>, comparer: Comparer<T>): void {
    // check that each element is greater or equal to its parent
    let coll = q._innerColl;

    for(let i = 1; i < coll.length; ++i) {
        let parentIdx = Math.floor((i - 1) / 2);
        assert.ok(comparer(coll[parentIdx], coll[i]) >= 0, `Invalid order: ${coll[parentIdx]} before ${coll[i]}`);
    }
}

function dequeueAndCheck<T>(q: PriorityQueue<T>, comparer: Comparer<T>, expectedValues: T[]): void {
    expectedValues.sort(comparer);
    expectedValues.reverse();

    for (let i = 0; i < expectedValues.length; ++i) {
        assert.strictEqual(q.count, expectedValues.length - i, 'Incorrect count.');

        let qVal = q.dequeue();
        assert.ok(qVal !== null, 'Queue element should not be null.');
        assert.strictEqual(qVal, expectedValues[i], 'Elements incorrectly sorted.');
    }

    assert.strictEqual(q.dequeue(), null);
}

let sortFunction: Comparer<number> = function(x: number, y: number): number{ return x - y; }



describe('PriorityQueue Tests', function() {
    it('test enqueue', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6 ,7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let q = new PriorityQueue<number>(sortFunction);

        testValues.forEach(element => {
            q.enqueue(element);
        });

        assert.strictEqual(q.count, testValues.length, 'Unexpected queue length.');
        
        validateQueueStructure(q, sortFunction);
    });

    it('test dequeue', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6 ,7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let q = new PriorityQueue<number>(sortFunction);

        testValues.forEach(element => {
            q.enqueue(element);
        });

        dequeueAndCheck(q, sortFunction, testValues.slice());
    });
});
