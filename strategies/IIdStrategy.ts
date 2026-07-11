export interface IIdStrategy {
  encode(filename: string, prefix?: string | false): string;
  decode(fileId: string): string | undefined;
  isValid(fileId: string): boolean | Error;
}
