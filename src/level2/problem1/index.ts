export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private cache = new Map<string, Promise<TOutput>>();

  constructor(
    private readonly handler: (...args: TInputs) => Promise<TOutput>
  ) {}

  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    // Check if we already have a pending or completed execution for this key
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Create a new promise for this execution
    const promise = this.handler(...args);

    // Store the promise in the cache immediately
    this.cache.set(key, promise);

    // Return the promise
    return promise;
  }
}
