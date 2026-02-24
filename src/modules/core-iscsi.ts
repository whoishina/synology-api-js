/**
 * Synology Core iSCSI API module.
 * Ported from Python synology_api/core_ISCSI.py
 *
 * Provides management for iSCSI LUNs and Targets via:
 * - SYNO.Core.ISCSI.LUN
 * - SYNO.Core.ISCSI.Target
 *
 * Note: Synology does not publish a full public spec for these endpoints.
 * This module is a best-effort wrapper built from CLI helper output,
 * open-source integrations, and reverse-engineering of DSM requests.
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

// -------------------------------------------------------
// Types
// -------------------------------------------------------

/** Valid LUN types for create / set operations. */
type LunType =
  | 'FILE'
  | 'THIN'
  | 'BLUN'
  | 'BLUN_THICK'
  | 'ADV'
  | 'SINK'
  | 'CINDER'
  | 'CINDER_BLUN'
  | 'CINDER_BLUN_THICK'
  | 'BLUN_SINK'
  | 'BLUN_THICK_SINK'
  | 'BLOCK';

/** All known LUN types (including legacy / internal). */
const ALL_LUN_TYPES: readonly string[] = [
  'BLOCK',
  'FILE',
  'THIN',
  'ADV',
  'SINK',
  'CINDER',
  'CINDER_BLUN',
  'CINDER_BLUN_THICK',
  'BLUN',
  'BLUN_THICK',
  'BLUN_SINK',
  'BLUN_THICK_SINK',
] as const;

/** Valid additional info fields for LUN list. */
const LUN_LIST_ADDITIONAL_FIELDS: readonly string[] = [
  'is_action_locked',
  'is_mapped',
  'extent_size',
  'allocated_size',
  'status',
  'allow_bkpobj',
  'flashcache_status',
  'family_config',
  'snapshot_info',
] as const;

/** Valid additional info fields for LUN get. */
const LUN_GET_ADDITIONAL_FIELDS: readonly string[] = [
  'is_action_locked',
  'is_mapped',
  'extent_size',
  'allocated_size',
  'status',
  'import_status',
  'sync_progress',
  'is_vhost_mapped',
  'is_bound',
  'whitelist',
  'flashcache_status',
  'family_config',
] as const;

/** Valid additional info fields for Target list / get. */
const TARGET_ADDITIONAL_FIELDS: readonly string[] = [
  'mapped_lun',
  'acls',
  'connected_sessions',
  'status',
] as const;

/** CHAP authentication type: 0=none, 1=single CHAP, 2=mutual CHAP */
type AuthType = 0 | 1 | 2;

/** SCSI device attribute entry sent to the API. */
interface DevAttribEntry {
  readonly dev_attrib: string;
  readonly enable: number;
}

/** Options for SCSI device attribute emulations on LUN create/set. */
interface DevAttribOptions {
  /** Enable SCSI COMPARE AND WRITE (CAW) support. */
  emulateCaw?: boolean;
  /** Enable SCSI Third-Party Copy (XCOPY) support. */
  emulate3pc?: boolean;
  /** Enable SCSI UNMAP (Thin Provisioning UNMAP) support. */
  emulateTpu?: boolean;
  /** Enable SCSI WRITE SAME with thin provisioning semantics. */
  emulateTpws?: boolean;
  /** Enable SCSI Force Unit Access (FUA) bit handling (DSM 7+). */
  emulateFuaWrite?: boolean;
  /** Enable SCSI SYNCHRONIZE CACHE command support (DSM 7+). */
  emulateSyncCache?: boolean;
  /** Enable snapshot capability for the LUN. */
  canSnapshot?: boolean;
}

/** Options for creating a LUN. */
interface LunCreateOptions extends DevAttribOptions {
  /** Optional textual description. */
  description?: string;
  /** Extent size (may be ignored depending on type). */
  extentSize?: number | string;
  /** Source LUN directory for creation based on snapshot import. */
  srcLunDir?: string;
  /** Source LUN file for creation based on snapshot import. */
  srcLunFile?: string;
}

/** Options for updating a LUN via set(). */
interface LunSetOptions extends DevAttribOptions {
  /** Rename LUN. */
  newName?: string;
  /** Resize LUN (bytes). */
  newSize?: number | string;
  /** Change type (may be unsupported in many cases). */
  newType?: LunType;
  /** Move LUN location (may be unsupported in many cases). */
  newLocation?: string;
}

