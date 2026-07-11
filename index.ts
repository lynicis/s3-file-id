import isValid from "./isValid";
import decode from "./decode";
import encode from "./encode";
import FileId from "./fileId";
import { UUIDStrategy } from "./strategies/UUIDStrategy";
import { SnowflakeStrategy } from "./strategies/SnowflakeStrategy";
import type { IIdStrategy } from "./strategies/IIdStrategy";

export default {
  FileId,
  encode,
  decode,
  isValid,
  UUIDStrategy,
  SnowflakeStrategy,
};

export type { IIdStrategy };
export type { SnowflakeOptions } from "./strategies/SnowflakeStrategy";
