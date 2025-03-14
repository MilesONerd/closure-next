/**
 * @fileoverview Array utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Performs binary search on a sorted array
 */
export function binarySearch(array, target, compareFn) {
    let left = 0;
    let right = array.length;
    const compare = compareFn || defaultCompare;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const compareResult = compare(array[mid], target);
        if (compareResult < 0) {
            left = mid + 1;
        }
        else if (compareResult > 0) {
            right = mid;
        }
        else {
            return mid;
        }
    }
    return -left - 1;
}
/**
 * Default comparison function
 */
function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
/**
 * Removes the first occurrence of an element from an array
 */
export function remove(array, element) {
    const index = array.indexOf(element);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
/**
 * Inserts an element into an array at the given index
 */
export function insertAt(array, element, index) {
    array.splice(index, 0, element);
}
//# sourceMappingURL=array.js.map
