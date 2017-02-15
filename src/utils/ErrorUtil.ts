/**
 * utils/ErrorUtil.ts
 */

export class Err extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: number) {
    super(message);
  }
}