/** Options for cloning a LUN. */
interface LunCloneOptions {
  /** Clone type. */
  cloneType?: string;
  /** Destination location. */
  dstLocation?: string;
  /** Destination node UUID (remote scenarios). */
  dstNodeUuid?: string;
  /** Destination address (remote scenarios). */
  dstAddress?: string;
  /** Destination port (remote scenarios). */
  dstPort?: number | string;
  /** Whether data is encrypted in transit. */
  isDataEncrypted?: boolean;
  /** Ignore soft-feasibility check. */
  isSoftFeasIgnored?: boolean;
  /** Unknown flag. */
  isDataClone?: boolean;
}

/** Options for creating a Target. */
interface TargetCreateOptions {
  /** Maximum sessions (use 0 for unlimited on some systems). */
  maxSessions?: number;
  /** CHAP username (client). Requires authType >= 1. */
  user?: string;
  /** CHAP password (client). Requires authType >= 1. */
  password?: string;
  /** Mutual CHAP username (server). Requires authType == 2. */
  mutualUser?: string;
  /** Mutual CHAP password (server). Requires authType == 2. */
  mutualPassword?: string;
}

/** Options for updating a Target. */
interface TargetSetOptions {
  /** New target name. */
  newName?: string;
  /** New target IQN. */
  newIqn?: string;
  /** Maximum sessions (use 0 for unlimited). */
  maxSessions?: number;
  /** Authentication type: 0=none, 1=single CHAP, 2=mutual CHAP. */
  authType?: AuthType;
  /** CHAP username (client). Requires authType >= 1. */
  user?: string;
  /** CHAP password (client). Requires authType >= 1. */
  password?: string;
  /** Mutual CHAP username (server). Requires authType == 2. */
  mutualUser?: string;
  /** Mutual CHAP password (server). Requires authType == 2. */
  mutualPassword?: string;
  /** Enable CRC header digest. */
  hasHeaderChecksum?: boolean;
  /** Enable CRC data digest. */
  hasDataChecksum?: boolean;
  /** Maximum receive segment bytes (4096, 8192, 65536, 262144). */
  maxRecvSegBytes?: number;
  /** Maximum send segment bytes (4096, 8192, 65536, 262144). */
  maxSendSegBytes?: number;
}

// -------------------------------------------------------
// Utilities
// -------------------------------------------------------

/**
 * Normalize a single string/number or an array into a flat array.
 * Returns an empty array when value is undefined or null.
 */
function ensureList(
  value: string | number | ReadonlyArray<string | number> | undefined | null,
): Array<string | number> {
  if (value === undefined || value === null) return [];
  if (typeof value === 'string' || typeof value === 'number') return [value];
  return Array.from(value);
}

/**
 * Build the `dev_attribs` JSON array from the boolean option fields.
 * Only includes attributes that are explicitly set (not undefined).
 */
function buildDevAttribs(options: DevAttribOptions): DevAttribEntry[] {
  const mapping: Array<[string, boolean | undefined]> = [
    ['emulate_tpws', options.emulateTpws],
    ['emulate_caw', options.emulateCaw],
    ['emulate_3pc', options.emulate3pc],
    ['emulate_tpu', options.emulateTpu],
    ['emulate_fua_write', options.emulateFuaWrite],
    ['emulate_sync_cache', options.emulateSyncCache],
    ['can_snapshot', options.canSnapshot],
  ];

  const result: DevAttribEntry[] = [];
  for (const [key, val] of mapping) {
    if (val !== undefined) {
      result.push({ dev_attrib: key, enable: val ? 1 : 0 });
    }
  }
  return result;
}

/**
 * Filter an array of strings to keep only values present in the allowed set.
 */
function filterKnown(values: readonly string[], allowed: readonly string[]): string[] {
  const allowedSet = new Set(allowed);
  return values.filter((v) => allowedSet.has(v));
}

// -------------------------------------------------------
// Module
// -------------------------------------------------------

export class CoreISCSI extends BaseModule {
  protected readonly application = 'Core';

  // =====================================================
  // LUN helpers
  // =====================================================

  /**
   * Internal request helper for SYNO.Core.ISCSI.LUN.
   */
  private async lunRequest(
    method: string,
    params: Record<string, unknown>,
    version?: number | string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: String(version ?? info.maxVersion),
      method,
    };

