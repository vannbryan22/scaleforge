export class ObjectId {
  private data: Buffer;
  private static randomValue: number;
  private static counter: number;

  constructor(type: number, timestamp: number) {
    // Initialize static values if not already done
    if (ObjectId.randomValue === undefined) {
      ObjectId.randomValue = Math.floor(Math.random() * 0xffffffff);
      ObjectId.counter = Math.floor(Math.random() * 0xffffff);
    }

    this.data = Buffer.allocUnsafe(14);

    // Write timestamp (6 bytes) - most significant for lexicographic ordering
    // Convert timestamp to 6-byte big-endian format
    const timestampBuffer = Buffer.allocUnsafe(8);
    timestampBuffer.writeBigUInt64BE(BigInt(timestamp), 0);
    // Copy 6 bytes manually
    for (let i = 0; i < 6; i++) {
      this.data[i] = timestampBuffer[i + 2];
    }

    // Write type (1 byte)
    this.data.writeUInt8(type, 6);

    // Write random value (4 bytes)
    this.data.writeUInt32BE(ObjectId.randomValue, 7);

    // Write counter (3 bytes) and increment
    this.data.writeUIntBE(ObjectId.counter, 11, 3);

    ObjectId.counter = (ObjectId.counter + 1) % 0x1000000; // Wrap around at 24 bits
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}
