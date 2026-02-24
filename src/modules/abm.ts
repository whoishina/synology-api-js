/**
 * Active Backup for Microsoft 365 API module.
 * Ported from Python synology_api/abm.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

/** Schedule configuration for a task. */
interface TaskScheduleConfig {
  readonly startHour: number;
  readonly startMinute: number;
  readonly lastRunHour: number;
  readonly repeatEveryHours: number;
  readonly runDays: number[];
}

/** Internal task info shape returned by the API (subset of known fields). */
interface TaskInfo {
  app_permissions?: unknown;
  administrator_account_email?: string;
  application_id?: string;
  tenant_id?: string;
  user_list: unknown[];
  group_list: unknown[];
  all_site_list: unknown[];
  general_site_list: unknown[];
  my_site_list: unknown[];
  team_list: unknown[];
  backup_policy: number;
  enable_schedule: boolean;
  rotation_policy: number;
  preserve_day_number: number;
  schedule: {
    date: string;
    date_type: number;
    hour: number;
    last_work_hour: number;
    minute: number;
    monthly_week: unknown[];
    repeat_date: number;
    repeat_hour: number;
    repeat_hour_store_config: unknown;
    repeat_min: number;
    repeat_min_store_config: unknown;
    repeat_minute_store_config?: unknown;
    week_day: string;
  };
  [key: string]: unknown;
}

/** Internal task list item shape returned by the API. */
interface TaskListItem {
  task_id: number;
  status: number;
  job_id: number;
  [key: string]: unknown;
}

/** Relink task info payload. */
interface RelinkTaskInfo {
  readonly selected: boolean;
  readonly task_name: string;
  readonly local_shared: string;
  readonly local_path: string;
  readonly region: string;
  readonly admin_email: string;
}

/** Worker count response data. */
interface WorkerCountData {
  backup_job_worker_count: number;
  event_worker_count: number;
  max_backup_job_worker_count: number;
  max_event_worker_count: number;
}

/** Task setting response data. */
interface TaskSettingData {
  task_info: TaskInfo;
}

/** Task list response data. */
interface TaskListData {
  tasks: TaskListItem[];
  [key: string]: unknown;
}

export class ActiveBackupMicrosoft extends BaseModule {
  protected readonly application = 'ActiveBackupOffice365';

  private static readonly API_NAME = 'SYNO.ActiveBackupOffice365';

  /**
   * Remove readonly/unnecessary fields from task info before sending updates.
   */
  private trimTaskInfo(taskInfo: TaskInfo): TaskInfo {
    const trimmed = { ...taskInfo };

    // Remove unnecessary / readonly fields
    delete trimmed.app_permissions;
    delete trimmed.administrator_account_email;
    delete trimmed.application_id;
    delete trimmed.tenant_id;

    // Clear lists - can only be modified by adding new entries
    trimmed.user_list = [];
    trimmed.group_list = [];
    trimmed.all_site_list = [];
    trimmed.general_site_list = [];
    trimmed.my_site_list = [];
    trimmed.team_list = [];

    return trimmed;
  }

