/**
 * Synology Active Backup for Business API module.
 * Ported from Python synology_api/core_active_backup.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

/** Log level filter values. */
type LogLevel = 'error' | 'warning' | 'information';

/** Result status filter values. */
type ResultStatus = 'success' | 'partial_success' | 'fail' | 'cancel' | 'no_backup';

/** Backup type filter values. */
type BackupType = 'vm' | 'pc' | 'physical_server' | 'file_server' | 'nas';

/** Action type filter values. */
type ActionType =
  | 'backup'
  | 'dedup_data'
  | 'restore'
  | 'migrate'
  | 'delete_target'
  | 'delete_version'
  | 'delete_host'
  | 'relink'
  | 'create_task';

/** Task status filter values. */
type TaskStatus = 'backingup' | 'waiting' | 'deleting' | 'unscheduled';

/** Traffic control configuration. */
interface TrafficControl {
  readonly enable: boolean;
  readonly bandwidth: number;
}

/** Filter options for internal filter builder. */
interface FilterOptions {
  readonly logLevel?: LogLevel;
  readonly keyword?: string;
  readonly fromDate?: number;
  readonly toDate?: number;
  readonly taskStatus?: TaskStatus | string;
  readonly resultStatus?: ResultStatus;
  readonly backupType?: BackupType;
  readonly actionType?: ActionType;
}

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  error: 0,
  warning: 1,
  information: 2,
};

const RESULT_STATUS_MAP: Record<ResultStatus, number> = {
  success: 2,
  partial_success: 3,
  fail: 4,
  cancel: 5,
  no_backup: 6,
};

const BACKUP_TYPE_MAP: Record<BackupType, number> = {
  vm: 1,
  pc: 2,
  physical_server: 3,
  file_server: 4,
  nas: 5,
};

const ACTION_TYPE_MAP: Record<ActionType, number | number[]> = {
  backup: 1,
  dedup_data: 1048576,
  restore: [128, 1024, 2048],
  migrate: 256,
  delete_target: 65536,
  delete_version: 131072,
  delete_host: 262144,
  relink: 2097152,
  create_task: 268435456,
};

export class ActiveBackup extends BaseModule {
  protected readonly application = 'ActiveBackup';

  /**
   * Build a filter dictionary for API requests based on provided options.
   */
  private createFilter(options: FilterOptions): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (options.keyword) {
      filter['key_word'] = options.keyword;
    }
    if (options.fromDate && options.fromDate > 0) {
      filter['from_timestamp'] = options.fromDate;
    }
    if (options.toDate && options.toDate > 0) {
      filter['to_timestamp'] = options.toDate;
    }
    if (options.taskStatus) {
      filter['status'] = options.taskStatus;
    }
    if (options.logLevel && options.logLevel in LOG_LEVEL_MAP) {
      filter['log_level'] = LOG_LEVEL_MAP[options.logLevel];
    }
    if (options.resultStatus && options.resultStatus in RESULT_STATUS_MAP) {
      filter['status'] = RESULT_STATUS_MAP[options.resultStatus];
    }
    if (options.backupType && options.backupType in BACKUP_TYPE_MAP) {
      filter['backup_type'] = BACKUP_TYPE_MAP[options.backupType];
    }
    if (options.actionType && options.actionType in ACTION_TYPE_MAP) {
      filter['job_action'] = ACTION_TYPE_MAP[options.actionType];
    }

