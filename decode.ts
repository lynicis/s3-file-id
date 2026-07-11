import { UUIDStrategy } from "./strategies/UUIDStrategy";

const _strategy = new UUIDStrategy();

/**
 * Decodes a file ID to extract the original filename.
 *
 * CAUTION: Validate with isValid() before calling this.
 *
 * @param {string} fileId - The encoded file ID to decode
 * @returns {string | undefined} The original filename
 */
export default function decode(fileId: string): string | undefined {
  return _strategy.decode(fileId);
}
