import { Comparer } from './comparer';

export class TreeNode<T> {
    value: T;
    left: TreeNode<T> | null = null;
    right: TreeNode<T> | null = null;
    subTreeHeight: number = 1;

    constructor(value: T) {
        this.value = value;
    }

    _adjustHeight(): void {
        let leftHeight = this._getLeftHeight();
        let rightHeight = this._getRightHeight();
        this.subTreeHeight = 1 + Math.max(leftHeight, rightHeight);
    }

    _getLeftHeight(): number {
        return this.left !== null ? this.left.subTreeHeight : 0;
    }

    _getRightHeight(): number {
        return this.right !== null ? this.right.subTreeHeight : 0;
    }

    _getHeightDiff(): number {
        return this._getRightHeight() - this._getLeftHeight();
    }

    setLeft(node: TreeNode<T> | null): void {
        this.left = node;
        this._adjustHeight();
    }

    setRight(node: TreeNode<T> | null): void {
        this.right = node;
        this._adjustHeight();
    }

    isLeaf(): boolean {
        return this.left === null && this.right === null;
    }
}

/**
 * Sorted set of items maintained in a balanced binary tree.
 */
export class AVLTreeSet<T> {
    root: TreeNode<T> | null = null;
    comparer: Comparer<T>;
    _count: number = 0;

    /**
     * @param comparer comparison function
     */
    constructor(comparer: Comparer<T>) {
        this.comparer = comparer;
    }

    _rebalance(nodeStack: TreeNode<T>[]) {
        // every node on nodeStack is a potential pivot point
        while (nodeStack.length > 0) {
            let curNode = nodeStack.pop() as TreeNode<T>;
            curNode._adjustHeight();
            let heightDiff = curNode._getHeightDiff();
        
            let parentNode = curNode === this.root ? null : nodeStack[nodeStack.length - 1];
        
            if (heightDiff > 1) {
                if (curNode.right!._getHeightDiff() < 0) {
                    this._rotateRight(curNode, curNode.right!);
                }
                this._rotateLeft(parentNode, curNode);
            } else if (heightDiff < -1) {
                if (curNode.left!._getHeightDiff() > 0) {
                    this._rotateLeft(curNode, curNode.left!);
                }
                this._rotateRight(parentNode, curNode);
            }
        }
        
    }

    _rotateLeft(parentNode: TreeNode<T> | null, node: TreeNode<T>): void {
        let nodeRight = node.right as TreeNode<T>;

        node.setRight(nodeRight.left);
        nodeRight.setLeft(node);

        if (parentNode === null) {
            this.root = nodeRight;
        } else if (parentNode.left === node) {
            parentNode.left = nodeRight;
        } else {
            parentNode.right = nodeRight;
        }
    }

    _rotateRight(parentNode: TreeNode<T> | null, node: TreeNode<T>): void {
        let nodeLeft = node.left as TreeNode<T>;

        node.setLeft(nodeLeft.right);
        nodeLeft.setRight(node);

        if (parentNode === null) {
            this.root = nodeLeft;
        } else if (parentNode.left === node) {
            parentNode.left = nodeLeft;
        } else {
            parentNode.right = nodeLeft;
        }
    }

    /**
     * @returns number of items in this collection
     */
    get count() {
        return this._count;
    }

    /**
     * Check if a value exists in the tree.
     * @param v value to check for
     * @returns true if value in tree; false otherwise
     */
    hasValue(v: T): boolean {
        let retVal = false;

        let curNode = this.root;
        while (!retVal && curNode !== null) {
            let compResult = this.comparer(v, curNode.value);

            if (compResult == 0) {
                retVal = true;
            } else if (compResult < 0) {
                curNode = curNode.left;
            } else {
                curNode = curNode.right;
            }
        }

        return retVal;
    }

    /**
     * Attempt to insert a value into the set
     * @param v value to insert
     * @returns true if new value inserted; false if value already existed
     */
    insert(v: T): boolean {

        // If we have nothing in the tree to begin with, of course we're inserting the value.
        if (this.root === null) {
            this.root = new TreeNode<T>(v);
            ++this._count;
            return true;
        }

        let nodeStack: TreeNode<T>[] = new Array(); // traversal stack

        //First, insert the new value as a leaf in the tree.
        let curNode: TreeNode<T> | null = this.root;
        while (true) {
            let compResult = this.comparer(v, curNode.value);
            if (compResult == 0) {
                // this is a duplicate.  Don't insert.
                return false;
            }

            nodeStack.push(curNode);

            if (compResult < 0) {
                if (curNode.left !== null) {
                    curNode = curNode.left;
                } else {
                    curNode.setLeft(new TreeNode<T>(v));
                    break; // found it; done with the loop
                }
            } else {
                if (curNode.right !== null) {
                    curNode = curNode.right;
                } else {
                    curNode.setRight(new TreeNode<T>(v));
                    break; // found it; done with the loop
                }
            }

        }

        this._rebalance(nodeStack);

        ++this._count;
        return true;
    }// end insert()

    /**
     * 
     * @param v value to remove from set
     * @returns item removed, if found.  Otherwise, null.
     */
    remove(v: T): T | null {

        let nodeStack: TreeNode<T>[] = new Array();

        let curNode = this.root;

        // find node that needs to be deleted
        let found = false;
        while (!found && curNode !== null) {
            let compResult = this.comparer(v, curNode.value);

            if (compResult > 0) {
                nodeStack.push(curNode);
                curNode = curNode.right;
            } else if (compResult < 0) {
                nodeStack.push(curNode);
                curNode = curNode.left;
            } else {
                found = true;
            }
        }

        if (!found) {
            return null;
        }

        // At this point, curNode should not be null, and it will contain the value that needs to be removed from the tree.

        let retVal = curNode!.value;

        // while curNode is not a leaf...
        while (curNode !== null && !curNode.isLeaf()) {
            nodeStack.push(curNode);

            let nextNode: TreeNode<T>;

            if (curNode.right !== null) {
                // get leftmost of right subtree
                nextNode = curNode.right;
                while (nextNode.left !== null) {
                    nodeStack.push(nextNode);
                    nextNode = nextNode.left;
                }
                
            } else {
                // get rightmost of left subtree
                nextNode = curNode.left!;
                while (nextNode.right !== null) {
                    nodeStack.push(nextNode);
                    nextNode = nextNode.right;
                }
            }

            // let curNode take on nextNode's value
            curNode.value = nextNode.value;
            curNode = nextNode;
        }

        // curNode should now be a leaf that can be deleted.
        if (curNode === this.root) {
            this.root = null;
        } else {
            let parentNode: TreeNode<T>;
            parentNode = nodeStack[nodeStack.length - 1];
            
            if (parentNode.left === curNode) {
                parentNode.setLeft(null);
            } else {
                parentNode.setRight(null);
            }
        }

        // we need to bubble back up the nodes we traversed in order to re-balance the tree.
        this._rebalance(nodeStack);

        --this._count;
        return retVal;
    }

    _forEach(node: TreeNode<T>, callbackfn: (item: T) => void): void {
        if (node.left !== null) {
            this._forEach(node.left, callbackfn);
        }

        callbackfn(node.value);

        if (node.right !== null) {
            this._forEach(node.right, callbackfn);
        }
    }

    /**
     * Iterates through the set's elements, in sorted order, calling a given function
     * for each value.
     * @param callbackfn Operation to perform for a given value
     */
    forEach(callbackfn: (item: T) => void): void {
        // inorder traversal
        if (this.root !== null) {
            this._forEach(this.root, callbackfn);
        }
    }
}
