# S3 File ID

> Generate secure, human-readable file identifiers for cloud storage systems

[![npm version](https://img.shields.io/npm/v/s3-file-id.svg)](https://www.npmjs.com/package/s3-file-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml/badge.svg)](https://github.com/lynicis/s3-file-id/actions/workflows/npm-release.yaml)
[![codecov](https://codecov.io/gh/lynicis/s3-file-id/branch/master/graph/badge.svg?token=ysKoyeIATm)](https://codecov.io/gh/lynicis/s3-file-id)

## Human-Readable File Access Pattern

This library enables a simple and intuitive way to access files in cloud storage using human-readable names while maintaining uniqueness. Instead of managing complex paths or random identifiers, you can:

- Reference files using their original names
- Easily processed by scheduled jobs in the bucket
- Maintain guaranteed uniqueness through pluggable ID strategies (UUID or Snowflake)
- Keep files organized and easily discoverable
- Preserve human readability in your storage system

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Strategies](#strategies)
- [API Reference](#api-reference)
- [File ID Format](#file-id-format)
- [Development](#development)

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

// Without prefix (uses default UUID strategy)
const id = encode("photo.png");
// Result: base64("photo.png|550e8400-e29b-41d4-a716-446655440000")

console.log(isValid(id)); // true
console.log(decode(id)); // "photo.png"

// With optional prefix
const tmpId = encode("photo.png", "tmp");
// Result: "tmp_" + base64("photo.png|550e8400-e29b-41d4-a716-446655440000")

console.log(isValid(tmpId)); // true
console.log(decode(tmpId)); // "photo.png"
```

### CommonJS Usage

```javascript
const { encode, isValid, decode } = require("s3-file-id");

const id = encode("report.pdf");
// Result: base64("report.pdf|9a1f7f6a-2d1b-4c3a-8b2c-0b8a6b9e9d2f")
```

## Strategies

In `v3.0.0`, ID generation is pluggable via the Strategy Pattern. The default behavior still uses UUID v4, but a 64-bit BigInt **Snowflake** ID strategy is also included for distributed systems demanding ordered, time-sortable identifiers without collisions.

### UUID Strategy (Default)
Standard `crypto.randomUUID()` based collision-free strings.

```typescript
import FileId, { UUIDStrategy } from "s3-file-id";

const id = new FileId("test.txt", false, new UUIDStrategy()); 
// Equivalent to `new FileId("test.txt")`
```

### Snowflake Strategy
A 64-bit ID utilizing a custom epoch, worker ID, and datacenter ID to produce sortable unique numeric strings (`17-19` digits).

```typescript
import FileId, { SnowflakeStrategy } from "s3-file-id";

// Uses process.env.SNOWFLAKE_WORKER_ID and process.env.SNOWFLAKE_DATACENTER_ID natively
const strategy = new SnowflakeStrategy({ workerId: 1, datacenterId: 2 });
const sf = new FileId("test.txt", false, strategy);
console.log(sf.id); 
// base64("test.txt|1234567890123456789")
```

## API Reference

### Function API (Uses UUIDStrategy by default)

#### `encode(filename: string, prefix?: string | false): string`
Creates a new file ID by combining the original filename with a UUID.

- `filename`: The original filename to encode
- `prefix` (optional): Custom prefix for the file ID (default: `false`)

#### `isValid(fileId: string | FileId): boolean | Error`
Validates if a given string or FileId object is a valid file ID.

#### `decode(fileId: string | FileId): string`
Extracts the original filename from a file ID.

### Class API

#### `FileId`

Object-oriented interface for file ID operations.

```typescript
import FileId, { SnowflakeStrategy } from "s3-file-id";

// Without prefix (default UUID)
const obj = new FileId("notes.txt");
console.log(obj.id); // "notes.txt|<uuid>" (base64 encoded)

// With prefix and alternative strategy
const sfObj = new FileId("notes.txt", "tmp", new SnowflakeStrategy({ workerId: 5 }));
console.log(sfObj.id); // "tmp_notes.txt|<snowflake_id>" (base64 encoded)
```

Methods:

- `constructor(filename: string, prefix?: string | false, strategy?: IIdStrategy)`: Creates a new FileId instance
- `decode(): string`: Extracts the original filename
- `static isValid(fileId: string | FileId): boolean | Error`: Validates a file ID against the UUIDStrategy (backward compatibility)

## File ID Format

File IDs follow this pattern before base64 encoding:

```text
# UUID Strategy
<filename>|<uuid>

# Snowflake Strategy
<filename>|<17-to-19-digit-numeric>
```

Examples of the final encoded string:

- `dGVzdC50eHR8NTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAw` (no prefix)
- `tmp_dGVzdC50eHR8NTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAw` (with `tmp_` prefix)

## Development

### Running Tests

The project includes a comprehensive test suite. Run it using:

```bash
bun test
```
