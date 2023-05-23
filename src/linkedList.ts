export class ListNode<T> {
    value: T;

    next: ListNode<T> | null = null;
    prev: ListNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }

}

/**
 * Implementation of a doubly-linked list.
 */
export class LinkedList<T> {
    _head: ListNode<T> | null = null;
    _tail: ListNode<T> | null = null;
    _count = 0;

    /**
     * @returns First item in list, if exists.  Otherwise, null.
     */
    get first(): T | null {
        return this._head !== null ? this._head.value : null;
    }

    /**
     * @returns Last item in list, if exists.  Otherwise, null.
     */
    get last(): T | null {
        return this._tail !== null ? this._tail.value : null;
    }

    /**
     * @returns number of items in list.
     */
    get count() {
        return this._count;
    }

    /**
     * Add an item to the front of the list.
     * @param v value to add
     */
    addFirst(v: T): void {
        let newNode = new ListNode(v);

        if (this._head !== null) {
            this._head.prev = newNode;
            newNode.next = this._head; 
        } else {
            this._tail = newNode;
        }

        this._head = newNode;
        ++this._count;
    }

    /**
     * Add an item to the back of the list.
     * @param v value to add
     */
    addLast(v: T): void {
        let newNode = new ListNode(v);

        if (this._tail !== null) {
            this._tail.next = newNode;
            newNode.prev = this._tail;
        } else {
            this._head = newNode;
        }

        this._tail = newNode;
        ++this._count;
    }

    /**
     * Remove an item from the front of the list.
     * @returns Value removed, if exists.  Otherwise, null.
     */
    removeFirst(): T | null {
        let retVal: T | null = null;

        if (this._head !== null) {
            retVal = this._head.value;

            let nextNode = this._head.next;

            if (nextNode !== null) {
                nextNode.prev = null;
            } else {
                this._tail = null;
            }

            this._head = nextNode;
            --this._count;
        }

        return retVal;
    }

    /**
     * Remove item from the back of the list.
     * @returns Value removed, if exists.  Otherwise, null.
     */
    removeLast(): T | null {
        let retVal: T | null = null;

        if (this._tail !== null) {
            retVal = this._tail.value;

            let prevNode = this._tail.prev;

            if (prevNode !== null) {
                prevNode.next = null;
            } else {
                this._head = null;
            }

            this._tail = prevNode;
            --this._count;
        }

        return retVal;
    }

    /**
     * Iterates over the list, calling the specified function for each element.
     * @param callbackfn callback function
     */
    forEach(callbackfn: (element: T) => void):void {
        let curNode = this._head;
        while (curNode !== null) {
            callbackfn(curNode.value);
            curNode = curNode.next;
        }
    }
}