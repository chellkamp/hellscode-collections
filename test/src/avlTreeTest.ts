import * as assert from 'assert';
import { Comparer } from '../../src/comparer';
import { TreeNode, AVLTreeSet } from '../../src/avlTree'; 

function validateHeightsAndBalance<T>(node: TreeNode<T>): number {
    let leftSubHeight = node.left !== null ? validateHeightsAndBalance(node.left) : 0;
    let rightSubHeight = node.right !== null ? validateHeightsAndBalance(node.right) : 0;
    let expectedHeight = 1 + Math.max(leftSubHeight, rightSubHeight);

    let heightDiff = leftSubHeight - rightSubHeight;

    assert.strictEqual(node.subTreeHeight, expectedHeight, "subTreeHeight does not match expected value");
    assert.ok(Math.abs(heightDiff) < 2, `leftSubHeight - rightSubHeight = ${heightDiff}`);  

    return expectedHeight;
}

function getInorderTraversal<T>(node: TreeNode<T>, result: T[]): void {
    if (node.left !== null) {
        getInorderTraversal(node.left, result);
    }

    result.push(node.value);

    if (node.right !== null) {
        getInorderTraversal(node.right, result);
    }
}

function validateOrder<T>(tree: AVLTreeSet<T>): void {

    let foundValues: T[] = new Array();

    if (tree.root !== null) {
        getInorderTraversal(tree.root, foundValues);
    }

    if (foundValues.length > 1) {
        for (let i = 1; i < foundValues.length; ++i) {
            assert.ok(
                tree.comparer(foundValues[i], foundValues[i - 1]) > 0,
                `tree improperly sorted: ${foundValues.join(',')}`
            );
        }
    }
}

function countNodes<T>(node: TreeNode<T> | null): number {
    if (node === null) {
        return 0;
    }

    let retVal = 1;

    if (node !== null)
    if (node.left !== null) {
        retVal += countNodes(node.left);
    }

    if (node.right !== null) {
        retVal += countNodes(node.right);
    }

    return retVal;
}

let sortFunction: Comparer<number> = function(x: number, y: number): number{ return x - y; }

describe('AVL Tree Tests', function(){
    it('test insertion', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let tree = new AVLTreeSet<number>(sortFunction);

        testValues.forEach(element => {
            tree.insert(element);
            validateOrder(tree);
            validateHeightsAndBalance(tree.root as TreeNode<number>);
        });


        let foundNumNodes = countNodes(tree.root);
        assert.strictEqual(foundNumNodes, testValues.length, 'Unexpected number of nodes');

        testValues.forEach(element => {
            assert.ok(
                tree.hasValue(element),
                `Could not find expected value: ${element}`
            );
        });

    });

    it('test deletion', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let tree = new AVLTreeSet<number>(sortFunction);

        testValues.forEach(element => {
            tree.insert(element);
        });


        let deleteValidNodes: number[] = new Array(8, 10, 15, 1, 18, 11);
        let numNodesExpected = testValues.length;

        deleteValidNodes.forEach(element => {
            let deleteResult = tree.remove(element);
            assert.strictEqual(deleteResult, element, `valid element deletion incorrect result: ${deleteResult} for ${element}`);
            assert.ok(!tree.hasValue(element), `Deleted value "${element}" still in tree`);

            --numNodesExpected;
            let numNodesActual = countNodes(tree.root);

            assert.strictEqual(numNodesActual, numNodesExpected, "Unexpected node count after deletion.");
        });
    });

    it('test iteration', function(){
        let testValues: number[] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11);

        let tree = new AVLTreeSet<number>(sortFunction);

        testValues.forEach(element => {
            tree.insert(element);
        });

        testValues.sort(sortFunction);

        let i = 0;
        tree.forEach(element => {
            assert.strictEqual(element, testValues[i], `Unexpected value in iteration for index ${i}`);
            ++i;
        });
    });
});