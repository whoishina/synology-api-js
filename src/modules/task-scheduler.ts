/**
 * Synology Task Scheduler API module.
 * Ported from Python synology_api/task_scheduler.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';
import { CoreUser } from './core-user.ts';

// -- Schedule configuration types --

/**
 * Repeat mode when running frequently (date_type = 0).
 */
type FrequentRepeat = 'daily' | 'weekly' | 'monthly';

/**
 * Repeat mode when running on a specific date (date_type = 1).
 */
type DateRepeat = 'no_repeat' | 'monthly' | 'every_3_months' | 'every_6_months' | 'yearly';

/**
 * Union of all repeat modes.
 */
type RepeatMode = FrequentRepeat | DateRepeat;

/**
 * Options for schedule configuration.
 */
interface ScheduleOptions {
  readonly runFrequently?: boolean;
  readonly runDays?: string;
  readonly runDate?: string;
  readonly repeat?: RepeatMode;
  readonly monthlyWeek?: string[];
  readonly startTimeH?: number;
  readonly startTimeM?: number;
  readonly sameDayRepeatH?: number;
  readonly sameDayRepeatM?: number;
  readonly sameDayRepeatUntil?: number;
}

/**
 * Internal schedule dictionary sent to the Synology API.
 */
interface ScheduleDict {
  date_type: number;
  monthly_week: string;
  hour: number;
  minute: number;
  repeat_hour: number;
  repeat_min: number;
  last_work_hour: number;
  repeat_date: number;
  week_day?: string;
  date?: string;
}

/**
 * Service entry for service control tasks.
 */
interface ServiceEntry {
  readonly id: string;
  readonly type: string;
}

/**
 * Recycle bin clean file policy.
 */
type CleanFilePolicy =
  | { readonly policy: 'clean_all' }
  | { readonly policy: 'time'; readonly time: number }
  | { readonly policy: 'size'; readonly size: number; readonly sort_type: number };

// -- Schedule builder --

/**
 * Build a schedule dictionary from the given options.
 * Mirrors the Python _Schedule._generate_dict() method.
 */
function buildScheduleDict(opts: ScheduleOptions): ScheduleDict {
  const runFrequently = opts.runFrequently ?? true;
  const runDays = opts.runDays ?? '0,1,2,3,4,5,6';
  const runDate = opts.runDate ?? '';
  const repeat = opts.repeat ?? 'daily';
  const monthlyWeek = opts.monthlyWeek ?? [];
  const startTimeH = opts.startTimeH ?? 0;
  const startTimeM = opts.startTimeM ?? 0;
  const sameDayRepeatH = opts.sameDayRepeatH ?? 0;
  const sameDayRepeatM = opts.sameDayRepeatM ?? 0;
  const sameDayRepeatUntil = opts.sameDayRepeatUntil ?? -1;

  const dict: ScheduleDict = {
    date_type: runFrequently ? 0 : 1,
    monthly_week: JSON.stringify(monthlyWeek),
    hour: startTimeH,
    minute: startTimeM,
    repeat_hour: sameDayRepeatH,
    repeat_min: sameDayRepeatM,
    last_work_hour: sameDayRepeatUntil > -1 ? sameDayRepeatUntil : startTimeH,
    repeat_date: -1,
  };

  if (runFrequently) {
    if (repeat === 'daily') dict.repeat_date = 1001;
    if (repeat === 'weekly') dict.repeat_date = 1002;
    if (repeat === 'monthly') dict.repeat_date = 1003;
    dict.week_day = runDays;
  } else {
    if (repeat === 'no_repeat') dict.repeat_date = 0;
    if (repeat === 'monthly') dict.repeat_date = 1;
    if (repeat === 'every_3_months') dict.repeat_date = 5;
    if (repeat === 'every_6_months') dict.repeat_date = 3;
    if (repeat === 'yearly') dict.repeat_date = 2;
    dict.date = runDate;
  }

  return dict;
}

// -- Main module --

export class TaskScheduler extends BaseModule {
  protected readonly application = 'Core';

  // -- Private helpers --

  /**
   * Retrieve a root confirmation token for privileged operations.
   * Creates a temporary CoreUser instance to call passwordConfirm.
   */
  private async getRootToken(): Promise<string> {
    const userApi = new CoreUser(this.client);
    const response = await userApi.passwordConfirm(this.client.config.password);
    if (response.success && response.data) {
      return (response.data as { SynoConfirmPWToken: string }).SynoConfirmPWToken;
    }
    return '';
  }

