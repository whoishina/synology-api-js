/**
 * Synology NoteStation API module.
 * Ported from Python synology_api/notestation.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class NoteStation extends BaseModule {
  protected readonly application = 'NoteStation';

  async getSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async listNotebooks(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Notebook';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async listTags(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Tag';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async listShortcuts(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Shortcut';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async listTodos(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Todo';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async listSmartNotes(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Smart';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async listNotes(): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Note';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getNote(noteId: string | number): Promise<SynoResponse> {
    const apiName = 'SYNO.NoteStation.Note';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      object_id: noteId,
    });
  }
}
