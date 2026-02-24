# synology-api-js

TypeScript wrapper for the Synology DSM API, ported from [N4S4/synology-api](https://github.com/N4S4/synology-api) (Python). Compatible with both [Bun](https://bun.sh) and [Node.js](https://nodejs.org).

## Requirements

- [Bun](https://bun.sh) v1.0+ (recommended) **or** [Node.js](https://nodejs.org) v18.x+
- Synology DSM 6.x or 7.x

## Install

```bash
# Bun (recommended)
bun install

# Node.js
npm install
```

## Quick Start

```typescript
import {
  SynoClient,
  FileStation,
  CoreUser,
  DownloadStation,
} from 'synology-api-js';

const client = new SynoClient({
  baseUrl: 'https://192.168.1.100:5001',
  account: 'admin',
  password: 'your-password',
  dsmVersion: 7,
});

// Lifecycle hooks
client.on('beforeRequest', (ctx) => console.log(`API: ${ctx.apiName}`));
client.on('onError', (err) => console.error(err));

await client.connect();

// Use modules independently
const fs = new FileStation(client);
const shares = await fs.listShares();

const users = new CoreUser(client);
const list = await users.getUsers({ limit: 50 });

await client.disconnect();
```

## Architecture

```
SynoClient (session + HTTP via ky)
  └── BaseModule (abstract)
        ├── FileStation
        ├── DownloadStation
        ├── CoreUser
        ├── ...31 modules
        └── SurveillanceStation
```

- **Composition over inheritance**: modules receive `SynoClient` via constructor
- **Extensible**: subclass any module or `SynoClient` itself
- **Type-safe**: strict TypeScript, no `any`

### Extending modules

```typescript
class MyFileStation extends FileStation {
  async listPhotos() {
    return this.listFiles('/photo');
  }
}

const myFs = new MyFileStation(client);
await myFs.listPhotos();
```

### Extending client

```typescript
class MyNas extends SynoClient {
  async overview() {
    const users = new CoreUser(this);
    return users.getUsers();
  }
}
```

## Modules

| Module | Class | Description |
|--------|-------|-------------|
| File Station | `FileStation` | File operations, search, compress, extract, upload, download |
| Download Station | `DownloadStation` | Download tasks, RSS, BT search, statistics |
| Photos | `Photos` | Synology Photos albums, items, sharing |
| Docker | `Docker` | Container, image, network, project management |
| Audio Station | `AudioStation` | Music library, playlists, playback |
| Note Station | `NoteStation` | Notes and notebooks |
| Surveillance Station | `SurveillanceStation` | Cameras, recording, PTZ, CMS, alerts (329 methods) |
| Core - User | `CoreUser` | User management (create, modify, delete) |
| Core - Group | `CoreGroup` | Group management |
| Core - Share | `CoreShare` | Shared folders, permissions, encryption |
| Core - Certificate | `CoreCertificate` | SSL certificate management |
| Core - Package | `CorePackage` | Package installation and management |
| Core - System Info | `CoreSysInfo` | System info, network, storage, services (114 methods) |
| Core - Backup | `CoreBackup` | Hyper Backup tasks and vault operations |
| Core - iSCSI | `CoreISCSI` | iSCSI LUN and Target management |
| Active Backup | `ActiveBackup` | Active Backup for Business |
| Active Backup Microsoft | `ActiveBackupMicrosoft` | Active Backup for Microsoft 365 |
| Cloud Sync | `CloudSync` | Cloud sync connections and tasks |
| Drive Admin | `DriveAdminConsole` | Synology Drive administration |
| Directory Server | `DirectoryServer` | Active Directory integration |
| DHCP Server | `DhcpServer` | DHCP server configuration |
| VPN | `VPN` | VPN server and client management |
| Log Center | `LogCenter` | System logs |
| Security Advisor | `SecurityAdvisor` | Security scanning and rules |
| Universal Search | `UniversalSearch` | Cross-application search |
| USB Copy | `USBCopy` | USB copy tasks |
| Virtualization | `Virtualization` | Virtual Machine Manager |
| Snapshot | `Snapshot` | Snapshot and replication |
| Task Scheduler | `TaskScheduler` | Scheduled tasks |
| Event Scheduler | `EventScheduler` | Event-triggered tasks |
| OAuth | `OAuth` | OAuth client management |

## Encryption

Supports DSM 6 and DSM 7 encryption:

- **AES-256-CBC** (OpenSSL-compatible EVP_BytesToKey)
- **RSA PKCS1v15** for parameter encryption
- **Noise Protocol IK** for DSM 7+ secure handshake

```typescript
import { aesEncrypt, rsaEncrypt, encryptParams } from 'synology-api-js';
```

## Client Config

```typescript
interface ClientConfig {
  baseUrl: string;         // e.g. 'https://192.168.1.100:5001'
  account: string;
  password: string;
  dsmVersion?: 6 | 7;     // default: 7
  otpCode?: string;        // 2FA one-time password
  deviceId?: string;
  deviceName?: string;
  certVerify?: boolean;    // SSL verification, default: false
}
```

## Lifecycle Events

```typescript
client.on('connect', () => { /* logged in */ });
client.on('disconnect', () => { /* logged out */ });
client.on('beforeRequest', (ctx) => { /* before API call */ });
client.on('afterResponse', (ctx) => { /* after API call */ });
client.on('onError', (err) => { /* on error */ });
```

## Error Handling

Structured error hierarchy with API-specific error codes:

```typescript
import {
  SynoApiError,
  FileStationError,
  DownloadStationError,
  dispatchApiError,
  getErrorMessage,
} from 'synology-api-js';

try {
  await fs.listFiles('/nonexistent');
} catch (err) {
  if (err instanceof FileStationError) {
    console.log(err.code, err.message);
  }
}
```

## Dependencies

| Package | Purpose |
|---------|---------|
| [ky](https://github.com/sindresorhus/ky) | HTTP client with hooks, retry, timeout |
| [@noble/curves](https://github.com/paulmillr/noble-curves) | Noise Protocol handshake (Curve25519) |
| [@noble/ciphers](https://github.com/paulmillr/noble-ciphers) | ChaCha20-Poly1305 for Noise |
| [@noble/hashes](https://github.com/paulmillr/noble-hashes) | SHA-256, BLAKE2 |

## Project Structure

```
src/
├── index.ts                  # Public exports
├── types/
│   ├── api-info.ts           # ApiInfo, SynoResponse<T>
│   ├── client.ts             # ClientConfig, events, options
│   └── common.ts             # Pagination, SortDirection
├── core/
│   ├── client.ts             # SynoClient
│   ├── errors.ts             # Error class hierarchy
│   ├── error-codes.ts        # Error code tables
│   ├── utils.ts              # Shared utilities
│   └── encryption/
│       ├── aes-cipher.ts     # AES-256-CBC
│       ├── rsa-encrypt.ts    # RSA PKCS1v15
│       ├── noise-handshake.ts # Noise IK (DSM 7+)
│       └── param-encryptor.ts # Combined encryption
└── modules/
    ├── base-module.ts        # Abstract base class
    ├── file-station.ts       # 47 methods
    ├── download-station.ts   # 25 methods
    ├── surveillance-station.ts # 329 methods
    ├── core-sys-info.ts      # 114 methods
    └── ... (31 modules total)
```

## Runtime Compatibility

| Feature | Bun | Node.js 18+ |
|---------|-----|-------------|
| Core APIs | `Bun.file()` (preferred) | `node:fs/promises` (fallback) |
| Crypto | `node:crypto` | `node:crypto` |
| HTTP | `ky` (fetch-based) | `ky` (fetch-based) |
| FormData / Blob | native | native |

File I/O automatically detects the runtime: uses `Bun.file()` when available, falls back to `node:fs` on Node.js.

To run with Node.js, use [tsx](https://github.com/privatenumber/tsx) to handle `.ts` imports:

```bash
npx tsx your-script.ts
```

## Type Check

```bash
# Bun
bunx tsc --noEmit

# Node.js
npx tsc --noEmit
```

## Tests

```bash
# Bun
bun test

# Node.js (with tsx)
npx tsx --test
```

## License

ISC
