/**
 * @fileoverview ID generation utilities for Closure Next.
 * @license Apache-2.0
 */

/**
 * Generates unique IDs for components
 */
export class IdGenerator {
  private static instance: IdGenerator;
  private counter = 0;

  private constructor() {}

  /**
   * Gets the singleton instance
   */
  static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  /**
   * Gets the next unique ID
   */
  getNextUniqueId(): string {
    return `closure-next-${++this.counter}`;
  }
}