  /**
   * Retrieve all tasks.
   */
  async getTasks(): Promise<SynoResponse<TaskListData>> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request<TaskListData>(apiName, info.path, {
      version: 1,
      method: 'list_tasks',
    });
  }

  /**
   * Retrieve general package logs.
   *
   * @param offset - Log offset. Defaults to 0.
   * @param limit  - Maximum number of logs. Defaults to 200.
   */
  async getPackageLog(offset = 0, limit = 200): Promise<SynoResponse> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'get_general_log',
      offset,
      limit,
    });
  }

  /**
   * Retrieve all logs for a given task.
   *
   * @param taskId  - The task ID.
   * @param limit   - Maximum number of logs. Defaults to 200.
   * @param offset  - Log offset. Defaults to 0.
   * @param keyWord - Optional keyword filter. Defaults to ''.
   */
  async getTaskLog(
    taskId: number,
    limit = 200,
    offset = 0,
    keyWord = '',
  ): Promise<SynoResponse> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'get_all_log',
      task_id: taskId,
      limit,
      offset,
      key_word: keyWord,
    });
  }

  /**
   * Retrieve the settings of a task.
   *
   * @param taskId - The task ID.
   */
  async getTaskSetting(taskId: number): Promise<SynoResponse<TaskSettingData>> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request<TaskSettingData>(apiName, info.path, {
      version: 1,
      method: 'get_task_setting',
      task_id: taskId,
    });
  }

  /**
   * Get the number of workers for the Active Backup for Microsoft 365 package.
   */
  async getWorkerCount(): Promise<SynoResponse<WorkerCountData>> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request<WorkerCountData>(apiName, info.path, {
      version: 1,
      method: 'get_worker_count',
    });
  }

  /**
   * Set the number of workers for the Active Backup for Microsoft 365 package.
   *
   * Both values must be at least 5. Values exceeding the NAS maximum are
   * automatically clamped to the maximum allowed.
   *
   * @param backupJobWorkers - Maximum concurrent backup accounts. Defaults to 40.
   * @param eventWorkers     - Maximum concurrent backup files. Defaults to 40.
   */
  async setWorkerCount(
    backupJobWorkers = 40,
    eventWorkers = 40,
  ): Promise<SynoResponse> {
    if (backupJobWorkers < 5 || eventWorkers < 5) {
      throw new Error('The number of workers must be at least 5.');
    }

    // Clamp to the maximum allowed by the NAS
    const response = await this.getWorkerCount();
    if (!response.data) {
      throw new Error('Failed to retrieve current worker count.');
    }

    const clampedBackupJobWorkers = Math.min(
      backupJobWorkers,
      response.data.max_backup_job_worker_count,
    );
    const clampedEventWorkers = Math.min(
      eventWorkers,
      response.data.max_event_worker_count,
    );

    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'update_worker_count',
      backup_job_worker_count: clampedBackupJobWorkers,
      event_worker_count: clampedEventWorkers,
    });
  }

  /**
   * Set the schedule for a given task.
   *
   * @param taskId   - The task ID.
   * @param policy   - Schedule policy: 0 = continuous, 1 = manual, 2 = scheduled.
   * @param schedule - Schedule configuration (required when policy is 2).
   */
  async setTaskSchedule(
    taskId: number,
    policy: 0 | 1 | 2,
    schedule?: TaskScheduleConfig,
  ): Promise<SynoResponse> {
    if (policy === 2 && !schedule) {
      throw new Error(
        'Received schedule policy, but no schedule was provided.',
      );
    }

    if (
      policy === 2 &&
      schedule &&
      (schedule.startHour === undefined ||
        schedule.startMinute === undefined ||
        schedule.lastRunHour === undefined ||
        schedule.repeatEveryHours === undefined ||
        schedule.runDays === undefined)
    ) {
      throw new Error('Invalid schedule provided.');
    }

    const settingResponse = await this.getTaskSetting(taskId);
    if (!settingResponse.data) {
      throw new Error('Failed to retrieve task setting.');
    }

    const taskInfo = this.trimTaskInfo(settingResponse.data.task_info);

    if (policy !== 2) {
      taskInfo.backup_policy = policy;
      taskInfo.enable_schedule = false;
    } else {
      // Manual backup_policy is required for scheduled setting
      taskInfo.backup_policy = 1;
      taskInfo.enable_schedule = true;
      taskInfo.schedule.date_type = 0; // Recurring backup
      taskInfo.schedule.monthly_week = []; // Not implemented
      taskInfo.schedule.repeat_hour_store_config = null; // Unnecessary
      taskInfo.schedule.repeat_minute_store_config = null; // Unnecessary
      taskInfo.schedule.repeat_date = 0; // Repeat Daily
      taskInfo.schedule.repeat_min = 0; // Not implemented
      taskInfo.schedule.hour = schedule!.startHour;
      taskInfo.schedule.minute = schedule!.startMinute;
      taskInfo.schedule.last_work_hour = schedule!.lastRunHour;
      taskInfo.schedule.repeat_hour = schedule!.repeatEveryHours;
      taskInfo.schedule.week_day = schedule!.runDays.join(',');
    }

    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set_task_setting',
      task_id: taskId,
      task_info: JSON.stringify(taskInfo),
    });
  }

  /**
   * Set the rotation (retention) policy for a given task.
   *
   * @param taskId     - The task ID.
   * @param daysToKeep - Days to keep previous versions. 0 means keep all.
   */
  async setRotationPolicy(
    taskId: number,
    daysToKeep: number,
  ): Promise<SynoResponse> {
    const settingResponse = await this.getTaskSetting(taskId);
    if (!settingResponse.data) {
      throw new Error('Failed to retrieve task setting.');
    }

    const taskInfo = this.trimTaskInfo(settingResponse.data.task_info);

    if (daysToKeep === 0) {
      taskInfo.rotation_policy = 0;
    } else {
      taskInfo.rotation_policy = 1;
      taskInfo.preserve_day_number = daysToKeep;
    }

    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set_task_setting',
      task_id: taskId,
      task_info: JSON.stringify(taskInfo),
    });
  }

  /**
   * Manually run backup for a given task.
   *
   * @param taskId - The task ID.
   */
  async runBackup(taskId: number): Promise<SynoResponse> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'backup_task',
      task_id: taskId,
    });
  }

  /**
   * Cancel a running backup task.
   * Returns undefined if the task is not currently running (status !== 4).
   *
   * @param taskId - The task ID.
   */
  async cancelBackup(taskId: number): Promise<SynoResponse | undefined> {
    const tasksResponse = await this.getTasks();
    if (!tasksResponse.data) {
      throw new Error('Failed to retrieve tasks.');
    }

    const matchingTask = tasksResponse.data.tasks.find(
      (task) => task.task_id === taskId,
    );

    if (!matchingTask) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    // Return undefined if task is not running
    if (matchingTask.status !== 4) {
      return undefined;
    }

    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'cancel_task',
      task_id: taskId,
      job_id: matchingTask.job_id,
      job_type: 0,
    });
  }

  /**
   * Delete a task.
   *
   * WARNING: Misuse of this action may lead to data loss.
   *
   * @param taskId     - The task ID.
   * @param removeData - Whether to remove backup data in the NAS. Defaults to false.
   *                     If true, all task data is permanently lost and the task
   *                     cannot be relinked in the future.
   */
  async deleteTask(
    taskId: number,
    removeData = false,
  ): Promise<SynoResponse> {
    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'delete_task',
      task_id: taskId,
      should_remove_storage: removeData,
    });
  }

  /**
   * Relink a previously deleted or disconnected task.
   *
   * @param taskName    - The name of the task.
   * @param localShared - The shared folder name where the task is stored
   *                      (e.g. 'ActiveBackupforBusiness').
   * @param localPath   - The relative path from the shared folder
   *                      (e.g. '/ActiveBackupForMicrosoft365/task_1').
   * @param adminEmail  - The Microsoft 365 administrator email.
   * @param region      - The Microsoft 365 account region. Defaults to 'Microsoft 365'.
   */
  async relinkTask(
    taskName: string,
    localShared: string,
    localPath: string,
    adminEmail: string,
    region = 'Microsoft 365',
  ): Promise<SynoResponse> {
    const taskInfo: RelinkTaskInfo = {
      selected: true,
      task_name: taskName,
      local_shared: localShared,
      local_path: localPath,
      region,
      admin_email: adminEmail,
    };

    const apiName = ActiveBackupMicrosoft.API_NAME;
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'relink_task',
      task_info: JSON.stringify(taskInfo),
    });
  }
}
