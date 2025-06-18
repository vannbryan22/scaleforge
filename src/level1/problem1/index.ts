export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Buffer
  | Map<unknown, unknown>
  | Set<unknown>
  | Array<Value>
  | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  // Handle null, undefined, and primitives
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (value instanceof Map) {
    return { __t: 'Map', __v: Array.from(value.entries()) };
  }

  if (value instanceof Set) {
    return { __t: 'Set', __v: Array.from(value) };
  }

  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }

  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', __v: Array.from(value) };
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }

  if (typeof value === 'object') {
    const result: { [key: string]: unknown } = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = serialize(val);
    }
    return result;
  }

  return value;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  // Handle null, undefined, and primitives
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value as T;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => deserialize(item)) as T;
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    const obj = value as { [key: string]: unknown };

    // Check for special type markers
    if ('__t' in obj && '__v' in obj) {
      const type = obj.__t as string;
      const val = obj.__v;

      switch (type) {
        case 'Date':
          return new Date(val as number) as T;
        case 'Buffer':
          return Buffer.from(val as number[]) as T;
        case 'Map':
          return new Map(val as [unknown, unknown][]) as T;
        case 'Set':
          return new Set(val as unknown[]) as T;
      }
    }

    // Handle plain objects
    const result: { [key: string]: unknown } = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = deserialize(val);
    }
    return result as T;
  }

  return value as T;
}
