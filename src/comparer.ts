/**
 * @param x first object
 * @param y second object
 * @returns positive number if x > y, negative number if y > x, or 0 if x == y.
 */
export type Comparer<T> = (x: T, y: T) => number;
