import { UUIDStrategy } from "./strategies/UUIDStrategy";

const _strategy = new UUIDStrategy();

/**
 * Encodes a filename into a unique file ID using UUIDStrategy.
 *
 * @param {string} file - The filename to encode
 * @param {string | false} prefix - Optional prefix (default: false)
 * @returns {string} The encoded file ID
 */
export default function encode(
  file: string,
  prefix: string | false = false
): string {
  return _strategy.encode(file, prefix);
}
