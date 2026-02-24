/**
 * Synology AudioStation API module.
 * Ported from Python synology_api/audiostation.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class AudioStation extends BaseModule {
  protected readonly application = 'AudioStation';

  async getInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
    });
  }

  async getPlaylistInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.Playlist';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      library: 'all',
      limit: '100000',
      version: info.maxVersion,
    });
  }

  async listRemotePlayers(): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      type: 'all',
      additional: 'subplayer_list',
      version: info.maxVersion,
    });
  }

  async listPinnedSongs(): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.Pin';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'list',
      version: info.maxVersion,
    });
  }

  async getDevicePlaylist(deviceId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'getplaylist',
      id: deviceId,
      version: info.maxVersion,
    });
  }

  async remotePlay(deviceId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'control',
      id: deviceId,
      version: info.maxVersion,
      action: 'play',
    });
  }

  async remoteStop(deviceId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'control',
      id: deviceId,
      version: info.maxVersion,
      action: 'stop',
    });
  }

  async remoteNext(deviceId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'control',
      id: deviceId,
      version: info.maxVersion,
      action: 'next',
    });
  }

  async remotePrev(deviceId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.AudioStation.RemotePlayer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      method: 'control',
      id: deviceId,
      version: info.maxVersion,
      action: 'prev',
    });
  }
}
