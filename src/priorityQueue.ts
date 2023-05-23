import { Comparer } from "./comparer";

/**
 * Adds and removes items based on relative priority, defined by a comparison function.
 */
export class PriorityQueue<T> {
    _innerColl: T[] = new Array();
    comparer: Comparer<T>;

    /**
     * @constructor
     * @param comparer comparison function 
     */
    constructor(comparer: Comparer<T>) {
        this.comparer = comparer;
    }

    /**
     * @returns number of items in this collection
     */
    get count() {
        return this._innerColl.length;
    }

    /**
     * Places an item on this queue.
     * @param v value to enqueue
     */
    enqueue(v: T): void {
        let coll = this._innerColl;

        coll.push(v);

        let curIdx = coll.length - 1;
        let done = false;
        while (!done) {
            let parentIdx = Math.floor((curIdx - 1) / 2);
            if (parentIdx < coll.length) {
                if (this.comparer(coll[curIdx], coll[parentIdx]) > 0) {
                    let temp = coll[curIdx];
                    coll[curIdx] = coll[parentIdx];
                    coll[parentIdx] = temp;
                    curIdx = parentIdx;
                } else {
                    // The parent has greater or equal priority, as it should be.
                    // We can stop here.
                    done = true;
                }
            } else {
                // we're already at the root.  Nowhere else to go.
                done = true;
            }
        }
    }

    /**
     * Removes and returns the highest-priority item in the queue.
     * @returns highest-priority item in the queue, if any items are in the queue.  Otherwise, null.
     */
    dequeue(): T | null {
        let retVal: T | null = null;

        let coll = this._innerColl;

        if (coll.length > 0) {
            retVal = coll[0];

            if (coll.length > 1) {
                // Replace root value with last element.
                coll[0] = coll.pop() as T;
            } else {
                // At root.  Just remove and discard.
                coll.pop();
            }

            let curIdx = 0;
            let done = false;
            while (!done) {
                let leftChildIdx = curIdx * 2 + 1;

                if (leftChildIdx < coll.length) {
                    let rightChildIdx = leftChildIdx + 1;

                    let maxChildIdx = leftChildIdx;
                    if (rightChildIdx < coll.length && this.comparer(coll[rightChildIdx], coll[leftChildIdx]) > 0) {
                        maxChildIdx = rightChildIdx;
                    }

                    if (this.comparer(coll[maxChildIdx], coll[curIdx]) > 0) {
                        // bubble down by swapping values
                        let temp = coll[curIdx];
                        coll[curIdx] = coll[maxChildIdx];
                        coll[maxChildIdx] = temp;
                        curIdx = maxChildIdx;
                    } else {
                        // both children have a lesser or equal priority than coll[curIdx].
                        // We can stop bubbling down.
                        done = true;
                    }

                } else {
                    // no children.  We can't bubble down any further.
                    done = true;
                }
            }
        }

        return retVal;
    }
}