  // -- Getters --

  /**
   * Retrieve tasks output configuration.
   */
  async getOutputConfig(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'config_get',
      type: 'esynoscheduler',
    });
  }

  /**
   * List all present scheduled tasks and event triggered tasks.
   */
  async getTaskList(
    sortBy = 'next_trigger_time',
    sortDirection: 'ASC' | 'DESC' = 'ASC',
    offset = 0,
    limit = 50,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 3,
      method: 'list',
      sort_by: sortBy,
      sort_direction: sortDirection,
      offset,
      limit,
    });
  }

  /**
   * Retrieve the configuration for a specific task.
   * Pass taskId = -1 and type = 'service' to list all available services.
   */
  async getTaskConfig(
    taskId: number,
    realOwner: string,
    type?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: 4,
      method: 'get',
      id: taskId,
      real_owner: realOwner,
    };

    if (type !== undefined && type !== '') {
      params.type = type;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Retrieve the results list for a specific task.
   */
  async getTaskResults(taskId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'get_history_status_list',
      id: taskId,
    });
  }

  // -- Setters --

  /**
   * Configure the output settings for task results.
   */
  async setOutputConfig(
    enableOutput: boolean,
    outputPath = '',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'config_set',
      type: 'esynoscheduler',
      output_path: outputPath,
      enable_output: enableOutput,
    });
  }

  /**
   * Enable or disable a task.
   */
  async taskSetEnable(
    taskId: number,
    realOwner: string,
    enable: boolean,
  ): Promise<SynoResponse> {
    const taskDict = { id: taskId, real_owner: realOwner, enable };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 2,
      method: 'set_enable',
      status: `[${JSON.stringify(taskDict)}]`,
    });
  }

  // -- Actions --

  /**
   * Run a specific task.
   */
  async taskRun(taskId: number, realOwner: string): Promise<SynoResponse> {
    const taskDict = { id: taskId, real_owner: realOwner };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 2,
      method: 'run',
      tasks: `[${JSON.stringify(taskDict)}]`,
    });
  }

  /**
   * Delete a specific task.
   */
  async taskDelete(taskId: number, realOwner: string): Promise<SynoResponse> {
    const taskDict = { id: taskId, real_owner: realOwner };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 2,
      method: 'delete',
      tasks: `[${JSON.stringify(taskDict)}]`,
    });
  }

  // -- Script tasks --

  /**
   * Create a new script task with the provided schedule and notification settings.
   * If the task needs root privileges, set owner to 'root'.
   */
  async createScriptTask(
    taskName: string,
    owner: string,
    script: string,
    options?: {
      readonly enable?: boolean;
      readonly notifyEmail?: string;
      readonly notifyOnlyOnError?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const notifyEmail = options?.notifyEmail ?? '';
    const notifyOnlyOnError = options?.notifyOnlyOnError ?? false;

    const scheduleDict = buildScheduleDict(options ?? {});

    const extra = {
      notify_enable: notifyEmail !== '',
      notify_mail: notifyEmail,
      notify_if_error: notifyOnlyOnError,
      script,
    };

    let apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: 4,
      method: 'create',
      name: taskName,
      real_owner: owner,
      owner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
      type: 'script',
    };

    if (owner === 'root') {
      apiName = 'SYNO.Core.TaskScheduler.Root';
      params.SynoConfirmPWToken = await this.getRootToken();
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * Modify settings of an existing script task.
   * Warning: this overwrites all settings. Fetch current config first if needed.
   */
  async modifyScriptTask(
    taskId: number,
    taskName: string,
    owner: string,
    realOwner: string,
    script: string,
    options?: {
      readonly enable?: boolean;
      readonly notifyEmail?: string;
      readonly notifyOnlyOnError?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const notifyEmail = options?.notifyEmail ?? '';
    const notifyOnlyOnError = options?.notifyOnlyOnError ?? false;

    const scheduleDict = buildScheduleDict(options ?? {});

    const extra = {
      notify_enable: notifyEmail !== '',
      notify_mail: notifyEmail,
      notify_if_error: notifyOnlyOnError,
      script,
    };

    let apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: 4,
      method: 'set',
      id: taskId,
      name: taskName,
      real_owner: realOwner,
      owner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
    };

    if (owner === 'root') {
      apiName = 'SYNO.Core.TaskScheduler.Root';
      params.SynoConfirmPWToken = await this.getRootToken();
    }

    return this.request(apiName, info.path, params);
  }

  // -- Beep control tasks --

  /**
   * Create a new beep control task with the provided schedule and beep duration.
   */
  async createBeepControlTask(
    taskName: string,
    owner: string,
    options?: {
      readonly enable?: boolean;
      readonly beepDuration?: number;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const beepDuration = options?.beepDuration ?? 60;

    const scheduleDict = buildScheduleDict(options ?? {});

    const extra = {
      beep_duration: String(beepDuration),
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'create',
      name: taskName,
      real_owner: owner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
      type: 'beep',
    });
  }

  /**
   * Modify settings of an existing beep control task.
   * Warning: this overwrites all settings. Fetch current config first if needed.
   */
  async modifyBeepControlTask(
    taskId: number,
    taskName: string,
    realOwner: string,
    options?: {
      readonly enable?: boolean;
      readonly beepDuration?: number;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const beepDuration = options?.beepDuration ?? 60;

    const scheduleDict = buildScheduleDict(options ?? {});

    const extra = {
      beep_duration: String(beepDuration),
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'set',
      id: taskId,
      name: taskName,
      real_owner: realOwner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
    });
  }

  // -- Service control tasks --

  /**
   * Create a new service control task with the provided schedule and services to start/stop.
   * To get available services, call getTaskConfig(-1, username, 'service').
   */
  async createServiceControlTask(
    taskName: string,
    owner: string,
    services: readonly ServiceEntry[],
    action: 'start' | 'stop',
    options?: {
      readonly enable?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;

    const scheduleDict = buildScheduleDict(options ?? {});

    const serviceList = services.map((svc) => ({
      enable: true,
      id: svc.id,
      type: svc.type,
    }));

    const extra = {
      services: serviceList,
      action,
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'create',
      name: taskName,
      real_owner: owner,
      owner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
      type: 'service',
    });
  }

  /**
   * Modify settings of an existing service control task.
   * Warning: this overwrites all settings. Fetch current config first if needed.
   */
  async modifyServiceControlTask(
    taskId: number,
    taskName: string,
    realOwner: string,
    services: readonly ServiceEntry[],
    action: 'start' | 'stop',
    options?: {
      readonly enable?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;

    const scheduleDict = buildScheduleDict(options ?? {});

    const serviceList = services.map((svc) => ({
      enable: true,
      id: svc.id,
      type: svc.type,
    }));

    const extra = {
      services: serviceList,
      action,
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'set',
      id: taskId,
      name: taskName,
      real_owner: realOwner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
    });
  }

  // -- Recycle bin tasks --

  /**
   * Create a new recycle bin control task with the provided schedule and policy.
   */
  async createRecycleBinTask(
    taskName: string,
    owner: string,
    cleanAllShares: boolean,
    policy: CleanFilePolicy,
    options?: {
      readonly shares?: string[];
      readonly enable?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const shares = options?.shares ?? [];

    const scheduleDict = buildScheduleDict(options ?? {});

    const cleanSharePolicy: Record<string, unknown> = {
      clean_all: cleanAllShares,
    };

    if (!cleanAllShares) {
      cleanSharePolicy.shares = shares;
    }

    const extra = {
      clean_share_policy: cleanSharePolicy,
      clean_file_policy: policy,
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'create',
      name: taskName,
      real_owner: owner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
      type: 'recycle',
    });
  }

  /**
   * Modify settings of an existing recycle bin control task.
   * Warning: this overwrites all settings. Fetch current config first if needed.
   */
  async modifyRecycleBinTask(
    taskId: number,
    taskName: string,
    realOwner: string,
    cleanAllShares: boolean,
    policy: CleanFilePolicy,
    options?: {
      readonly shares?: string[];
      readonly enable?: boolean;
    } & ScheduleOptions,
  ): Promise<SynoResponse> {
    const enable = options?.enable ?? true;
    const shares = options?.shares ?? [];

    const scheduleDict = buildScheduleDict(options ?? {});

    const cleanSharePolicy: Record<string, unknown> = {
      clean_all: cleanAllShares,
    };

    if (!cleanAllShares) {
      cleanSharePolicy.shares = shares;
    }

    const extra = {
      clean_share_policy: cleanSharePolicy,
      clean_file_policy: policy,
    };

    const apiName = 'SYNO.Core.TaskScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 4,
      method: 'set',
      id: taskId,
      name: taskName,
      real_owner: realOwner,
      enable,
      schedule: JSON.stringify(scheduleDict),
      extra: JSON.stringify(extra),
    });
  }
}
