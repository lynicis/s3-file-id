# File ID — File IDs for storage

[![npm version](https://img.shields.io/npm/v/s3-file-id.svg)](https://www.npmjs.com/package/s3-file-id) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![CI](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml/badge.svg)](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml)

File ID generates compact, unique identifiers for files so you can safely store and delete objects in object storage (S3, MinIO, etc.). IDs are derived from the original filename plus a UUID to ensure uniqueness (2^128 collision resistance).

## Table of contents

- Features
- Quick start
- Install
- Usage
- API
- FileId class
- File ID format
- Tests
- Contributing
- License & links

## Features

- Generate deterministic, human-friendly file IDs that embed the original filename
- Validate file IDs
- Decode a file ID back to its original filename
- Written in TypeScript with types included

## Quick start

Install the package and use the exported helpers:

```bash
pnpm add s3-file-id
# or
npm install s3-file-id
```

ESM example:

```ts
import { encode, isValid, decode } from "s3-file-id";

const id = encode("photo.png");
console.log(id); // e.g. tmp_photo.png|550e8400-e29b-41d4-a716-446655440000

console.log(isValid(id)); // true
console.log(decode(id)); // "photo.png"
```

CommonJS example:

```js
const { encode, isValid, decode } = require("s3-file-id");

const id = encode("report.pdf");
```

## Install

Supports popular JS package managers:

- pnpm: `pnpm add s3-file-id`
- npm: `npm install s3-file-id`
- yarn: `yarn add s3-file-id`
- bun: `bun add s3-file-id`

TypeScript types are included — no extra typings required.

## Usage

High-level helpers:

- encode(filename: string): string — create a new file ID
- isValid(fileId: string | FileId): boolean — validate a file ID
- decode(fileId: string | FileId): string — extract the original filename

Example:

```ts
import { encode, isValid, decode } from "s3-file-id";

const fileId = encode("invoice-2025.pdf");
if (!isValid(fileId)) throw new Error("invalid file id");
console.log(decode(fileId)); // invoice-2025.pdf
```

### FileId class (object API)

```ts
import FileId from "s3-file-id";

const obj = new FileId("notes.txt");
const id = obj.toString(); // same as encode("notes.txt")
console.log(FileId.isValid(id));
console.log(obj.decode());
```

## API

encode(filename: string): string
- Returns: string — a file ID that contains the original filename and a UUID.

isValid(fileId: string | FileId): boolean
- Returns: boolean — true when the ID matches the expected structure and contains a valid UUID.

decode(fileId: string | FileId): string
- Returns: string — the original filename embedded in the file ID.

FileId class
- constructor(filename: string)
- decode(): string
- static isValid(fileId: string | FileId): boolean

## File ID format

File IDs follow this pattern:

```
tmp_<original-file-name>|<uuid>
```

Examples:

- `tmp_avatar.png|550e8400-e29b-41d4-a716-446655440000`
- `tmp_report.pdf|9a1f7f6a-2d1b-4c3a-8b2c-0b8a6b9e9d2f`

## Tests

Run the test suite with your package manager of choice:

```bash
pnpm test
# or
npm test
```

The `tests/fileId.test.ts` file contains unit tests for encoding, decoding, and validation.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Add tests for new behavior
4. Run the test suite
5. Open a PR

Consider adding a `CONTRIBUTING.md` and fill out issue templates for larger contributions.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

## Links

- GitHub: https://github.com/lynicis/s3-file-id
- npm: https://www.npmjs.com/package/s3-file-id

---

If you'd like, I can also:

- add a `CONTRIBUTING.md` with a basic PR checklist
- add a Usage demo in the repository (small script under `examples/`)
- run the test suite locally and report the results

