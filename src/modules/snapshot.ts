/**
 * Synology Snapshot Replication API module.
 * Ported from Python synology_api/snapshot.py
 *
 * This module provides methods to interact with the Synology Snapshot Replication APIs.
 * The implementation is based on network inspection, as there is no official documentation.
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

/**
 * Options for creating an immutable (WORM) share snapshot.
 */
interface ImmutableOptions {
  /** Enable immutability (WORM lock) on the snapshot. */
  readonly immutable: true;
  /** Number of days the snapshot remains immutable. Must be >= 1. */
  readonly immutableDays: number;
}

/**
 * Options for setting immutability attributes on an existing snapshot.
 */
interface SetImmutableOptions {
  /** Enable immutability (WORM lock). Can only be set to true. */
  readonly immutable: true;
  /** Number of days the snapshot remains immutable. Must be >= 1. */
  readonly immutableDays: number;
}

/**
 * Default LUN types used for listing LUNs.
 */
const DEFAULT_LUN_TYPES: readonly string[] = [
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
];

/**
 * Default additional info fields for LUN listing.
 */
const DEFAULT_LUN_ADDITIONAL_INFO: readonly string[] = [
  'is_action_locked',
  'is_mapped',
  'extent_size',
  'allocated_size',
  'status',
  'allow_bkpobj',
  'flashcache_status',
  'family_config',
  'snapshot_info',
];

/**
 * Default additional info fields for replication plan listing.
 */
const DEFAULT_REPLICATION_ADDITIONAL_INFO: readonly string[] = [
  'sync_policy',
  'sync_report',
  'main_site_info',
  'dr_site_info',
  'can_do',
  'op_info',
  'last_op_info',
  'topology',
  'testfailover_info',
  'retention_lock_report',
];

/**
 * Default additional fields for LUN snapshot listing.
 */
const DEFAULT_LUN_SNAPSHOT_ADDITIONAL: readonly string[] = [
  'locked_app_keys',
  'is_worm_locked',
];

