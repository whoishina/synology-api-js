/**
 * Synology Event Scheduler API module.
 * Ported from Python synology_api/event_scheduler.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

interface PowerTask {
  enabled: boolean;
  hour: number;
  min: number;
  weekdays: string;
}

export class EventScheduler extends BaseModule {
  protected readonly application = 'Core';

  async getTaskResults(taskName: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'result_list',
      task_name: taskName,
    });
  }

  async getResultOutput(taskName: string, resultId: number): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'result_get_file',
      task_name: taskName,
      result_id: resultId,
    });
  }

  async taskSetEnable(taskName: string, enable: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'set_enable',
      enable,
      task_name: taskName,
    });
  }

  async taskRun(taskName: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'run',
      task_name: taskName,
    });
  }

  async taskDelete(taskName: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.EventScheduler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: 1,
      method: 'delete',
      task_name: taskName,
    });
  }

  async taskCreateOrSet(options: {
    action: 'create' | 'set';
    taskName: string;
    owner: Record<string, string>;
    triggerEvent: 'shutdown' | 'bootup';
    script: string;
    dependOnTask?: string[];
    enable?: boolean;
    notifyEmail?: string;
    notifyOnlyOnError?: boolean;
  }): Promise<SynoResponse> {
    const preTasks = (options.dependOnTask ?? [])
      .map((task) => `[${task}]`)
      .join('');

    const notifyEmail = options.notifyEmail ?? '';
    const isRoot = options.owner['0'] === 'root';

    const apiName = isRoot
      ? 'SYNO.Core.EventScheduler.Root'
      : 'SYNO.Core.EventScheduler';

    const info = this.getApiInfo('SYNO.Core.EventScheduler');
    if (!info) throw new Error('API SYNO.Core.EventScheduler not found');

    const params: Record<string, unknown> = {
      version: 1,
      method: options.action,
      task_name: options.taskName,
      owner: JSON.stringify(options.owner),
      event: options.triggerEvent,
      depend_on_task: preTasks,
      enable: options.enable ?? true,
      notify_enable: notifyEmail !== '',
      notify_mail: `"${notifyEmail}"`,
      notify_if_error: options.notifyOnlyOnError ?? false,
      operation: options.script,
      operation_type: 'script',
    };

    return this.request(apiName, info.path, params);
  }

  async setPowerSchedule(
    poweronTasks: PowerTask[] = [],
    poweroffTasks: PowerTask[] = [],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.PowerSchedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'save',
      poweron_tasks: JSON.stringify(poweronTasks),
      poweroff_tasks: JSON.stringify(poweroffTasks),
    });
  }

  async loadPowerSchedule(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.PowerSchedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
    });
  }
}
