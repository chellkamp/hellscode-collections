import * as assert from "assert";

import { LinkedList } from "../../src/linkedList";

function validateListStructure<T>(list: LinkedList<T>, expectedValues: T[]): void {

    let i = 0;
    let curNode = list._head;

    while (curNode !== null && i < expectedValues.length) {
        assert.strictEqual(curNode.value, expectedValues[i], `Unexpected list value iterating from front.`);
        ++i;
        curNode = curNode.next;
    }

    assert.strictEqual(i, list.count, 'Incorrect count in list.');

    assert.strictEqual(i, expectedValues.length, 'List ends sooner than expected iterating from front.');
    assert.strictEqual(curNode, null, 'List does not end where expected iterating from front.');

    // iterate in reverse direction

    i = expectedValues.length - 1;
    curNode = list._tail;

    while (curNode !== null && i >= 0) {
        assert.strictEqual(curNode.value, expectedValues[i], `Unexpected list value iterating from back.`);
        --i;
        curNode = curNode.prev;
    }

    assert.strictEqual(i, -1, 'List ends sooner than expected iterating from back.');
    assert.strictEqual(curNode, null, 'List does not end where expected iterating from back.');

}

describe('Linked List Tests', function() {
    it('test insertion from front', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let list = new LinkedList<number>();
        testValues.forEach(element => {
            list.addFirst(element);
        });

        testValues.reverse();

        validateListStructure(list, testValues);
    });

    it('test deletion from front', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let list = new LinkedList<number>();
        testValues.forEach(element => {
            list.addLast(element);
        });

        // remove elements from front
        testValues.forEach(element =>{
            let actualVal = list.removeFirst();
            assert.strictEqual(actualVal, element);
        });

        validateListStructure(list, new Array());
    });

    it('test insertion from back', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let list = new LinkedList<number>();
        testValues.forEach(element => {
            list.addLast(element);
        });

        validateListStructure(list, testValues);
    });

    it('test deletion from back', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let list = new LinkedList<number>();
        testValues.forEach(element => {
            list.addLast(element);
        });

        testValues.reverse();

        // remove elements from back
        testValues.forEach(element =>{
            let actualVal = list.removeLast();
            assert.strictEqual(actualVal, element);
        });

        validateListStructure(list, new Array());
    });

    it('test iteration', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let list = new LinkedList<number>();
        testValues.forEach(element => {
            list.addLast(element);
        });

        let i = 0;
        list.forEach(element => {
            assert.strictEqual(element, testValues[i], `Expected value does not match at index ${i}.`);
            ++i;
        });

        assert.strictEqual(i, list.count, 'Incorrect iteration stop.');
    });
});