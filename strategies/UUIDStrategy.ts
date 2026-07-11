import { randomUUID } from "crypto";
import type { IIdStrategy } from "./IIdStrategy";

function _sanitizeFilename(fileName: string): string {
  return fileName.replace(/[\\/:*?"<>|\p{Cc}]/gu, "_").trim();
}

export class UUIDStrategy implements IIdStrategy {
  encode(filename: string, prefix: string | false = false): string {
    const sanitized = _sanitizeFilename(filename);
    const uuid = randomUUID();
    const combined = `${sanitized}|${uuid}`;
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

    const uuid = decoded.slice(separatorIndex + 1);
    if (uuid.length !== 36) {
      return new Error("invalid uuid part: must be 36 characters");
    }

    return true;
  }
}