export class Snapshot extends BaseModule {
  protected readonly application = 'Core';

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /**
   * List snapshots for a share.
   *
   * @param shareName - Name of the share to list snapshots for.
   * @param attributeFilter - Attribute filters to apply. Each entry is a string
   *   like "attr==value" or "!attr==value". Defaults to [].
   * @param additionalAttribute - Snapshot attributes whose values are included
   *   in the response (e.g. "desc", "lock", "worm_lock", "schedule_snapshot").
   *   Defaults to [].
   * @param offset - Offset to start listing from. Defaults to 0.
   * @param limit - Number of snapshots to return. -1 for all. Defaults to -1.
   */
  async listSnapshots(
    shareName: string,
    attributeFilter: readonly string[] = [],
    additionalAttribute: readonly string[] = [],
    offset = 0,
    limit = -1,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Snapshot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 2,
      method: 'list',
      name: shareName,
      filter: JSON.stringify({ attr: attributeFilter }),
      additional: JSON.stringify(additionalAttribute),
      offset,
      limit,
    });
  }

  /**
   * List snapshots for a LUN.
   *
   * @param srcLunUuid - UUID of the source LUN to list snapshots for.
   * @param additional - Additional fields to retrieve. Defaults to
   *   ["locked_app_keys", "is_worm_locked"].
   */
  async listSnapshotsLun(
    srcLunUuid: string,
    additional: readonly string[] = DEFAULT_LUN_SNAPSHOT_ADDITIONAL,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list_snapshot',
      src_lun_uuid: srcLunUuid,
      additional: JSON.stringify(additional),
    });
  }

  /**
   * List available LUNs.
   *
   * @param types - Types of LUNs to retrieve. Defaults to all known types.
   * @param additionalInfo - Additional LUN information to include in the response.
   *   Defaults to a comprehensive list of attributes.
   */
  async listLuns(
    types: readonly string[] = DEFAULT_LUN_TYPES,
    additionalInfo: readonly string[] = DEFAULT_LUN_ADDITIONAL_INFO,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list',
      types: JSON.stringify(types),
      additional: JSON.stringify(additionalInfo),
    });
  }

  /**
   * List replication plans.
   *
   * @param additionalInfo - Additional info to include (e.g. "sync_policy",
   *   "sync_report", "main_site_info", "dr_site_info", "can_do", "op_info",
   *   "last_op_info", "topology", "testfailover_info", "retention_lock_report").
   */
  async listReplicationPlans(
    additionalInfo: readonly string[] = DEFAULT_REPLICATION_ADDITIONAL_INFO,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.DR.Plan';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list',
      additional: JSON.stringify(additionalInfo),
    });
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /**
   * Create a snapshot for a share.
   *
   * @param shareName - Name of the share to create a snapshot for.
   * @param description - Description of the snapshot. Defaults to "".
   * @param lock - Whether to lock the snapshot. Defaults to false.
   * @param immutableOptions - Optional WORM immutability settings.
   *   When provided, immutableDays must be >= 1.
   */
  async createSnapshot(
    shareName: string,
    description = '',
    lock = false,
    immutableOptions?: ImmutableOptions,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Snapshot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const snapinfo: Record<string, unknown> = {
      desc: description,
      lock,
    };

    if (immutableOptions) {
      if (immutableOptions.immutableDays < 1) {
        throw new Error('immutableDays must be greater than 0');
      }
      snapinfo['worm_lock'] = true;
      snapinfo['worm_lock_day'] = immutableOptions.immutableDays;
    }

    return this.request(apiName, info.path, {
      version: 1,
      method: 'create',
      snapinfo: JSON.stringify(snapinfo),
      name: shareName,
    });
  }

  /**
   * Delete snapshots for a share.
   *
   * Warning: This action removes data from the file system. Use with caution.
   *
   * @param shareName - Name of the share to delete snapshots for.
   * @param snapshots - List of snapshot names to delete.
   */
  async deleteSnapshots(
    shareName: string,
    snapshots: readonly string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Snapshot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'delete',
      name: shareName,
      snapshots: JSON.stringify(snapshots),
    });
  }

  /**
   * Set attributes for a share snapshot.
   *
   * @param shareName - Name of the share.
   * @param snapshot - Name of the snapshot to modify.
   * @param description - New description. Omit to leave unchanged.
   * @param lock - Whether to lock the snapshot. Omit to leave unchanged.
   * @param immutableOptions - WORM immutability settings. Can only enable
   *   immutability (cannot disable). immutableDays must be >= 1.
   */
  async setSnapshotAttr(
    shareName: string,
    snapshot: string,
    description?: string,
    lock?: boolean,
    immutableOptions?: SetImmutableOptions,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share.Snapshot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const snapinfo: Record<string, unknown> = {};

    if (description !== undefined) {
      snapinfo['desc'] = description;
    }

    if (lock !== undefined) {
      snapinfo['lock'] = lock;
    }

    if (immutableOptions) {
      if (immutableOptions.immutableDays < 1) {
        throw new Error('immutableDays must be greater than 0');
      }
      snapinfo['worm_lock'] = true;
      snapinfo['worm_lock_day'] = immutableOptions.immutableDays;
    }

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      snapinfo: JSON.stringify(snapinfo),
      name: shareName,
      snapshot,
    });
  }

  /**
   * Trigger a sync for a replication plan.
   *
   * Fetches the plan's sync policy first to determine whether send-encrypted
   * is enabled, then initiates the sync.
   *
   * @param planId - ID of the replication plan to sync.
   * @param lockSnapshot - Whether to lock the snapshot to prevent rotation. Defaults to true.
   * @param description - Description of the snapshot. Defaults to
   *   "Snapshot taken by [Synology API]".
   */
  async syncReplication(
    planId: string,
    lockSnapshot = true,
    description = 'Snapshot taken by [Synology API]',
  ): Promise<SynoResponse> {
    // Retrieve plans to determine the is_send_encrypted flag
    const plansResponse = await this.listReplicationPlans(['sync_policy']);

    let isSendEncrypted: boolean | undefined;

    if (plansResponse.data) {
      const data = plansResponse.data as { plans?: ReadonlyArray<Record<string, unknown>> };
      if (data.plans) {
        for (const plan of data.plans) {
          if (plan['plan_id'] === planId) {
            const additional = plan['additional'] as Record<string, unknown> | undefined;
            const syncPolicy = additional?.['sync_policy'] as Record<string, unknown> | undefined;
            isSendEncrypted = syncPolicy?.['is_send_encrypted'] as boolean | undefined;
          }
        }
      }
    }

    const apiName = 'SYNO.DR.Plan';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'sync',
      nowait: true,
      auto_remove: true,
      plan_id: planId,
      is_snapshot_locked: lockSnapshot,
      is_send_encrypted: isSendEncrypted,
      sync_description: description,
    });
  }

  /**
   * Create a snapshot for a LUN.
   *
   * Note: Does not support creating WORM snapshots at this time.
   *
   * @param lunId - ID (UUID) of the LUN to create a snapshot for.
   * @param description - Description of the snapshot. Defaults to
   *   "Snapshot taken by [Synology API]".
   * @param lock - Whether to lock the snapshot. Defaults to true.
   * @param appAware - Whether to make the snapshot application-aware. Defaults to true.
   */
  async createSnapshotLun(
    lunId: string,
    description = 'Snapshot taken by [Synology API]',
    lock = true,
    appAware = true,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'take_snapshot',
      taken_by: 'user',
      src_lun_uuid: lunId,
      description,
      is_locked: lock,
      is_app_consistent: appAware,
    });
  }

  /**
   * Delete snapshots for a LUN.
   *
   * Warning: This action removes data from the file system. Use with caution.
   *
   * @param snapshotUuids - List of UUIDs of the snapshots to delete.
   */
  async deleteSnapshotsLun(
    snapshotUuids: readonly string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'delete_snapshot',
      snapshot_uuids: JSON.stringify(snapshotUuids),
    });
  }
}
