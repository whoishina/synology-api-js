/**
 * Synology Hyper Backup API module.
 * Ported from Python synology_api/core_backup.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class CoreBackup extends BaseModule {
  protected readonly application = 'Core';

  /**
   * Get repository information for a given task.
   */
  async backupRepositoryGet(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Repository';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get',
      task_id: taskId,
    });
  }

  /**
   * Get a list of all present repositories in Hyper Backup.
   */
  async backupRepositoryList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Repository';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
    });
  }

  /**
   * Get current restoring information and a list of present tasks in Hyper Backup.
   */
  async backupTaskList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
    });
  }

  /**
   * Get status and state of a task.
   */
  async backupTaskStatus(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'status',
      task_id: taskId,
    });
  }

  /**
   * Get detailed task information.
   */
  async backupTaskGet(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get',
      task_id: taskId,
    });
  }

  /**
   * Get last result summary information of a task.
   */
  async backupTaskResult(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'status',
      blOnline: 'false',
      additional: '["last_bkp_time","next_bkp_time","last_bkp_result","is_modified","last_bkp_progress"]',
      task_id: taskId,
    });
  }

  /**
   * Run backup task for corresponding task ID.
   * If the task is not in backupable state, the API will return an error, usually 44xx.
   */
  async backupTaskRun(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'backup',
      task_id: taskId,
    });
  }

  /**
   * Cancel currently running backup task.
   * If the task is not running, the API will return an error, usually 44xx.
   */
  async backupTaskCancel(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'cancel',
      task_state: 'backupable',
      task_id: taskId,
    });
  }

  /**
   * Suspend currently running backup task.
   * If the task is not running or not yet suspendable, the API will return an error, usually 44xx.
   */
  async backupTaskSuspend(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'suspend',
      task_state: 'backupable',
      task_id: taskId,
    });
  }

  /**
   * Discard currently suspended backup task.
   * If the task is not suspended, the request will not fail but will fail to discard,
   * leaving the task state as "Failed".
   */
  async backupTaskDiscard(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'discard',
      task_id: taskId,
    });
  }

  /**
   * Resume currently suspended backup task.
   * If the task is not suspended, the request will not fail but will fail to resume,
   * leaving the task state as "Failed".
   */
  async backupTaskResume(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'resume',
      task_id: taskId,
    });
  }

  /**
   * Remove one or more backup tasks.
   * Data in destination will not be removed. It is still possible to relink the task
   * using the original .hbk file.
   *
   * @param taskIdList - List of task IDs as a JSON array string, e.g. '[29]' or '[29,15]'
   */
  async backupTaskRemove(taskIdList: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Task';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'delete',
      is_remove_data: false,
      task_id_list: taskIdList,
    });
  }

  /**
   * Run integrity check for backup task.
   * If the task is running, the request will not fail but will fail to perform
   * the integrity check due to target being busy.
   */
  async integrityCheckRun(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Target';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'error_detect',
      detect_data: true,
      sessId: 'null',
      sessKey: 'null',
      task_id: taskId,
    });
  }

  /**
   * Cancel currently running integrity check for backup task.
   * If integrity check is not running, the API will return an error, usually 44xx.
   */
  async integrityCheckCancel(taskId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Target';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'error_detect_cancel',
      task_id: taskId,
    });
  }

  /**
   * Get Hyper Backup UI logs.
   *
   * @param options.limit - Maximum number of logs to return (default 1000)
   * @param options.offset - Offset for pagination (default 0)
   * @param options.filterKeyword - Keyword to filter logs (default '')
   * @param options.filterDateFrom - Start date in epoch format (default 0)
   * @param options.filterDateTo - End date in epoch format (default 0)
   */
  async hbLogsGet(options?: {
    limit?: number;
    offset?: number;
    filterKeyword?: string;
    filterDateFrom?: number;
    filterDateTo?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SDS.Backup.Client.Common.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
      limit: options?.limit ?? 1000,
      offset: options?.offset ?? 0,
      filter_keyword: options?.filterKeyword ?? '',
      filter_date_from: options?.filterDateFrom ?? 0,
      filter_date_to: options?.filterDateTo ?? 0,
    });
  }

  /**
   * List all available targets in Vault.
   */
  async vaultTargetList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Service.VersionBackup.Target';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
    });
  }

  /**
   * Get number of concurrent tasks allowed to run in HB Vault.
   */
  async vaultConcurrencyGet(): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Service.VersionBackup.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get',
    });
  }

  /**
   * Set number of concurrent tasks allowed to run in HB Vault.
   *
   * @param parallelBackupLimit - Number of concurrent tasks (default 2)
   */
  async vaultConcurrencySet(parallelBackupLimit = 2): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Service.VersionBackup.Config';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'set',
      parallel_backup_limit: parallelBackupLimit,
    });
  }

  /**
   * Get settings of a vault target.
   */
  async vaultTargetSettingsGet(targetId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Service.VersionBackup.Target';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'detail',
      target_id: targetId,
    });
  }

  /**
   * Get statistics for a given vault task.
   */
  async vaultTaskStatisticsGet(taskId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SDS.Backup.Server.Common.Statistic';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'get',
      additional: '["volume_size"]',
      task_id: taskId,
    });
  }

  /**
   * Get logs for a given vault target.
   *
   * @param targetId - Target ID
   * @param options.limit - Maximum number of logs to return (default 1000)
   * @param options.offset - Offset for pagination (default 0)
   */
  async vaultTargetLogsGet(
    targetId: number,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SDS.Backup.Server.Common.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'list',
      limit: options?.limit ?? 1000,
      offset: options?.offset ?? 0,
      filter_target_id: targetId,
    });
  }
}