    // Only include non-undefined values
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        reqParams[k] = v;
      }
    }

    return this.request(apiName, info.path, reqParams);
  }

  /**
   * Internal request helper for SYNO.Core.ISCSI.Target.
   */
  private async targetRequest(
    method: string,
    params: Record<string, unknown>,
    version?: number | string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.Target';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: String(version ?? info.maxVersion),
      method,
    };

    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        reqParams[k] = v;
      }
    }

    return this.request(apiName, info.path, reqParams);
  }

  // =====================================================
  // LUN - Core
  // =====================================================

  /**
   * Create a new iSCSI LUN.
   *
   * @param name - LUN name (only "-" allowed as special character).
   * @param type - LUN type. Availability depends on filesystem and DSM version.
   * @param location - Target location, typically a volume path (e.g. "/volume1").
   * @param size - LUN size in bytes.
   * @param options - Optional creation parameters and SCSI device attributes.
   */
  async lunCreate(
    name: string,
    type: LunType,
    location: string,
    size: number | string,
    options: LunCreateOptions = {},
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      name,
      type,
      location,
      size: Number(size),
    };

    // Build dev_attribs
    const devAttribs = buildDevAttribs(options);
    if (devAttribs.length > 0) {
      params.dev_attribs = JSON.stringify(devAttribs);
    }

    // Optional simple fields
    if (options.description !== undefined) params.description = options.description;
    if (options.extentSize !== undefined) params.extent_size = options.extentSize;
    if (options.srcLunDir !== undefined) params.src_lun_dir = options.srcLunDir;
    if (options.srcLunFile !== undefined) params.src_lun_file = options.srcLunFile;

    return this.lunRequest('create', params);
  }

  /**
   * Delete one or more LUNs.
   *
   * @param uuids - LUN UUID or array of LUN UUIDs.
   * @returns Empty object if no UUIDs provided, otherwise API response.
   */
  async lunDelete(
    uuids: string | readonly string[],
  ): Promise<SynoResponse> {
    const uuidList = ensureList(uuids);
    if (uuidList.length === 0) {
      return { success: true };
    }

    return this.lunRequest('delete', {
      uuid: '""',
      uuids: JSON.stringify(uuidList),
    });
  }

  /**
   * Delete one or more LUNs, waiting for complete deletion before returning.
   *
   * @param uuids - LUN UUID or array of LUN UUIDs.
   * @param minRequestDelay - Minimum delay (in milliseconds) between polling calls.
   *                          Defaults to 1000 (1 second).
   */
  async lunSafeDelete(
    uuids: string | readonly string[],
    minRequestDelay = 1000,
  ): Promise<SynoResponse> {
    const uuidList = ensureList(uuids).map(String);
    if (uuidList.length === 0) {
      return { success: true };
    }

    const result = await this.lunRequest('delete', {
      uuid: '""',
      uuids: JSON.stringify(uuidList),
    });

    // Poll LUN list until all specified UUIDs have been removed
    let remaining = [...uuidList];
    let lastTs = 0;

    while (remaining.length > 0) {
      const now = Date.now();
      if (now - lastTs < minRequestDelay) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, (now - lastTs) / 10),
        );
      }

      lastTs = Date.now();

      const listResult = await this.lunList();
      const data = listResult.data as { luns?: Array<{ uuid: string }> } | undefined;
      const currentUuids = new Set(
        (data?.luns ?? []).map((lun) => lun.uuid),
      );
      remaining = remaining.filter((uuid) => currentUuids.has(uuid));
    }

    return result;
  }

  /**
   * List available LUNs.
   *
   * @param types - Type of LUNs to retrieve. Unknown types are discarded.
   *                Defaults to all known types.
   * @param additionalInfo - Additional LUN information to include. Specify [] for basic info only.
   * @param location - Filter by location.
   */
  async lunList(
    types: readonly string[] = ALL_LUN_TYPES,
    additionalInfo: readonly string[] = LUN_LIST_ADDITIONAL_FIELDS,
    location?: string,
  ): Promise<SynoResponse> {
    const filteredTypes = filterKnown(types, ALL_LUN_TYPES);
    const filteredAdditional = filterKnown(additionalInfo, LUN_LIST_ADDITIONAL_FIELDS);

    return this.lunRequest('list', {
      types: JSON.stringify(filteredTypes),
      additional: JSON.stringify(filteredAdditional),
      location,
    });
  }

  /**
   * Get detailed information for a specific LUN.
   *
   * @param uuid - LUN UUID.
   * @param additionalInfo - Additional LUN information to include. Specify [] for basic info only.
   */
  async lunGet(
    uuid: string,
    additionalInfo: readonly string[] = LUN_GET_ADDITIONAL_FIELDS,
  ): Promise<SynoResponse> {
    const filteredAdditional = filterKnown(additionalInfo, LUN_GET_ADDITIONAL_FIELDS);

    const params: Record<string, unknown> = {
      uuid: JSON.stringify(uuid),
    };

    if (filteredAdditional.length > 0) {
      params.additional = JSON.stringify(filteredAdditional);
    }

    return this.lunRequest('get', params);
  }

  /**
   * Update LUN properties.
   *
   * @param uuid - LUN UUID.
   * @param options - Properties to update and SCSI device attributes.
   */
  async lunSet(
    uuid: string,
    options: LunSetOptions = {},
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      uuid: JSON.stringify(uuid),
    };

    // Build dev_attribs
    const devAttribs = buildDevAttribs(options);
    if (devAttribs.length > 0) {
      params.dev_attribs = JSON.stringify(devAttribs);
    }

    // Optional fields
    if (options.newName !== undefined) params.new_name = options.newName;
    if (options.newSize !== undefined) params.new_size = options.newSize;
    if (options.newType !== undefined) params.new_type = options.newType;
    if (options.newLocation !== undefined) params.new_location = options.newLocation;

    return this.lunRequest('set', params);
  }

  // =====================================================
  // LUN - Cloning
  // =====================================================

  /**
   * Clone a LUN.
   *
   * @param srcLunUuid - Source LUN UUID.
   * @param dstLunName - Destination LUN name.
   * @param options - Optional clone parameters.
   */
  async lunClone(
    srcLunUuid: string,
    dstLunName: string,
    options: LunCloneOptions = {},
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      src_lun_uuid: JSON.stringify(srcLunUuid),
      dst_lun_name: dstLunName,
    };

    if (options.cloneType !== undefined) params.clone_type = options.cloneType;
    if (options.dstLocation !== undefined) params.dst_location = options.dstLocation;
    if (options.dstNodeUuid !== undefined) params.dst_node_uuid = options.dstNodeUuid;
    if (options.dstAddress !== undefined) params.dst_address = options.dstAddress;
    if (options.dstPort !== undefined) params.dst_port = options.dstPort;
    if (options.isDataEncrypted !== undefined) params.is_data_encrypted = options.isDataEncrypted;
    if (options.isSoftFeasIgnored !== undefined) params.is_soft_feas_ignored = options.isSoftFeasIgnored;
    if (options.isDataClone !== undefined) params.is_data_clone = options.isDataClone;

    return this.lunRequest('clone', params);
  }

  /**
   * Stop an in-progress LUN clone operation.
   *
   * @param srcLunUuid - Source LUN UUID.
   */
  async lunStopClone(srcLunUuid: string): Promise<SynoResponse> {
    return this.lunRequest('stop_clone', {
      src_lun_uuid: JSON.stringify(srcLunUuid),
    });
  }

  // =====================================================
  // LUN - Target mapping
  // =====================================================

  /**
   * Map a LUN to one or more targets.
   *
   * @param uuid - LUN UUID.
   * @param targetIds - Target ID or array of target IDs.
   */
  async lunMapTarget(
    uuid: string,
    targetIds: number | string | ReadonlyArray<number | string>,
  ): Promise<SynoResponse> {
    const ids = ensureList(targetIds).map(Number);

    return this.lunRequest('map_target', {
      uuid: JSON.stringify(uuid),
      target_ids: JSON.stringify(ids),
    });
  }

  /**
   * Unmap a LUN from one or more targets.
   *
   * @param uuid - LUN UUID.
   * @param targetIds - Target ID or array of target IDs.
   */
  async lunUnmapTarget(
    uuid: string,
    targetIds: number | string | ReadonlyArray<number | string>,
  ): Promise<SynoResponse> {
    const ids = ensureList(targetIds).map(Number);

    return this.lunRequest('unmap_target', {
      uuid: JSON.stringify(uuid),
      target_ids: JSON.stringify(ids),
    });
  }

  // =====================================================
  // Target - Core
  // =====================================================

  /**
   * Create an iSCSI target.
   *
   * @param name - Target name.
   * @param iqn - iSCSI Qualified Name.
   * @param authType - Authentication type: 0=none, 1=single CHAP, 2=mutual CHAP.
   * @param options - Optional creation parameters including CHAP credentials.
   */
  async targetCreate(
    name: string,
    iqn: string,
    authType: AuthType = 0,
    options: TargetCreateOptions = {},
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      name,
      iqn,
      auth_type: authType,
    };

    if (options.maxSessions) {
      params.max_sessions = options.maxSessions;
    }

    if (authType >= 1) {
      params.user = options.user;
      params.password = options.password;
    }

    if (authType === 2) {
      params.mutual_user = options.mutualUser;
      params.mutual_password = options.mutualPassword;
    }

    return this.targetRequest('create', params);
  }

  /**
   * Delete an iSCSI target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   */
  async targetDelete(targetId: number | string): Promise<SynoResponse> {
    return this.targetRequest('delete', {
      target_id: JSON.stringify(String(targetId)),
    });
  }

  /**
   * List available iSCSI targets.
   *
   * @param additionalInfo - Additional information to include. Specify [] for basic info only.
   * @param lunUuid - Filter targets mapped to a LUN with the provided UUID.
   */
  async targetList(
    additionalInfo: readonly string[] = TARGET_ADDITIONAL_FIELDS,
    lunUuid?: string,
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {};

    const filtered = filterKnown(additionalInfo, TARGET_ADDITIONAL_FIELDS);
    if (filtered.length > 0) {
      params.additional = JSON.stringify(filtered);
    }

    if (lunUuid) {
      params.lun_uuid = JSON.stringify(lunUuid);
    }

    return this.targetRequest('list', params);
  }

  /**
   * Get detailed information for a specific iSCSI target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   * @param additionalInfo - Additional information to include. Specify [] for basic info only.
   */
  async targetGet(
    targetId: number | string,
    additionalInfo: readonly string[] = TARGET_ADDITIONAL_FIELDS,
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      target_id: JSON.stringify(String(targetId)),
    };

    const filtered = filterKnown(additionalInfo, TARGET_ADDITIONAL_FIELDS);
    if (filtered.length > 0) {
      params.additional = JSON.stringify(filtered);
    }

    return this.targetRequest('get', params);
  }

  /**
   * Update iSCSI target properties.
   *
   * @param targetId - Integer ID of the iSCSI target.
   * @param options - Properties to update.
   */
  async targetSet(
    targetId: number | string,
    options: TargetSetOptions = {},
  ): Promise<SynoResponse> {
    const params: Record<string, unknown> = {
      target_id: JSON.stringify(String(targetId)),
    };

    if (options.newName !== undefined) params.name = options.newName;
    if (options.newIqn !== undefined) params.iqn = options.newIqn;
    if (options.maxSessions !== undefined) params.max_sessions = options.maxSessions;
    if (options.hasDataChecksum !== undefined) params.has_data_checksum = options.hasDataChecksum;
    if (options.authType !== undefined) params.auth_type = options.authType;
    if (options.user !== undefined) params.user = options.user;
    if (options.password !== undefined) params.password = options.password;
    if (options.mutualUser !== undefined) params.mutual_user = options.mutualUser;
    if (options.mutualPassword !== undefined) params.mutual_password = options.mutualPassword;
    if (options.maxRecvSegBytes !== undefined) params.max_recv_seg_bytes = options.maxRecvSegBytes;
    if (options.maxSendSegBytes !== undefined) params.max_send_seg_bytes = options.maxSendSegBytes;
    if (options.hasHeaderChecksum !== undefined) params.has_header_checksum = options.hasHeaderChecksum;

    return this.targetRequest('set', params);
  }

  // =====================================================
  // Target - Enable / Disable
  // =====================================================

  /**
   * Enable an iSCSI target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   */
  async targetEnable(targetId: number | string): Promise<SynoResponse> {
    return this.targetRequest('enable', {
      target_id: JSON.stringify(String(targetId)),
    });
  }

  /**
   * Disable an iSCSI target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   */
  async targetDisable(targetId: number | string): Promise<SynoResponse> {
    return this.targetRequest('disable', {
      target_id: JSON.stringify(String(targetId)),
    });
  }

  // =====================================================
  // Target - LUN mapping
  // =====================================================

  /**
   * Map one or more LUNs to a target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   * @param lunUuids - LUN UUID or array of LUN UUIDs.
   */
  async targetMapLun(
    targetId: number | string,
    lunUuids: string | readonly string[],
  ): Promise<SynoResponse> {
    const uuidList = ensureList(lunUuids);

    return this.targetRequest('map_lun', {
      target_id: JSON.stringify(String(targetId)),
      lun_uuids: JSON.stringify(uuidList),
    });
  }

  /**
   * Unmap one or more LUNs from a target.
   *
   * @param targetId - Integer ID of the iSCSI target.
   * @param lunUuids - LUN UUID or array of LUN UUIDs.
   */
  async targetUnmapLun(
    targetId: number | string,
    lunUuids: string | readonly string[],
  ): Promise<SynoResponse> {
    const uuidList = ensureList(lunUuids);

    return this.targetRequest('unmap_lun', {
      target_id: JSON.stringify(String(targetId)),
      lun_uuids: JSON.stringify(uuidList),
    });
  }
}