    return filter;
  }

  /**
   * Get the package settings including certificate information.
   */
  async getSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list',
    });
  }

  /**
   * Set the maximum number of concurrent devices that can be backed up
   * at the same time. Effective starting from the next backup.
   */
  async setConcurrentDevices(value: number): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const settings = [{ name: 'max_concurrent_devices', value: String(value) }];

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      settings: JSON.stringify(settings),
    });
  }

  /**
   * Set the time of day when the retention policy will be executed.
   *
   * @param hour - Hour in 24-hour format (0-23).
   * @param minute - Minute (0-59).
   */
  async setRetentionPolicyExecTime(hour: number, minute: number): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const settings = [
      { name: 'retention_run_hour', value: String(hour) },
      { name: 'retention_run_min', value: String(minute) },
    ];

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      settings: JSON.stringify(settings),
    });
  }

  /**
   * Set the global bandwidth control and IP range bandwidth control.
   * Applies only to PC, Physical Server and NAS devices.
   * When multiple tasks run simultaneously, the system will evenly
   * distribute the throttled traffic.
   *
   * @param trafficControl - Enable/disable traffic control and bandwidth in MB/s.
   * @param ipRange - Optional IP range [start, end] for targeted bandwidth control (IPv4 only).
   */
  async setTrafficThrottle(
    trafficControl: TrafficControl = { enable: false, bandwidth: 0 },
    ipRange: [string, string] = ['', ''],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const settings: Array<{ name: string; value: string }> = [];

    const item = (key: string, value: string): { name: string; value: string } => ({
      name: key,
      value,
    });

    if (trafficControl.enable && trafficControl.bandwidth > -1) {
      settings.push(item('enable_global_bandwidth_control', 'true'));
      settings.push(item('global_backup_bandwidth_number', String(trafficControl.bandwidth)));

      if (ipRange[0] && ipRange[1]) {
        settings.push(item('enable_ip_range_bandwidth_control', 'true'));
        settings.push(item('bandwidth_control_ip_start', ipRange[0]));
        settings.push(item('bandwidth_control_ip_end', ipRange[1]));
      } else {
        settings.push(item('enable_ip_range_bandwidth_control', 'false'));
      }
    } else {
      settings.push(item('enable_global_bandwidth_control', 'false'));
    }

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      settings: JSON.stringify(settings),
    });
  }

  /**
   * Set whether to use the self-signed certificate provided by the package.
   */
  async setUsePkgCert(usePackageCert: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set',
      settings: '[]',
      cert_use_package: usePackageCert,
    });
  }

  /**
   * Get a list of all configured hypervisors present in ABB.
   */
  async listVmHypervisor(): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Inventory';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list',
    });
  }

  /**
   * Get a list of all devices and their respective transfer size
   * for the given time frame.
   *
   * @param timeStart - Start time in epoch seconds. Defaults to 24 hours ago.
   * @param timeEnd - End time in epoch seconds. Defaults to current time.
   */
  async listDeviceTransferSize(
    timeStart: number = Math.floor(Date.now() / 1000) - 86400,
    timeEnd: number = Math.floor(Date.now() / 1000),
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Overview';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list_device_transfer_size',
      time_start: timeStart,
      time_end: timeEnd,
    });
  }

  /**
   * Get information of one or all tasks.
   *
   * @param taskId - Specific task ID, or -1 for all tasks.
   * @param backupType - Filter by device/backup type.
   * @param status - Filter by task status.
   * @param fromDate - Only include tasks with last backup >= this epoch seconds.
   * @param toDate - Only include tasks with last backup <= this epoch seconds.
   * @param includeVersions - Whether to include version information.
   */
  async listTasks(
    taskId = -1,
    backupType: BackupType | '' = '',
    status: TaskStatus | '' = '',
    fromDate = 0,
    toDate = 0,
    includeVersions = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const filter: Record<string, unknown> = this.createFilter({
      backupType: backupType || undefined,
      taskStatus: status || undefined,
      fromDate,
      toDate,
    });

    // This API requires the task_id inside filters instead of an independent param
    if (taskId > -1) {
      filter['task_id'] = taskId;
    }

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list',
      load_status: true,
      load_result: true,
      load_devices: true,
      load_versions: includeVersions,
      filter: JSON.stringify(filter),
    });
  }

  /**
   * Get logs from the package, tasks and devices.
   * For specific task logs, specify taskId parameter.
   *
   * @param taskId - Specific task ID, or -1 for all logs.
   * @param logLevel - Filter by log level.
   * @param keyword - Filter keyword.
   * @param fromDate - Start date in epoch seconds.
   * @param toDate - End date in epoch seconds.
   * @param offset - Result offset.
   * @param limit - Maximum number of results.
   */
  async listLogs(
    taskId = -1,
    logLevel: LogLevel | '' = '',
    keyword = '',
    fromDate = 0,
    toDate = 0,
    offset = 0,
    limit = 200,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const filter = this.createFilter({
      logLevel: logLevel || undefined,
      keyword: keyword || undefined,
      fromDate,
      toDate,
    });

    const params: Record<string, unknown> = {
      version: 1,
      method: 'list_log',
      offset,
      limit,
      filter: JSON.stringify(filter),
    };

    if (taskId > -1) {
      params['task_id'] = taskId;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Return the history of task execution.
   *
   * @param taskId - Specific task ID, or -1 for all tasks.
   * @param status - Filter by result status.
   * @param keyword - Filter keyword.
   * @param backupType - Filter by backup type.
   * @param actionType - Filter by action type.
   * @param fromDate - Start date in epoch seconds.
   * @param toDate - End date in epoch seconds.
   * @param offset - Result offset.
   * @param limit - Maximum number of results.
   */
  async taskHistory(
    taskId = -1,
    status: ResultStatus | '' = '',
    keyword = '',
    backupType: BackupType | '' = '',
    actionType: ActionType | '' = '',
    fromDate = 0,
    toDate = 0,
    offset = 0,
    limit = 200,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const filter = this.createFilter({
      resultStatus: status || undefined,
      keyword: keyword || undefined,
      backupType: backupType || undefined,
      actionType: actionType || undefined,
      fromDate,
      toDate,
    });

    const params: Record<string, unknown> = {
      version: 1,
      method: 'list_result',
      offset,
      limit,
      filter: JSON.stringify(filter),
    };

    if (taskId > -1) {
      params['task_id'] = taskId;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Get details of a task result log.
   *
   * @param resultId - ID of the result to get details from.
   * @param limit - Maximum number of results.
   * @param orderBy - Field to order results by ('log_level' or 'log_time').
   * @param direction - Sort direction ('ASC' or 'DESC').
   */
  async resultDetails(
    resultId: number,
    limit = 500,
    orderBy: 'log_level' | 'log_time' = 'log_level',
    direction: 'ASC' | 'DESC' = 'ASC',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list_result_detail',
      result_id: resultId,
      limit,
      order_by: orderBy,
      direction,
    });
  }

  /**
   * Get a list of all storage devices present in ABB.
   */
  async listStorage(): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'list_storage',
    });
  }

  /**
   * Trigger a backup event for the given tasks.
   *
   * @param taskIds - List of task IDs to trigger backup for.
   */
  async backupTaskRun(taskIds: number[]): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'backup',
      task_ids: JSON.stringify(taskIds),
      trigger_type: '1',
    });
  }

  /**
   * Cancel specified ongoing tasks.
   *
   * @param taskIds - List of task IDs to cancel.
   */
  async backupTaskCancel(taskIds: number[]): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'cancel',
      task_ids: JSON.stringify(taskIds),
    });
  }

  /**
   * Remove the given tasks from ABB.
   * Warning: This will remove the task and all its versions.
   * The backed up data will NOT be preserved after this operation.
   *
   * @param taskIds - List of task IDs to remove.
   */
  async backupTaskRemove(taskIds: number[]): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'remove',
      task_ids: JSON.stringify(taskIds),
    });
  }

  /**
   * Delete the specified versions from a task.
   * Warning: This will remove the specified versions.
   * The corresponding version data will NOT be preserved after this operation.
   *
   * @param taskId - Task ID from which to delete the versions.
   * @param versionIds - List of version IDs to delete.
   */
  async backupTaskDeleteVersions(
    taskId: number,
    versionIds: number[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.ActiveBackup.Version';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'delete',
      task_id: taskId,
      version_ids: JSON.stringify(versionIds),
    });
  }
}
