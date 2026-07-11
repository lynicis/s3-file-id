import type { IIdStrategy } from "./IIdStrategy";

// --- Bit sabitleri ---
const EPOCH = 1704067200000n; // 2024-01-01T00:00:00.000Z
const SEQ_BITS = 12n;
const WORKER_BITS = 5n;
const DC_BITS = 5n;

const MAX_WORKER = 31; // 2^5 - 1
const MAX_DC = 31; // 2^5 - 1
const MAX_SEQ = 4095n; // 2^12 - 1

const WORKER_SHIFT = SEQ_BITS; // 12n
const DC_SHIFT = SEQ_BITS + WORKER_BITS; // 17n
const TS_SHIFT = SEQ_BITS + WORKER_BITS + DC_BITS; // 22n

// --- Filename sanitize ---
function _sanitizeFilename(fileName: string): string {
  return fileName.replace(/[\\/:*?"<>|\p{Cc}]/gu, "_").trim();
}

// --- Options ---
export interface SnowflakeOptions {
  workerId?: number;
  datacenterId?: number;
  epoch?: bigint;
}

// --- Strategy ---
export class SnowflakeStrategy implements IIdStrategy {
  private readonly workerId: bigint;
  private readonly datacenterId: bigint;
  private readonly epoch: bigint;

  private lastTimestamp = -1n;
  private sequence = 0n;

  constructor(options: SnowflakeOptions = {}) {
    const resolvedWorker =
      options.workerId ??
      (process.env.SNOWFLAKE_WORKER_ID !== undefined
        ? parseInt(process.env.SNOWFLAKE_WORKER_ID, 10)
        : 0);

    const resolvedDC =
      options.datacenterId ??
      (process.env.SNOWFLAKE_DATACENTER_ID !== undefined
        ? parseInt(process.env.SNOWFLAKE_DATACENTER_ID, 10)
        : 0);

    if (resolvedWorker < 0 || resolvedWorker > MAX_WORKER) {
      throw new Error(`workerId must be between 0 and ${MAX_WORKER}`);
    }
    if (resolvedDC < 0 || resolvedDC > MAX_DC) {
      throw new Error(`datacenterId must be between 0 and ${MAX_DC}`);
    }

    this.workerId = BigInt(resolvedWorker);
    this.datacenterId = BigInt(resolvedDC);
    this.epoch = options.epoch ?? EPOCH;
  }

  private _nextId(): bigint {
    let now = BigInt(Date.now());

    if (now === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & MAX_SEQ;
      // Sequence taştı — bir sonraki ms'yi bekle
      if (this.sequence === 0n) {
        while (now <= this.lastTimestamp) {
          now = BigInt(Date.now());
        }
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = now;

    return (
      ((now - this.epoch) << TS_SHIFT) |
      (this.datacenterId << DC_SHIFT) |
      (this.workerId << WORKER_SHIFT) |
      this.sequence
    );
  }

  encode(filename: string, prefix: string | false = false): string {
    const sanitized = _sanitizeFilename(filename);
    const snowflakeId = this._nextId().toString();
    const combined = `${sanitized}|${snowflakeId}`;
    const base64 = Buffer.from(combined, "utf8").toString("base64");
    return prefix ? `${prefix}_${base64}` : base64;
  }

  decode(fileId: string): string | undefined {
    let payload = fileId;
    if (fileId.includes("_")) {
      payload = fileId.substring(fileId.indexOf("_") + 1);
    }
    return Buffer.from(payload, "base64").toString().split("|")[0];
  }

  isValid(fileId: string): boolean | Error {
    let payload = fileId;
    if (fileId.includes("_")) {
      payload = fileId.substring(fileId.indexOf("_") + 1);
    }

    let decoded: string;
    try {
      decoded = Buffer.from(payload, "base64").toString("utf8");
    } catch {
      return new Error("invalid base64 encoding");
    }

    const separatorIndex = decoded.indexOf("|");
    if (
      separatorIndex === -1 ||
      decoded.indexOf("|", separatorIndex + 1) !== -1
    ) {
      return new Error(
        "invalid payload: must contain exactly one '|' separator"
      );
    }

    const idPart = decoded.slice(separatorIndex + 1);

    // Snowflake ID: sadece rakam, 17-19 karakter
    if (!/^\d{17,19}$/.test(idPart)) {
      return new Error(
        "invalid snowflake id: must be a numeric string of 17-19 digits"
      );
    }

    return true;
  }
}
