# S3 File ID

> Generate secure, human-readable file identifiers for cloud storage systems

[![npm version](https://img.shields.io/npm/v/s3-file-id.svg)](https://www.npmjs.com/package/s3-file-id) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![CI](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml/badge.svg)](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml)

File ID is a TypeScript library that generates compact, unique identifiers for files, making it safe and easy to manage objects in cloud storage systems like S3 and MinIO. Each ID combines the original filename with a UUID (2^128 collision resistance) for guaranteed uniqueness while maintaining human readability.

## Table of Contents

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

## Key Features

- 🔒 Secure and collision-resistant IDs using UUID v4
- 📝 Human-readable format that preserves original filenames
- ✨ Simple API for encoding, decoding, and validation
- 📦 Full TypeScript support with included type definitions
- 🚀 Zero dependencies and lightweight

## Installation

Install using your preferred package manager:

```bash
# Using npm
npm install s3-file-id

# Using pnpm
pnpm add s3-file-id

# Using Yarn
yarn add s3-file-id

# Using Bun
bun add s3-file-id
```

## Quick Start

### ESM Usage

```typescript
import { encode, isValid, decode } from "s3-file-id";

const id = encode("photo.png");
// Result: tmp_photo.png|550e8400-e29b-41d4-a716-446655440000

console.log(isValid(id)); // true
console.log(decode(id));  // "photo.png"
```

### CommonJS Usage

```javascript
const { encode, isValid, decode } = require("s3-file-id");

const id = encode("report.pdf");
// Result: tmp_report.pdf|9a1f7f6a-2d1b-4c3a-8b2c-0b8a6b9e9d2f
```

## API Reference

### Function API

#### `encode(filename: string): string`

Creates a new file ID by combining the original filename with a UUID.

- Returns: string — A file ID containing the original filename and a UUID.

#### `isValid(fileId: string | FileId): boolean`

Validates if a given string or FileId object is a valid file ID.

- Returns: boolean — True when the ID matches the expected structure and contains a valid UUID.

#### `decode(fileId: string | FileId): string`

Extracts the original filename from a file ID.

- Returns: string — The original filename embedded in the file ID.

### Class API

#### `FileId`

Object-oriented interface for file ID operations.

```typescript
import FileId from "s3-file-id";

const obj = new FileId("notes.txt");
const id = obj.toString(); // same as encode("notes.txt")
console.log(FileId.isValid(id));
console.log(obj.decode());
```

Methods:

* `constructor(filename: string)`: Creates a new FileId instance
* `decode(): string`: Extracts the original filename
* `static isValid(fileId: string | FileId): boolean`: Validates a file ID

## File ID Format

File IDs follow this pattern:

```text
tmp_<original-file-name>|<uuid>
```

Examples:

- `tmp_avatar.png|550e8400-e29b-41d4-a716-446655440000`
- `tmp_report.pdf|9a1f7f6a-2d1b-4c3a-8b2c-0b8a6b9e9d2f`

## Development

### Running Tests

The project includes a comprehensive test suite in `tests/fileId.test.ts`. Run it using:

```bash
# Using npm
npm test

# Using pnpm
pnpm test
```

### Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Run the test suite
5. Submit a pull request

## License

[MIT License](LICENSE) © 2025 Lynicis
