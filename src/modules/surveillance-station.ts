/**
 * Synology Surveillance Station API module.
 * Ported from Python synology_api/surveillancestation.py (PART 1: lines 1-3852)
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

/**
 * Helper: build request params from an object, skipping undefined values.
 */
function buildParams(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const params = { ...base };
  for (const [key, val] of Object.entries(extra)) {
    if (val !== undefined) {
      params[key] = val;
    }
  }
  return params;
}

export class SurveillanceStation extends BaseModule {
  protected readonly application = 'SurveillanceStation';

  // ─── Info ────────────────────────────────────────────────────────────

  /**
   * Retrieve information about the Surveillance Station.
   */
  async surveillanceStationInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetInfo',
    });
  }

  // ─── Camera ──────────────────────────────────────────────────────────

  /**
   * Save or update camera configuration.
   */
  async cameraSave(params?: {
    id?: string;
    name?: string;
    dsld?: number;
    newName?: string;
    ip?: string;
    port?: number;
    vendor?: string;
    model?: string;
    userName?: string;
    password?: string;
    videoCodec?: number;
    audioCodec?: number;
    tvStandard?: number;
    channel?: string;
    userDefinePath?: string;
    fov?: string;
    streamXX?: unknown;
    recordTime?: number;
    preRecordTime?: number;
    postRecordTime?: number;
    enableRecordingKeepDays?: boolean;
    recordingKeepDays?: number;
    enableRecordingKeepSize?: boolean;
    recordingKeepSize?: number;
    enableLowProfile?: boolean;
    recordSchedule?: number[];
    rtspPathTimeout?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      params ?? {},
    ));
  }

  /**
   * Retrieve a list of cameras from Surveillance Station.
   */
  async cameraList(params?: {
    idList?: string;
    offset?: number;
    limit?: number;
    blFromCamList?: boolean;
    blIncludeDeletedCam?: boolean;
    privCamType?: string;
    basic?: boolean;
    streamInfo?: boolean;
    blPrivilege?: boolean;
    camStm?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'List' },
      params ?? {},
    ));
  }

  /**
   * Return information about a camera.
   */
  async getCameraInfo(params?: {
    cameraIds?: number;
    privCamType?: number;
    blIncludeDeletedCam?: boolean;
    basic?: boolean;
    streamInfo?: boolean;
    optimize?: boolean;
    ptz?: boolean;
    eventDetection?: boolean;
    deviceOutCap?: boolean;
    fisheye?: boolean;
    camAppInfo?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const defaults = {
      privCamType: 1,
      blIncludeDeletedCam: true,
      basic: true,
      streamInfo: true,
      optimize: true,
      ptz: true,
      eventDetection: true,
      deviceOutCap: true,
      fisheye: true,
      camAppInfo: true,
    };

    return this.request(apiName, info.path, buildParams(
      { version: info.minVersion, method: 'GetInfo' },
      { ...defaults, ...(params ?? {}) },
    ));
  }

  /**
   * Retrieve a list of camera groups from Surveillance Station.
   */
  async cameraListGroup(params?: {
    offset?: number;
    limit?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ListGroup' },
      params ?? {},
    ));
  }

  /**
   * Retrieve a snapshot image from a camera.
   * Returns binary data (not JSON).
   */
  async getSnapshot(params?: {
    id?: string | number;
    name?: string;
    dsld?: number;
    profileType?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const defaults = { profileType: 1 };

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetSnapshot' },
      { ...defaults, ...(params ?? {}) },
    ), { rawResponse: true });
  }

  /**
   * Enable one or more cameras by their IDs.
   */
  async enableCamera(params?: {
    idList?: string;
    blIncludeDeletedCam?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const defaults = { blIncludeDeletedCam: false };

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Enable' },
      { ...defaults, ...(params ?? {}) },
    ));
  }

  /**
   * Disable one or more cameras by their IDs.
   */
  async disableCamera(params?: {
    idList?: string;
    blIncludeDeletedCam?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const defaults = { blIncludeDeletedCam: false };

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Disable' },
      { ...defaults, ...(params ?? {}) },
    ));
  }

  /**
   * Retrieve the capability information for a specific camera by its ID.
   * NOTE: marked as not working in original Python source.
   */
  async getCapabilityByCamId(cameraId?: string | number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetCapabilityByCamId' },
      { cameraId },
    ));
  }

  /**
   * Retrieve the occupied storage size for a specific camera.
   * NOTE: marked as not working in original Python source.
   */
  async countOccupiedSize(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetOccupiedSize' },
      { camId },
    ));
  }

  /**
   * Check if a camera shortcut is valid.
   * NOTE: marked as not working in original Python source.
   */
  async isShortcutValid(cameraId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CheckCamValid' },
      { cameraId },
    ));
  }

  /**
   * Retrieve the live view path for one or more cameras.
   */
  async getLivePath(idList?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetLiveViewPath' },
      { idList },
    ));
  }

  // ─── Camera.Event ────────────────────────────────────────────────────

  /**
   * Enumerate audio events for a specific camera.
   */
  async audioEventEnum(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AudioEnum' },
      { camId },
    ));
  }

  /**
   * Enumerate alarm events for a specific camera.
   * NOTE: marked as not working in original Python source.
   */
  async alarmEventEnum(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AlarmEnum' },
      { camId },
    ));
  }

  /**
   * Save motion detection parameters for a specific camera.
   */
  async mdParameterSave(params?: {
    camId?: number;
    source?: number;
    mode?: number;
    sensitivity?: number;
    threshold?: number;
    objectSize?: number;
    percentage?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'MDParamSave' },
      params ?? {},
    ));
  }

  /**
   * Enumerate motion events for a specific camera.
   */
  async motionEventEnum(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'MotionEnum' },
      { camId },
    ));
  }

  /**
   * Save advanced motion detection parameters for a specific camera.
   */
  async motionParameterSave(params?: {
    camId?: number;
    source?: number;
    mode?: number;
    keep?: boolean;
    level?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ADParamSave' },
      params ?? {},
    ));
  }

  /**
   * Save digital input (DI) parameters for a specific camera.
   */
  async diParameterSave(params?: {
    camId?: number;
    idx?: number;
    keep?: boolean;
    normal?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'DIParamSave' },
      params ?? {},
    ));
  }

  /**
   * Poll the alarm status for a specific camera.
   */
  async alarmStsPolling(params?: {
    camId?: number;
    timeOut?: number;
    keep?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AlarmStsPolling' },
      params ?? {},
    ));
  }

  /**
   * Save tamper detection (TD) parameters for a specific camera.
   */
  async tdParameterSave(params?: {
    camId?: number;
    source?: number;
    keep?: unknown;
    duration?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Event';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'TDParamSave' },
      params ?? {},
    ));
  }

  // ─── Camera.Group ────────────────────────────────────────────────────

  /**
   * Enumerate camera groups in Surveillance Station.
   */
  async enumerateCameraGroup(privCamType?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Enum' },
      { privCamType },
    ));
  }

  /**
   * Save or update a specific camera group in Surveillance Station.
   * NOTE: marked as to-check in original Python source.
   */
  async saveSpecificGroup(groupList?: unknown): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      { groupList },
    ));
  }

  /**
   * Delete specific camera groups in Surveillance Station.
   */
  async deleteSpecificGroups(id?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Delete' },
      { id },
    ));
  }

  // ─── Camera.Import ───────────────────────────────────────────────────

  /**
   * Enumerate group information for camera import in Surveillance Station.
   */
  async enumerateGroupInformation(params?: {
    camServerId?: number;
    shareName?: string;
    archiveName?: string;
    camlist?: unknown;
    actFromHost?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Import';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      params ?? {},
    ));
  }

  /**
   * Enumerate cameras from a specified archive in Surveillance Station.
   */
  async enumerateCameraFromArchive(params?: {
    shareName?: string;
    archiveName?: string;
    serverId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Import';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ArchiveCamEnum' },
      params ?? {},
    ));
  }

  /**
   * Enumerate archives from a specified folder in Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async enumerateArchiveFromFolder(shareName?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Import';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ArchiveEnum' },
      { shareName },
    ));
  }

  // ─── Camera.Wizard ───────────────────────────────────────────────────

  /**
   * Check the available size of the SD card for a specific camera.
   */
  async checkAvailableSizeOfSdcard(params?: {
    camId?: string | number;
    host?: string;
    port?: string;
    user?: string;
    passw?: string;
    vendor?: string;
    model?: string;
    ch?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Wizard';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const extra: Record<string, unknown> = {};
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined) {
          // Python source maps 'passw' → 'pass'
          extra[key === 'passw' ? 'pass' : key] = val;
        }
      }
    }

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ArchiveEnum' },
      extra,
    ));
  }

  /**
   * Check the license quota for Surveillance Station cameras.
   * NOTE: marked as not working in original Python source.
   */
  async checkLicenceQuota(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Wizard';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'CheckQuota',
    });
  }

  /**
   * Format the SD card of a specific camera.
   */
  async formatSpecificSdCard(params?: {
    camId?: string | number;
    host?: string;
    port?: string;
    user?: string;
    passw?: string;
    vendor?: string;
    model?: string;
    ch?: string;
    timeout?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Wizard';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const extra: Record<string, unknown> = {};
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined) {
          // Python source maps 'passw' → 'pass'
          extra[key === 'passw' ? 'pass' : key] = val;
        }
      }
    }

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'FormatSDCard' },
      extra,
    ));
  }

  /**
   * Quickly create a single camera in Surveillance Station.
   */
  async quickCreateSingleCamera(params?: {
    camServerId?: string | number;
    actFromHost?: boolean;
    camStreamingType?: string;
    camName?: string;
    camIP?: string;
    camPort?: string;
    camVendor?: string;
    camModel?: string;
    camMountType?: number;
    camChannel?: string;
    camVideoType?: string;
    camAudioType?: string;
    camSourcePath?: string;
    camUserName?: string;
    camPassWord?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Wizard';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'QuickCreate' },
      params ?? {},
    ));
  }

  // ─── PTZ ─────────────────────────────────────────────────────────────

  /**
   * Move the camera lens in a specified direction with an optional speed.
   */
  async moveCameraLens(params?: {
    cameraId?: string | number;
    direction?: string;
    speed?: number;
    moveType?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Move' },
      params ?? {},
    ));
  }

  /**
   * Control the zoom function of a camera lens.
   */
  async cameraLensZoom(params?: {
    cameraId?: string | number;
    control?: unknown;
    moveType?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Zoom' },
      params ?? {},
    ));
  }

  /**
   * List preset positions for a PTZ camera.
   */
  async listPresetPtzCamera(params?: {
    cameraId?: string | number;
    offset?: number;
    limit?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'List' },
      params ?? {},
    ));
  }

  /**
   * Move the camera lens to a specified preset position.
   */
  async moveCameraLensToPresetPosition(params?: {
    cameraId?: string | number;
    presetId?: string | number;
    position?: unknown;
    speed?: unknown;
    type?: unknown;
    isPatrol?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GoPreset' },
      params ?? {},
    ));
  }

  /**
   * List patrols for a PTZ camera.
   */
  async listPatrolCameras(params?: {
    cameraId?: string | number;
    offset?: number;
    limit?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ListPatrol' },
      params ?? {},
    ));
  }

  /**
   * Force a camera to execute a specified patrol.
   */
  async forceCamToExecutePatrol(params?: {
    cameraId?: string | number;
    patrolId?: string | number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'RunPatrol' },
      params ?? {},
    ));
  }

  /**
   * Control the focus function of a camera.
   */
  async focusCamera(params?: {
    cameraId?: string | number;
    control?: unknown;
    moveType?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Focus' },
      params ?? {},
    ));
  }

  /**
   * Control the iris (in/out) function of a camera.
   */
  async controlCameraIrisInOut(params?: {
    cameraId?: string | number;
    control?: unknown;
    moveType?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Iris' },
      params ?? {},
    ));
  }

  /**
   * Perform an auto-focus operation on a specified camera.
   * NOTE: marked as not working in original Python source.
   */
  async autoFocus(cameraId?: string | number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AutoFocus' },
      { cameraId },
    ));
  }

  /**
   * Move the camera lens to an absolute position.
   */
  async moveCamLensToAbsolutePosition(params?: {
    posX?: number;
    posY?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AbsPtz' },
      params ?? {},
    ));
  }

  /**
   * Move the camera to its home position.
   * NOTE: marked as not working in original Python source.
   */
  async moveCamToHomePosition(cameraId?: string | number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Home' },
      { cameraId },
    ));
  }

  /**
   * Automatically pan the camera.
   */
  async autoPanCamera(params?: {
    cameraId?: string | number;
    moveType?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'AutoPan' },
      params ?? {},
    ));
  }

  /**
   * Start or stop object tracking for a specified camera.
   */
  async startStopObjectTracking(params?: {
    cameraId?: string | number;
    moveType?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ObjTracking' },
      params ?? {},
    ));
  }

  // ─── ExternalRecording ───────────────────────────────────────────────

  /**
   * Start or stop external recording for a specified camera.
   */
  async startStopExternalRecording(params?: {
    cameraId?: string | number;
    action?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ExternalRecording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Record' },
      params ?? {},
    ));
  }

  // ─── Recording ───────────────────────────────────────────────────────

  /**
   * Query the event list by applying various filters.
   */
  async queryEventListByFilter(params?: {
    offset?: number;
    limit?: number;
    cameraIds?: string;
    fromTime?: number;
    toTime?: number;
    dsld?: number;
    mountId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'List' },
      params ?? {},
    ));
  }

  /**
   * Delete specific recordings from Surveillance Station.
   */
  async deleteRecordings(params?: {
    idList?: number;
    dsld?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Delete' },
      params ?? {},
    ));
  }

  /**
   * Delete events from Surveillance Station by applying various filters.
   */
  async deleteEventsByFilter(params?: {
    reason?: string;
    cameraIds?: string;
    fromTime?: number | string;
    toTime?: number | string;
    locked?: number;
    evtSrcType?: number;
    evtSrcId?: number;
    blIncludeSnapshot?: boolean;
    includeAllCam?: boolean;
    from_end?: number;
    from_start?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'DeleteFilter' },
      params ?? {},
    ));
  }

  /**
   * Delete all recordings from Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async deleteAllRecordings(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'DeleteAll',
    });
  }

  /**
   * Apply advanced settings in the Surveillance Station recording tab.
   * NOTE: marked as not working in original Python source.
   */
  async applySettingsAdvanceTab(rotateUnrecogCam?: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ApplyAdvanced' },
      { rotateUnrecogCam },
    ));
  }

  /**
   * Count the number of events by category, with optional filters.
   */
  async countByNumberOfEvent(params?: {
    offset?: boolean;
    limit?: number;
    reason?: string;
    cameraIds?: string;
    fromTime?: number;
    toTime?: number;
    locked?: number;
    evtSrcType?: number;
    evtSrcId?: number;
    blIncludeSnapshot?: boolean;
    includeAllCam?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CountByCategory' },
      params ?? {},
    ));
  }

  /**
   * Keep the event play session alive.
   * NOTE: marked as not working in original Python source.
   */
  async keepEventPlayAlive(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Keepalive',
    });
  }

  /**
   * Stop a recording event for the specified event IDs.
   * NOTE: marked as not working in original Python source.
   */
  async stopRecordingEvent(idList?: unknown): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Trunc' },
      { idList },
    ));
  }

  /**
   * Load settings from the advanced tab in Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async loadSettingsInAdvancedTab(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'LoadAdvanced',
    });
  }

  /**
   * Lock selected events by applying various filters.
   */
  async lockSelectedEvent(params?: {
    reason?: string;
    cameraIds?: string;
    fromTime?: number;
    toTime?: number;
    locked?: number;
    evtSrcType?: number;
    evtSrcId?: number;
    blIncludeSnapshot?: boolean;
    includeAllCam?: boolean;
    from_end?: number;
    from_start?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'LockFilter' },
      params ?? {},
    ));
  }

  /**
   * Unlock selected events by their IDs.
   */
  async unlockSelectedEvent(params?: {
    idList?: string;
    dsld?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Unlock' },
      params ?? {},
    ));
  }

  /**
   * Unlock events by applying various filters.
   */
  async unlockSelectedFilterEvent(params?: {
    reason?: string;
    cameraIds?: string;
    fromTime?: number;
    toTime?: number;
    locked?: number;
    evtSrcType?: number;
    evtSrcId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'UnlockFilter' },
      params ?? {},
    ));
  }

  /**
   * Lock selected recordings by their IDs.
   */
  async lockSelectedRecordings(params?: {
    idList?: string;
    dsld?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Lock' },
      params ?? {},
    ));
  }

  /**
   * Download recordings by specifying recording ID and optional parameters.
   * Returns raw binary response.
   */
  async downloadRecordings(params?: {
    id?: number;
    mountId?: number;
    offsetTimeMs?: number;
    playTimeMs?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Download' },
      params ?? {},
    ), { rawResponse: true });
  }

  /**
   * Check if a recording is playable by event ID and optional parameters.
   */
  async checkIfRecordingPlayable(params?: {
    eventId?: number;
    chkDetail?: boolean;
    mountId?: number;
    dsld?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CheckEventValid' },
      params ?? {},
    ));
  }

  /**
   * Stream a specific recording from Surveillance Station.
   */
  async playSpecificRecording(params?: {
    recordingId?: number;
    alertRecording?: boolean;
    mountId?: number;
    dsld?: number;
    videoCodec?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Stream' },
      params ?? {},
    ));
  }

  /**
   * Download merged files of recordings within a UTC time range for a target camera.
   * Starts a task with a keep-alive mechanism.
   */
  async downloadMergedRecordingFiles(params?: {
    camId?: number;
    fromTime?: number;
    toTime?: number;
    fileName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'RangeExport' },
      params ?? {},
    ));
  }

  /**
   * Get the latest progress of a range export task and keep the task alive.
   * NOTE: marked as not working in original Python source.
   */
  async getNewestProgressKeepAlive(dlid?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetRangeExportProgress' },
      { dlid },
    ));
  }

  /**
   * Download the exported recording file from a completed range export task.
   */
  async downloadRecordingFromTarget(params?: {
    dlid?: number;
    fileName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'OnRangeExportDone' },
      params ?? {},
    ));
  }

  // ─── Recording.Export ────────────────────────────────────────────────

  /**
   * Load exported event recordings with optional pagination.
   */
  async handleLoadEventExport(params?: {
    start?: number;
    limit?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Load' },
      params ?? {},
    ));
  }

  /**
   * Check if an export event name is valid or already exists.
   */
  async checkNameExportEvent(params?: {
    dsId?: number;
    name?: number;
    share?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CheckName' },
      params ?? {},
    ));
  }

  /**
   * Retrieve the list of camera information for event export.
   */
  async getCameraInformationList(dslld?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CamEnum' },
      { dslld },
    ));
  }

  /**
   * Check if the destination folder has enough available space for export.
   */
  async checkDestinationFolderAvailability(params?: {
    freeSize?: number;
    startTime?: number;
    stopTime?: number;
    camIdList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CheckAvailableExport' },
      params ?? {},
    ));
  }

  /**
   * Save an event export task with the specified parameters.
   */
  async handleSaveEventExport(params?: {
    name?: string;
    srcDsId?: number;
    dstDsId?: number;
    dstdir?: string;
    freesize?: number;
    start_time?: number;
    stop_time?: number;
    isoverwrite?: number;
    camlistid?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      params ?? {},
    ));
  }

  /**
   * Retrieve event export information from the recording server.
   */
  async getEventExportInfoFromRecordingServer(params?: {
    start_time?: number;
    stop_time?: number;
    camlistid?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Export';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetEvtExpInfo' },
      params ?? {},
    ));
  }

  // ─── Recording.Mount ─────────────────────────────────────────────────

  /**
   * Load event mount information for export.
   */
  async loadEventMount(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Mount';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Load',
    });
  }

  // ─── CMS ─────────────────────────────────────────────────────────────

  /**
   * Redirect a WebAPI request to a target DiskStation.
   */
  async redirectWebapiToTargetDs(params?: {
    dsId?: number;
    webAPI?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Redirect' },
      params ?? {},
    ));
  }

  /**
   * Modify the share privilege settings in Surveillance Station CMS.
   */
  async modifySharePrivilege(params?: {
    privSet?: number;
    shareName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Load' },
      params ?? {},
    ));
  }

  /**
   * Apply option settings for Surveillance Station CMS.
   */
  async applyOptionSettings(params?: {
    central_auto_video_relay?: boolean;
    central_enable?: boolean;
    central_mode?: string;
    central_rec_mask_mode?: boolean;
    central_rec_sync_time?: boolean;
    nvr_enable?: boolean;
    nvr_lang?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'ApplyOption' },
      params ?? {},
    ));
  }

  /**
   * Retrieve CMS (Central Management System) information.
   * NOTE: marked as not working in original Python source.
   */
  async getCmsInfo(isPolling?: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetInfo' },
      { isPolling },
    ));
  }

  /**
   * Retrieve log recording data from a target DiskStation.
   */
  async getLogRecordingDataFromTargetDs(params?: {
    syncType?: number;
    syncTargetId?: number;
    limit?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'DoSyncData' },
      params ?? {},
    ));
  }

  /**
   * Check if the Samba service is enabled on the CMS.
   * NOTE: marked as not working in original Python source.
   */
  async getSambaService(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'CheckSambaEnabled',
    });
  }

  /**
   * Check if Samba is enabled and recording is enabled on the CMS.
   * NOTE: marked as not working in original Python source.
   */
  async checkIfSambaOnAndRecEnabled(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'BatCheckSambaService',
    });
  }

  /**
   * Retrieve an encoded single image (snapshot) from a specified camera.
   */
  async getEncodedSingleImageOfCamera(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetMDSnapshot' },
      { camId },
    ));
  }

  /**
   * Retrieve the status of the CMS.
   * NOTE: marked as not working in original Python source.
   */
  async getCmsStatus(camId?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'GetCMSStatus' },
      { camId },
    ));
  }

  /**
   * Enable the Samba service on the CMS.
   * NOTE: marked as not working in original Python source.
   */
  async enableSmbService(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'EnableSamba',
    });
  }

  /**
   * Notify a slave DiskStation to disconnect from the CMS.
   * NOTE: marked as not working in original Python source.
   */
  async notifySlaveDsToDisconnect(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'NotifyCMSBreak',
    });
  }

  /**
   * Lock the recording server to prevent setting changes.
   * NOTE: marked as not working in original Python source.
   */
  async lockRecordingServerPreventSettingChange(locked?: boolean): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'LockSelf' },
      { locked },
    ));
  }

  // ─── CMS.GetDsStatus ────────────────────────────────────────────────

  /**
   * Enable a DiskStation as a recording server in the CMS.
   */
  async enableDsIntoRecordingServer(params?: {
    adminUsername?: string;
    adminPasswd?: string;
    central_rec_mask_mode?: string;
    central_rec_sync_time?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'EnableCMS' },
      params ?? {},
    ));
  }

  /**
   * Unpair recording servers from the CMS.
   */
  async unpairRecordingServers(params?: {
    adminUsername?: string;
    key?: string;
    mac?: string;
    cmsMode?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'UnPair' },
      params ?? {},
    ));
  }

  /**
   * Retrieve the free memory size from the target DiskStation.
   */
  async getFreeMemorySize(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetFreeSpace',
    });
  }

  /**
   * Handle slave DiskStation operations such as locking or authentication.
   */
  async handleSlaveDs(params?: {
    lock?: boolean;
    adminUsername?: string;
    key?: string;
    mac?: string;
    masterAuthKey?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Lock' },
      params ?? {},
    ));
  }

  /**
   * Retrieve information about the target slave DiskStation.
   */
  async getTargetDsInfo(slaveDslp?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Test' },
      { slaveDslp },
    ));
  }

  /**
   * Log out a slave DiskStation from the CMS.
   */
  async logoutSlaveDs(params?: {
    adminUsername?: string;
    key?: string;
    mac?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Logout' },
      params ?? {},
    ));
  }

  /**
   * Pair a slave DiskStation with the CMS.
   */
  async pairSlaveDs(params?: {
    dsname?: string;
    slaveDslp?: string;
    port?: number;
    masterAuthKey?: string;
    model?: string;
    mac?: string;
    cms_locked?: boolean;
    cms_masked?: boolean;
    cms_sync_time?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Pair' },
      params ?? {},
    ));
  }

  /**
   * Log in a slave DiskStation to the CMS.
   */
  async loginSlaveDs(params?: {
    adminUsername?: string;
    key?: string;
    mac?: string;
    masterAuthKey?: string;
    hostName?: string;
    hostPort?: number;
    ignoreAuthError?: string;
    hostDisconnect?: boolean;
    blUpdateVolSpace?: boolean;
    enable_rec?: boolean;
    cms_locked?: boolean;
    cms_masked?: boolean;
    cms_sync_time?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Login' },
      params ?? {},
    ));
  }

  /**
   * Save or update a slave DiskStation's configuration in the CMS.
   */
  async saveSlaveDs(params?: {
    slavedsName?: string;
    slavedsModel?: string;
    slavedsPort?: number;
    slavedsVersion?: string;
    slavedsMaxCamNum?: number;
    slavedsId?: string;
    slavedsIP?: string;
    slavedsEnable?: number;
    slavedsCamCnt?: boolean;
    adminUsername?: string;
    adminPasswd?: string;
    cms_locked?: boolean;
    cms_masked?: boolean;
    cms_sync_time?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.GetDsStatus';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      params ?? {},
    ));
  }

  // ─── CMS.SlavedsList ────────────────────────────────────────────────

  /**
   * Load the list of slave DiskStations from the CMS.
   */
  async loadSlaveDsList(params?: {
    blNeedStatus?: boolean;
    blGetSortInfo?: boolean;
    blRuntimeInfo?: boolean;
    dslds?: string;
    sortInfo?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.CMS.SlavedsList';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Load' },
      params ?? {},
    ));
  }

  // ─── Log ─────────────────────────────────────────────────────────────

  /**
   * Count the number of logs in Surveillance Station based on various filters.
   */
  async countNumberOfLogs(params?: {
    slavedsName?: string;
    start?: number;
    limit?: number;
    level?: string;
    filterCamera?: string;
    cameraIds?: string;
    dsfrom?: number;
    to?: number;
    keyword?: string;
    keywordDsId?: string;
    time2String?: string;
    dsId?: string;
    srcType?: number;
    timezoneOffset?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CountByCategory' },
      params ?? {},
    ));
  }

  /**
   * Clear selected logs from Surveillance Station based on various filters.
   * Note: 'dsfrom' is mapped to 'from' in the API request.
   */
  async clearSelectedLogs(params?: {
    blClearAll?: boolean;
    level?: number;
    dsId?: number;
    filterCamera?: string;
    cameraIds?: string;
    dsfrom?: number;
    to?: number;
    keyword?: string;
    keywordDsId?: string;
    srcType?: number;
    timezoneOffset?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const extra: Record<string, unknown> = {};
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined) {
          // Python source maps 'dsfrom' → 'from'
          extra[key === 'dsfrom' ? 'from' : key] = val;
        }
      }
    }

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Clear' },
      extra,
    ));
  }

  /**
   * Retrieve information logs from Surveillance Station based on various filters.
   * Note: 'dsfrom' is mapped to 'from' in the API request.
   */
  async getInformationLog(params?: {
    start?: number;
    limit?: number;
    level?: string;
    filterCamera?: string;
    cameraIds?: string;
    dsfrom?: number;
    to?: number;
    keyword?: string;
    keywordDsId?: string;
    time2String?: string;
    dsId?: number;
    srcType?: number;
    all?: boolean;
    blIncludeRecCnt?: string;
    blIncludeAuInfo?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const extra: Record<string, unknown> = {};
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined) {
          // Python source maps 'dsfrom' → 'from'
          extra[key === 'dsfrom' ? 'from' : key] = val;
        }
      }
    }

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'List' },
      extra,
    ));
  }

  /**
   * Retrieve advanced log settings from Surveillance Station.
   */
  async getAdvancedSettingsLogs(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetSetting',
    });
  }

  /**
   * Set advanced log settings in Surveillance Station.
   * Example data: [{"SSLogType":321912835,"enable":1},{"SSLogType":321912836,"enable":0}]
   */
  async setAdvancedSettingLogs(data?: unknown): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'SetSetting',
      data,
    });
  }

  // ─── License ─────────────────────────────────────────────────────────

  /**
   * Load license data from Surveillance Station.
   */
  async loadLicenseData(numOnly?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.License';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Load',
      num_only: numOnly,
    });
  }

  /**
   * Check the license quota for cameras in Surveillance Station.
   * Example camList: [{"ip": "10.13.22.141", "model": "DCS-3110", "vendor": "DLink", "port": 80}]
   */
  async checkLicenseQuota(params?: {
    camList?: unknown;
    camServerId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.License';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'CheckQuota' },
      params ?? {},
    ));
  }

  // ─── Stream ──────────────────────────────────────────────────────────

  /**
   * Retrieve an HTTP video event stream from Surveillance Station.
   */
  async getHttpVideoStream(params?: {
    writeHeader?: boolean;
    analyevent?: boolean;
    mountId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Stream';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'EventStream' },
      params ?? {},
    ));
  }

  // ─── ActionRule ──────────────────────────────────────────────────────

  /**
   * Save or update an action rule in Surveillance Station.
   */
  async saveActionRule(params?: {
    id?: number;
    name?: string;
    ruleType?: number;
    actType?: number;
    evtSrc?: number;
    evtDsId?: number;
    evtDevId?: number;
    evtId?: number;
    evtItem?: number;
    evtMinIntvl?: number;
    Actions?: unknown;
    actSchedule?: string;
    Id?: number;
    actSrc?: number;
    actDsId?: number;
    actDevId?: number;
    actId?: number;
    actTimes?: number;
    actTimeUnit?: number;
    actTimeDur?: number;
    actItemId?: number;
    actRetPos?: number;
    extUrl?: string;
    userName?: string;
    password?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, buildParams(
      { version: info.maxVersion, method: 'Save' },
      params ?? {},
    ));
  }

  /**
   * Download the history of action rules from Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async downloadActionRule(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'DownloadHistory',
    });
  }

  /**
   * Send data to the Surveillance Station player.
   * NOTE: marked as not working in original Python source.
   */
  async sendData2Player(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'SendData2Player',
    });
  }

  /**
   * Delete all histories of specified action rules.
   * NOTE: marked as not working in original Python source.
   */
  async deleteAllHistoriesOfActionRule(idList?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'DeleteHistory',
      idList,
    });
  }

  /**
   * List action rules in Surveillance Station.
   */
  async listActionRules(start?: string, limit?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'List',
      Start: start,
      limit,
    });
  }

  /**
   * Disable specified action rules in Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async disableActionRules(idList?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Disable',
      idList,
    });
  }

  /**
   * Enable specified action rules in Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async enableActionRules(idList?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Enable',
      idList,
    });
  }

  /**
   * List the history of action rules in Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async listHistoryActionRules(start?: number, limit?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'ListHistory',
      start,
      limit,
    });
  }

  /**
   * Delete specified action rules from Surveillance Station.
   * NOTE: marked as not working in original Python source.
   */
  async deleteActionRule(idList?: string): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ActionRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Delete',
      idList,
    });
  }

// TEMPORARY FILE - Method bodies only (no class declaration, no imports).
// These methods should be merged into the SurveillanceStation class.
// Ported from Python surveillancestation.py lines 3853-7453.

  // ========================
  // Emap
  // ========================

  async getListOfEmaps(params?: {
    start?: number;
    limit?: string;
    emapIds?: number;
    includeItems?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Emap';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'List',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.emapIds !== undefined) reqParams['emapIds'] = params.emapIds;
    if (params?.includeItems !== undefined) reqParams['includeItems'] = params.includeItems;

    return this.request(apiName, info.path, reqParams);
  }

  async getSpecificEmapsSetting(params?: {
    emapIds?: number;
    includeImage?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Emap';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Load',
    };

    if (params?.emapIds !== undefined) reqParams['emapIds'] = params.emapIds;
    if (params?.includeImage !== undefined) reqParams['includeImage'] = params.includeImage;

    return this.request(apiName, info.path, reqParams);
  }

  async getEmapImage(params?: {
    filename?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Emap.Image';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Load',
    };

    if (params?.filename !== undefined) reqParams['filename'] = params.filename;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Notification
  // ========================

  async getAuthorizedDsToken(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetRegisterToken',
    });
  }

  async setMessageEvent(params?: {
    eventTypes?: string;
    subject?: string;
    content?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetCustomizedMessage',
    };

    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.subject !== undefined) reqParams['subject'] = params.subject;
    if (params?.content !== undefined) reqParams['content'] = params.content;

    return this.request(apiName, info.path, reqParams);
  }

  async getMessageEvent(params?: {
    eventTypes?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetCustomizedMessage',
    };

    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;

    return this.request(apiName, info.path, reqParams);
  }

  async setNotificationSenderName(params?: {
    ssPkgName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetVariables',
    };

    if (params?.ssPkgName !== undefined) reqParams['ss_pkg_name'] = params.ssPkgName;

    return this.request(apiName, info.path, reqParams);
  }

  async getNotificationSenderName(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetVariables',
    });
  }

  async setAdvancedNotificationSetting(params?: {
    blSyncDSMNotify?: boolean;
    blCompactMsg?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetAdvSetting',
    };

    if (params?.blSyncDSMNotify !== undefined) reqParams['blSyncDSMNotify'] = params.blSyncDSMNotify;
    if (params?.blCompactMsg !== undefined) reqParams['blCompactMsg'] = params.blCompactMsg;

    return this.request(apiName, info.path, reqParams);
  }

  async getAdvancedNotificationSetting(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetAdvSetting',
    });
  }

  // ========================
  // Notification.SMS
  // ========================

  async sendTestMsgToPrimarySecondaryPhone(params?: {
    smsEnable?: boolean;
    smsMethod?: number;
    smsProvider?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    primaryPhoneCode?: string;
    primaryPhonePrefix?: string;
    secondaryPhoneCode?: string;
    secondaryPhonePrefix?: string;
    secondaryPhoneNumber?: string;
    setMinMessageInterval?: boolean;
    minMessageInterval?: number;
    hasSysSms?: boolean;
    apiId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SendTestMessage',
    };

    if (params?.smsEnable !== undefined) reqParams['smsEnable'] = params.smsEnable;
    if (params?.smsMethod !== undefined) reqParams['smsMethod'] = params.smsMethod;
    if (params?.smsProvider !== undefined) reqParams['smsProvider'] = params.smsProvider;
    if (params?.userName !== undefined) reqParams['userName'] = params.userName;
    if (params?.password !== undefined) reqParams['password'] = params.password;
    if (params?.confirmPassword !== undefined) reqParams['confirmPassword'] = params.confirmPassword;
    if (params?.primaryPhoneCode !== undefined) reqParams['primaryPhoneCode'] = params.primaryPhoneCode;
    if (params?.primaryPhonePrefix !== undefined) reqParams['primaryPhonePrefix'] = params.primaryPhonePrefix;
    if (params?.secondaryPhoneCode !== undefined) reqParams['secondaryPhoneCode'] = params.secondaryPhoneCode;
    if (params?.secondaryPhonePrefix !== undefined) reqParams['secondaryPhonePrefix'] = params.secondaryPhonePrefix;
    if (params?.secondaryPhoneNumber !== undefined) reqParams['secondaryPhoneNumber'] = params.secondaryPhoneNumber;
    if (params?.setMinMessageInterval !== undefined) reqParams['setMinMessageInterval'] = params.setMinMessageInterval;
    if (params?.minMessageInterval !== undefined) reqParams['minMessageInterval'] = params.minMessageInterval;
    if (params?.hasSysSms !== undefined) reqParams['hasSysSms'] = params.hasSysSms;
    if (params?.apiId !== undefined) reqParams['apiId'] = params.apiId;

    return this.request(apiName, info.path, reqParams);
  }

  async getSettingNotificationSms(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetSetting',
    });
  }

  async setSmsServiceSetting(params?: {
    smsEnable?: boolean;
    smsMethod?: number;
    smsProvider?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    primaryPhoneCode?: string;
    primaryPhonePrefix?: string;
    secondaryPhoneCode?: string;
    secondaryPhonePrefix?: string;
    secondaryPhoneNumber?: string;
    setMinMessageInterval?: boolean;
    minMessageInterval?: number;
    hasSysSms?: boolean;
    apiId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetSetting',
    };

    if (params?.smsEnable !== undefined) reqParams['smsEnable'] = params.smsEnable;
    if (params?.smsMethod !== undefined) reqParams['smsMethod'] = params.smsMethod;
    if (params?.smsProvider !== undefined) reqParams['smsProvider'] = params.smsProvider;
    if (params?.userName !== undefined) reqParams['userName'] = params.userName;
    if (params?.password !== undefined) reqParams['password'] = params.password;
    if (params?.confirmPassword !== undefined) reqParams['confirmPassword'] = params.confirmPassword;
    if (params?.primaryPhoneCode !== undefined) reqParams['primaryPhoneCode'] = params.primaryPhoneCode;
    if (params?.primaryPhonePrefix !== undefined) reqParams['primaryPhonePrefix'] = params.primaryPhonePrefix;
    if (params?.secondaryPhoneCode !== undefined) reqParams['secondaryPhoneCode'] = params.secondaryPhoneCode;
    if (params?.secondaryPhonePrefix !== undefined) reqParams['secondaryPhonePrefix'] = params.secondaryPhonePrefix;
    if (params?.secondaryPhoneNumber !== undefined) reqParams['secondaryPhoneNumber'] = params.secondaryPhoneNumber;
    if (params?.setMinMessageInterval !== undefined) reqParams['setMinMessageInterval'] = params.setMinMessageInterval;
    if (params?.minMessageInterval !== undefined) reqParams['minMessageInterval'] = params.minMessageInterval;
    if (params?.hasSysSms !== undefined) reqParams['hasSysSms'] = params.hasSysSms;
    if (params?.apiId !== undefined) reqParams['apiId'] = params.apiId;

    return this.request(apiName, info.path, reqParams);
  }

  async sendTestSms(params?: {
    attachSnapshot?: boolean;
    enableInterval?: boolean;
    mobileEnable?: boolean;
    msgInterval?: string;
    primaryEmail?: string;
    secondaryEmail?: string;
    synoMailEnable?: boolean;
    mailRecipient?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SendTestMessage',
    };

    if (params?.attachSnapshot !== undefined) reqParams['attachSnapshot'] = params.attachSnapshot;
    if (params?.enableInterval !== undefined) reqParams['enableInterval'] = params.enableInterval;
    if (params?.mobileEnable !== undefined) reqParams['mobileEnable'] = params.mobileEnable;
    if (params?.msgInterval !== undefined) reqParams['msgInterval'] = params.msgInterval;
    if (params?.primaryEmail !== undefined) reqParams['primaryEmail'] = params.primaryEmail;
    if (params?.secondaryEmail !== undefined) reqParams['secondaryEmail'] = params.secondaryEmail;
    if (params?.synoMailEnable !== undefined) reqParams['synoMailEnable'] = params.synoMailEnable;
    if (params?.mailRecipient !== undefined) reqParams['mail_recipient'] = params.mailRecipient;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Notification.PushService
  // ========================

  async sendTestMail(params?: {
    attachSnapshot?: boolean;
    enableInterval?: boolean;
    mobileEnable?: boolean;
    msgInterval?: string;
    primaryEmail?: string;
    secondaryEmail?: string;
    synoMailEnable?: boolean;
    mailRecipient?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.PushService';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SendVerificationMail',
    };

    if (params?.attachSnapshot !== undefined) reqParams['attachSnapshot'] = params.attachSnapshot;
    if (params?.enableInterval !== undefined) reqParams['enableInterval'] = params.enableInterval;
    if (params?.mobileEnable !== undefined) reqParams['mobileEnable'] = params.mobileEnable;
    if (params?.msgInterval !== undefined) reqParams['msgInterval'] = params.msgInterval;
    if (params?.primaryEmail !== undefined) reqParams['primaryEmail'] = params.primaryEmail;
    if (params?.secondaryEmail !== undefined) reqParams['secondaryEmail'] = params.secondaryEmail;
    if (params?.synoMailEnable !== undefined) reqParams['synoMailEnable'] = params.synoMailEnable;
    if (params?.mailRecipient !== undefined) reqParams['mail_recipient'] = params.mailRecipient;

    return this.request(apiName, info.path, reqParams);
  }

  async listMobilePairedDevices(params?: {
    attachSnapshot?: boolean;
    enableInterval?: boolean;
    mobileEnable?: boolean;
    msgInterval?: string;
    primaryEmail?: string;
    secondaryEmail?: string;
    synoMailEnable?: boolean;
    mailRecipient?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.PushService';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListMobileDevice',
    };

    if (params?.attachSnapshot !== undefined) reqParams['attachSnapshot'] = params.attachSnapshot;
    if (params?.enableInterval !== undefined) reqParams['enableInterval'] = params.enableInterval;
    if (params?.mobileEnable !== undefined) reqParams['mobileEnable'] = params.mobileEnable;
    if (params?.msgInterval !== undefined) reqParams['msgInterval'] = params.msgInterval;
    if (params?.primaryEmail !== undefined) reqParams['primaryEmail'] = params.primaryEmail;
    if (params?.secondaryEmail !== undefined) reqParams['secondaryEmail'] = params.secondaryEmail;
    if (params?.synoMailEnable !== undefined) reqParams['synoMailEnable'] = params.synoMailEnable;
    if (params?.mailRecipient !== undefined) reqParams['mail_recipient'] = params.mailRecipient;

    return this.request(apiName, info.path, reqParams);
  }

  async unpairDevice(params?: {
    targetIds?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.PushService';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetSetting',
    };

    if (params?.targetIds !== undefined) reqParams['targetIds'] = params.targetIds;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Notification.Schedule
  // ========================

  async getControllerAccessSchedule(params?: {
    targetIds?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetAccessControlControllerSchedule',
    };

    if (params?.targetIds !== undefined) reqParams['targetIds'] = params.targetIds;

    return this.request(apiName, info.path, reqParams);
  }

  async getCameraAlarmSchedule(params?: {
    cameraId?: number;
    alarmdx?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetCameraAlarmSchedule',
    };

    if (params?.cameraId !== undefined) reqParams['cameraId'] = params.cameraId;
    if (params?.alarmdx !== undefined) reqParams['alarmdx'] = params.alarmdx;

    return this.request(apiName, info.path, reqParams);
  }

  async getSysDependentSchedule(params?: {
    eventGroupTypes?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetSystemDependentSchedule',
    };

    if (params?.eventGroupTypes !== undefined) reqParams['eventGroupTypes'] = params.eventGroupTypes;

    return this.request(apiName, info.path, reqParams);
  }

  async setBatchSchedule(params?: {
    eventTypes?: string;
    schedule?: unknown;
    cameraIds?: string;
    cameraGroupIds?: string;
    filter?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetBatchSchedule',
    };

    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.schedule !== undefined) reqParams['schedule'] = params.schedule;
    if (params?.cameraIds !== undefined) reqParams['cameraIds'] = params.cameraIds;
    if (params?.cameraGroupIds !== undefined) reqParams['cameraGroupIds'] = params.cameraGroupIds;
    if (params?.filter !== undefined) reqParams['filter'] = params.filter;

    return this.request(apiName, info.path, reqParams);
  }

  async getAccessCtrlDoorSchedule(params?: {
    doorId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetAccessControlDoorSchedule',
    };

    if (params?.doorId !== undefined) reqParams['doorId'] = params.doorId;

    return this.request(apiName, info.path, reqParams);
  }

  async getCameraSchedule(params?: {
    cameraId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetCameraSchedule',
    };

    if (params?.cameraId !== undefined) reqParams['cameraId'] = params.cameraId;

    return this.request(apiName, info.path, reqParams);
  }

  async setSysDependentSchedule(params?: {
    eventType?: number;
    schedule?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetSystemDependentSchedule',
    };

    if (params?.eventType !== undefined) reqParams['eventType'] = params.eventType;
    if (params?.schedule !== undefined) reqParams['schedule'] = params.schedule;

    return this.request(apiName, info.path, reqParams);
  }

  async setControllerAccessSchedule(params?: {
    eventType?: number;
    schedule?: unknown;
    doorId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetAccessControlSchedule',
    };

    if (params?.eventType !== undefined) reqParams['eventType'] = params.eventType;
    if (params?.schedule !== undefined) reqParams['schedule'] = params.schedule;
    if (params?.doorId !== undefined) reqParams['doorId'] = params.doorId;

    return this.request(apiName, info.path, reqParams);
  }

  async setCameraSchedule(params?: {
    eventType?: number;
    schedule?: unknown;
    cameraId?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetCameraSchedule',
    };

    if (params?.eventType !== undefined) reqParams['eventType'] = params.eventType;
    if (params?.schedule !== undefined) reqParams['schedule'] = params.schedule;
    if (params?.cameraId !== undefined) reqParams['cameraId'] = params.cameraId;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Notification.Email
  // ========================

  async getNotificationEmailString(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Email';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetSetting',
    });
  }

  async setAdvTabInfoFilter(params?: {
    X?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.Email';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Set',
    };

    if (params?.X !== undefined) reqParams['X'] = params.X;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Notification.SMS.ServiceProvider
  // ========================

  async createSmsServiceProvider(params?: {
    providerName?: string;
    providerPort?: number;
    providerUrl?: string;
    providerTemplate?: string;
    providerSepChar?: string;
    providerNeedSSL?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS.ServiceProvider';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Create',
    };

    if (params?.providerName !== undefined) reqParams['providerName'] = params.providerName;
    if (params?.providerPort !== undefined) reqParams['providerPort'] = params.providerPort;
    if (params?.providerUrl !== undefined) reqParams['providerUrl'] = params.providerUrl;
    if (params?.providerTemplate !== undefined) reqParams['providerTemplate'] = params.providerTemplate;
    if (params?.providerSepChar !== undefined) reqParams['providerSepChar'] = params.providerSepChar;
    if (params?.providerNeedSSL !== undefined) reqParams['providerNeedSSL'] = params.providerNeedSSL;

    return this.request(apiName, info.path, reqParams);
  }

  async listSmsProvider(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS.ServiceProvider';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'List',
    });
  }

  async deleteSmsServiceProvider(params?: {
    providerName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Notification.SMS.ServiceProvider';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (params?.providerName !== undefined) reqParams['providerName'] = params.providerName;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // AddOns
  // ========================

  async getAddonToUpdate(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetUpdateInfo',
    });
  }

  async enableSpecificAddon(params?: {
    service?: number;
    servicename?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enable',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;
    if (params?.servicename !== undefined) reqParams['servicename'] = params.servicename;

    return this.request(apiName, info.path, reqParams);
  }

  async getSpecificAddonUpdateInfo(params?: {
    service?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CheckUpdateInfo',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;

    return this.request(apiName, info.path, reqParams);
  }

  async getSpecificAddonInfo(params?: {
    service?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetInfo',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;

    return this.request(apiName, info.path, reqParams);
  }

  async getTotalAddonInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'List',
    });
  }

  async updateAddonPackage(params?: {
    service?: number;
    filePath?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Update',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;
    if (params?.filePath !== undefined) reqParams['filePath'] = params.filePath;

    return this.request(apiName, info.path, reqParams);
  }

  async checkAddonStatus(params?: {
    service?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CheckEnableDone',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;

    return this.request(apiName, info.path, reqParams);
  }

  async disableAddon(params?: {
    service?: number;
    serviceName?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Disable',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;
    if (params?.serviceName !== undefined) reqParams['serviceName'] = params.serviceName;

    return this.request(apiName, info.path, reqParams);
  }

  async setAddonAutoupdate(params?: {
    service?: number;
    BlEnabled?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AddOns';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetAutoUpdate',
    };

    if (params?.service !== undefined) reqParams['service'] = params.service;
    if (params?.BlEnabled !== undefined) reqParams['BlEnabled'] = params.BlEnabled;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Alert
  // ========================

  async deleteSpecificCameraRecordingServer(params?: {
    camIdList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'RecServClear',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;

    return this.request(apiName, info.path, reqParams);
  }

  async getCameraEventAnalytic(params?: {
    camIdList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EventCount',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;

    return this.request(apiName, info.path, reqParams);
  }

  async deleteSelectedEvents(params?: {
    dsIdList?: string;
    idList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ClearSelected',
    };

    if (params?.dsIdList !== undefined) reqParams['dsIdList'] = params.dsIdList;
    if (params?.idList !== undefined) reqParams['idList'] = params.idList;

    return this.request(apiName, info.path, reqParams);
  }

  async deleteSpecificCameraEvents(params?: {
    camIdList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EventCount',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;

    return this.request(apiName, info.path, reqParams);
  }

  async getAnalyticHistory(params?: {
    camIdList?: string;
    typeListstring?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;
    if (params?.typeListstring !== undefined) reqParams['typeListstring'] = params.typeListstring;

    return this.request(apiName, info.path, reqParams);
  }

  async getAnalyticHistoryByFilter(params?: {
    camIdList?: string;
    dsId?: number;
    lock?: number;
    typeList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'RecServerEnum',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;
    if (params?.dsId !== undefined) reqParams['dsId'] = params.dsId;
    if (params?.lock !== undefined) reqParams['lock'] = params.lock;
    if (params?.typeList !== undefined) reqParams['typeList'] = params.typeList;

    return this.request(apiName, info.path, reqParams);
  }

  async unlockSelectedEvents(params?: {
    dsId?: number;
    idList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (params?.dsId !== undefined) reqParams['dsId'] = params.dsId;
    if (params?.idList !== undefined) reqParams['idList'] = params.idList;

    return this.request(apiName, info.path, reqParams);
  }

  async setCameraAnalyticTrigger(params?: {
    trigCamIdList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Trigger',
    };

    if (params?.trigCamIdList !== undefined) reqParams['trigCamIdList'] = params.trigCamIdList;

    return this.request(apiName, info.path, reqParams);
  }

  async flushEventHeader(params?: {
    eventId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EventFlushHeader',
    };

    if (params?.eventId !== undefined) reqParams['eventId'] = params.eventId;

    return this.request(apiName, info.path, reqParams);
  }

  async lockSelectedEvents(params?: {
    dsId?: number;
    idList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (params?.dsId !== undefined) reqParams['dsId'] = params.dsId;
    if (params?.idList !== undefined) reqParams['idList'] = params.idList;

    return this.request(apiName, info.path, reqParams);
  }

  async getAnalyticEventFromRecServer(params?: {
    camIdList?: string;
    idList?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'RecServerEventCount',
    };

    if (params?.camIdList !== undefined) reqParams['camIdList'] = params.camIdList;
    if (params?.idList !== undefined) reqParams['idList'] = params.idList;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // Alert.Setting
  // ========================

  async saveAnalyticSettings(params?: {
    camId?: number;
    type?: number;
    showFrame?: boolean;
    showLine?: boolean;
    showVirtualFence?: boolean;
    beep?: boolean;
    sens?: number;
    dwellTime?: number;
    direction?: number;
    objSize?: number;
    region?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Alert.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (params?.camId !== undefined) reqParams['camId'] = params.camId;
    if (params?.type !== undefined) reqParams['type'] = params.type;
    if (params?.showFrame !== undefined) reqParams['showFrame'] = params.showFrame;
    if (params?.showLine !== undefined) reqParams['showLine'] = params.showLine;
    if (params?.showVirtualFence !== undefined) reqParams['showVirtualFence'] = params.showVirtualFence;
    if (params?.beep !== undefined) reqParams['beep'] = params.beep;
    if (params?.sens !== undefined) reqParams['sens'] = params.sens;
    if (params?.dwellTime !== undefined) reqParams['dwellTime'] = params.dwellTime;
    if (params?.direction !== undefined) reqParams['direction'] = params.direction;
    if (params?.objSize !== undefined) reqParams['objSize'] = params.objSize;
    if (params?.region !== undefined) reqParams['region'] = params.region;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // SnapShot
  // ========================

  async checkIfSnapshotExist(params?: {
    id?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ChkFileExist',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;

    return this.request(apiName, info.path, reqParams);
  }

  async saveSnapshotModification(params?: {
    id?: number;
    createCopy?: boolean;
    width?: number;
    height?: number;
    byteSize?: number;
    imageData?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Edit',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;
    if (params?.createCopy !== undefined) reqParams['createCopy'] = params.createCopy;
    if (params?.width !== undefined) reqParams['width'] = params.width;
    if (params?.height !== undefined) reqParams['height'] = params.height;
    if (params?.byteSize !== undefined) reqParams['byteSize'] = params.byteSize;
    if (params?.imageData !== undefined) reqParams['imageData'] = params.imageData;

    return this.request(apiName, info.path, reqParams);
  }

  async countSnapshotByCategory(params?: {
    keyword?: string;
    from?: number;
    to?: number;
    timezoneOffset?: number;
    byteSize?: number;
    imageData?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountByCategory',
    };

    if (params?.keyword !== undefined) reqParams['keyword'] = params.keyword;
    if (params?.from !== undefined) reqParams['from'] = params.from;
    if (params?.to !== undefined) reqParams['to'] = params.to;
    if (params?.timezoneOffset !== undefined) reqParams['timezoneOffset'] = params.timezoneOffset;
    if (params?.byteSize !== undefined) reqParams['byteSize'] = params.byteSize;
    if (params?.imageData !== undefined) reqParams['imageData'] = params.imageData;

    return this.request(apiName, info.path, reqParams);
  }

  async checkAnyLockedSnapshot(params?: {
    id?: string;
    from?: number;
    to?: number;
    keyword?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ChkContainLocked',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;
    if (params?.from !== undefined) reqParams['from'] = params.from;
    if (params?.to !== undefined) reqParams['to'] = params.to;
    if (params?.keyword !== undefined) reqParams['keyword'] = params.keyword;

    return this.request(apiName, info.path, reqParams);
  }

  async unlockSnapshotByFilter(params?: {
    from?: number;
    to?: number;
    keyword?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'UnlockFiltered',
    };

    if (params?.from !== undefined) reqParams['from'] = params.from;
    if (params?.to !== undefined) reqParams['to'] = params.to;
    if (params?.keyword !== undefined) reqParams['keyword'] = params.keyword;

    return this.request(apiName, info.path, reqParams);
  }

  async listSnapshotInformation(params?: {
    idList?: string;
    start?: number;
    limit?: number;
    from?: number;
    to?: number;
    keyword?: string;
    imgSize?: number;
    blIncludeAuInfo?: boolean;
    blIncludeRecCnt?: boolean;
    camId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'List',
    };

    if (params?.idList !== undefined) reqParams['idList'] = params.idList;
    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.from !== undefined) reqParams['from'] = params.from;
    if (params?.to !== undefined) reqParams['to'] = params.to;
    if (params?.keyword !== undefined) reqParams['keyword'] = params.keyword;
    if (params?.imgSize !== undefined) reqParams['imgSize'] = params.imgSize;
    if (params?.blIncludeAuInfo !== undefined) reqParams['blIncludeAuInfo'] = params.blIncludeAuInfo;
    if (params?.blIncludeRecCnt !== undefined) reqParams['blIncludeRecCnt'] = params.blIncludeRecCnt;
    if (params?.camId !== undefined) reqParams['camId'] = params.camId;

    return this.request(apiName, info.path, reqParams);
  }

  async unlockSnapshot(params?: {
    objList?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (params?.objList !== undefined) reqParams['objList'] = params.objList;

    return this.request(apiName, info.path, reqParams);
  }

  async takeSnapshot(params?: {
    dsId?: number;
    camId?: number;
    blSave?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'TakeSnapshot',
    };

    if (params?.dsId !== undefined) reqParams['dsId'] = params.dsId;
    if (params?.camId !== undefined) reqParams['camId'] = params.camId;
    if (params?.blSave !== undefined) reqParams['blSave'] = params.blSave;

    return this.request(apiName, info.path, reqParams);
  }

  async getSnapshotSettingFunction(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetSetting',
    });
  }

  async deleteSnapshotByFilter(params?: {
    deleteAllCommand?: boolean;
    from?: number;
    to?: number;
    keyword?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteFiltered',
    };

    if (params?.deleteAllCommand !== undefined) reqParams['deleteAllCommand'] = params.deleteAllCommand;
    if (params?.from !== undefined) reqParams['from'] = params.from;
    if (params?.to !== undefined) reqParams['to'] = params.to;
    if (params?.keyword !== undefined) reqParams['keyword'] = params.keyword;

    return this.request(apiName, info.path, reqParams);
  }

  async getSnapshotImage(params?: {
    id?: number;
    imgSize?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'LoadSnapshot',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;
    if (params?.imgSize !== undefined) reqParams['imgSize'] = params.imgSize;

    return this.request(apiName, info.path, reqParams);
  }

  async lockSnapshotImage(params?: {
    objList?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (params?.objList !== undefined) reqParams['objList'] = params.objList;

    return this.request(apiName, info.path, reqParams);
  }

  async downloadSingleSnapshot(params?: {
    id?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Download',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;

    return this.request(apiName, info.path, reqParams);
  }

  async saveNewSnapshotSetting(params?: {
    dispSnapshot?: boolean;
    dispDuration?: number;
    limitTotalSize?: boolean;
    limitSizeInGb?: number;
    addTimestamp?: boolean;
    timestampPosition?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveSetting',
    };

    if (params?.dispSnapshot !== undefined) reqParams['dispSnapshot'] = params.dispSnapshot;
    if (params?.dispDuration !== undefined) reqParams['dispDuration'] = params.dispDuration;
    if (params?.limitTotalSize !== undefined) reqParams['limitTotalSize'] = params.limitTotalSize;
    if (params?.limitSizeInGb !== undefined) reqParams['limitSizeInGb'] = params.limitSizeInGb;
    if (params?.addTimestamp !== undefined) reqParams['addTimestamp'] = params.addTimestamp;
    if (params?.timestampPosition !== undefined) reqParams['timestampPosition'] = params.timestampPosition;

    return this.request(apiName, info.path, reqParams);
  }

  async saveSnapshot(params?: {
    camName?: string;
    createdTm?: number;
    width?: number;
    height?: number;
    byteSize?: number;
    imageData?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (params?.camName !== undefined) reqParams['camName'] = params.camName;
    if (params?.createdTm !== undefined) reqParams['createdTm'] = params.createdTm;
    if (params?.width !== undefined) reqParams['width'] = params.width;
    if (params?.height !== undefined) reqParams['height'] = params.height;
    if (params?.byteSize !== undefined) reqParams['byteSize'] = params.byteSize;
    if (params?.imageData !== undefined) reqParams['imageData'] = params.imageData;

    return this.request(apiName, info.path, reqParams);
  }

  async checkSnapshotStatus(params?: {
    dispSnapshot?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.SnapShot';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ChkSnapshotValid',
    };

    if (params?.dispSnapshot !== undefined) reqParams['dispSnapshot'] = params.dispSnapshot;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // VisualStation
  // ========================

  async enableVisualstation(params?: {
    vslist?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enable',
    };

    if (params?.vslist !== undefined) reqParams['vslist'] = params.vslist;

    return this.request(apiName, info.path, reqParams);
  }

  async updateVsNetworkConfig(params?: {
    vsMAc?: string;
    ip?: string;
    mask?: string;
    gateway?: string;
    blDhcp?: boolean;
    name?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ReqNetConfig',
    };

    if (params?.vsMAc !== undefined) reqParams['vsMAc'] = params.vsMAc;
    if (params?.ip !== undefined) reqParams['ip'] = params.ip;
    if (params?.mask !== undefined) reqParams['mask'] = params.mask;
    if (params?.gateway !== undefined) reqParams['gateway'] = params.gateway;
    if (params?.blDhcp !== undefined) reqParams['blDhcp'] = params.blDhcp;
    if (params?.name !== undefined) reqParams['name'] = params.name;

    return this.request(apiName, info.path, reqParams);
  }

  async lockVisualstationById(params?: {
    vslist?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (params?.vslist !== undefined) reqParams['vslist'] = params.vslist;

    return this.request(apiName, info.path, reqParams);
  }

  async enumerateVsOwnerInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Enum',
    });
  }

  async unlockVisualstationById(params?: {
    vslist?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (params?.vslist !== undefined) reqParams['vslist'] = params.vslist;

    return this.request(apiName, info.path, reqParams);
  }

  async disableVisualstationById(params?: {
    vslist?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Disable',
    };

    if (params?.vslist !== undefined) reqParams['vslist'] = params.vslist;

    return this.request(apiName, info.path, reqParams);
  }

  async deleteSpecificVisualstation(params?: {
    vslist?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (params?.vslist !== undefined) reqParams['vslist'] = params.vslist;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // VisualStation.Layout
  // ========================

  async enumerateLayoutVisualstation(params?: {
    vsId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Layout';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (params?.vsId !== undefined) reqParams['vsId'] = params.vsId;

    return this.request(apiName, info.path, reqParams);
  }

  async saveLayoutInformation(params?: {
    id?: number;
    vsId?: number;
    name?: string;
    canGrpId?: number;
    isDefault?: number;
    isFixAspectRatio?: number;
    layoutType?: number;
    channelList?: unknown;
    customPosList?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Layout';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;
    if (params?.vsId !== undefined) reqParams['vsId'] = params.vsId;
    if (params?.name !== undefined) reqParams['name'] = params.name;
    if (params?.canGrpId !== undefined) reqParams['canGrpId'] = params.canGrpId;
    if (params?.isDefault !== undefined) reqParams['isDefault'] = params.isDefault;
    if (params?.isFixAspectRatio !== undefined) reqParams['isFixAspectRatio'] = params.isFixAspectRatio;
    if (params?.layoutType !== undefined) reqParams['layoutType'] = params.layoutType;
    if (params?.channelList !== undefined) reqParams['channelList'] = params.channelList;
    if (params?.customPosList !== undefined) reqParams['customPosList'] = params.customPosList;

    return this.request(apiName, info.path, reqParams);
  }

  async deleteLayoutVisualstation(params?: {
    id?: number;
    vsId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Layout';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (params?.id !== undefined) reqParams['id'] = params.id;
    if (params?.vsId !== undefined) reqParams['vsId'] = params.vsId;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // VisualStation.Search
  // ========================

  async clearVisualstationSearchResult(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Start',
    });
  }

  async getVisualstationIpInfo(params?: {
    ip?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SearchIP',
    };

    if (params?.ip !== undefined) reqParams['ip'] = params.ip;

    return this.request(apiName, info.path, reqParams);
  }

  async stopPreviousVisualstationSearch(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Stop',
    });
  }

  async getVisualstationList(params?: {
    offset?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.VisualStation.Layout';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'InfoGet',
    };

    if (params?.offset !== undefined) reqParams['offset'] = params.offset;

    return this.request(apiName, info.path, reqParams);
  }

  // ========================
  // AxisAcsCtrler
  // ========================

  async getNumberOfController(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetUpdateInfo',
    });
  }

  async getCardholderCount(params?: {
    filterKeyword?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountByCategoryCardHolder',
    };

    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;

    return this.request(apiName, info.path, reqParams);
  }

  async enumAllControllersLogger(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'EnumLogConfig',
    });
  }

  async getCardholderPhoto(params?: {
    photoName?: string;
    isRedirectCgi?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetCardholderPhoto',
    };

    if (params?.photoName !== undefined) reqParams['photo_name'] = params.photoName;
    if (params?.isRedirectCgi !== undefined) reqParams['isRedirectCgi'] = params.isRedirectCgi;

    return this.request(apiName, info.path, reqParams);
  }

  async getLogCount(params?: {
    start?: number;
    limit?: number;
    filterType?: number;
    filterEventSource?: unknown;
    filterSource?: number;
    filterEventSourceItem?: number;
    filterTimeFrom?: number;
    filterTimeTo?: number;
    filterKeyword?: string;
    timezoneOffset?: number;
    doorIds?: string;
    eventTypes?: string;
    update?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountByCategoryLog',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.filterType !== undefined) reqParams['filterType'] = params.filterType;
    if (params?.filterEventSource !== undefined) reqParams['filterEventSource'] = params.filterEventSource;
    if (params?.filterSource !== undefined) reqParams['filterSource'] = params.filterSource;
    if (params?.filterEventSourceItem !== undefined) reqParams['filterEventSourceItem'] = params.filterEventSourceItem;
    if (params?.filterTimeFrom !== undefined) reqParams['filterTimeFrom'] = params.filterTimeFrom;
    if (params?.filterTimeTo !== undefined) reqParams['filterTimeTo'] = params.filterTimeTo;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.timezoneOffset !== undefined) reqParams['timezoneOffset'] = params.timezoneOffset;
    if (params?.doorIds !== undefined) reqParams['doorIds'] = params.doorIds;
    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.update !== undefined) reqParams['update'] = params.update;

    return this.request(apiName, info.path, reqParams);
  }

  async getCardholderInfo(params?: {
    start?: number;
    limit?: number;
    filterKeyword?: string;
    filterStatus?: number;
    filterCtrlerId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnumCardHolder',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.filterStatus !== undefined) reqParams['filterStatus'] = params.filterStatus;
    if (params?.filterCtrlerId !== undefined) reqParams['filterCtrlerId'] = params.filterCtrlerId;

    return this.request(apiName, info.path, reqParams);
  }

  async retrieveLastAccessCredential(params?: {
    ctrlerId?: number;
    idPtId?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'RetrieveLastCard',
    };

    if (params?.ctrlerId !== undefined) reqParams['ctrlerId'] = params.ctrlerId;
    if (params?.idPtId !== undefined) reqParams['idPtId'] = params.idPtId;

    return this.request(apiName, info.path, reqParams);
  }

  async enableDisableController(params?: {
    blEnable?: boolean;
    arrayJson?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnableCtrler',
    };

    if (params?.blEnable !== undefined) reqParams['blEnable'] = params.blEnable;
    if (params?.arrayJson !== undefined) reqParams['arrayJson'] = params.arrayJson;

    return this.request(apiName, info.path, reqParams);
  }

  async acknowledgeAllAlarmLevelLog(params?: {
    start?: number;
    limit?: number;
    filterEventSource?: unknown;
    filterSource?: number;
    filterEventSourceItem?: string;
    filterTimeFrom?: number;
    filterKeyword?: string;
    doorIds?: string;
    eventTypes?: string;
    update?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'AckAlarm',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.filterEventSource !== undefined) reqParams['filterEventSource'] = params.filterEventSource;
    if (params?.filterSource !== undefined) reqParams['filterSource'] = params.filterSource;
    if (params?.filterEventSourceItem !== undefined) reqParams['filterEventSourceItem'] = params.filterEventSourceItem;
    if (params?.filterTimeFrom !== undefined) reqParams['filterTimeFrom'] = params.filterTimeFrom;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.doorIds !== undefined) reqParams['doorIds'] = params.doorIds;
    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.update !== undefined) reqParams['update'] = params.update;

    return this.request(apiName, info.path, reqParams);
  }

  async modifyControllerLoggerConfig(params?: {
    data?: unknown;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveLogConfig',
    };

    if (params?.data !== undefined) reqParams['data'] = params.data;

    return this.request(apiName, info.path, reqParams);
  }

  async saveControllerSettings(params?: {
    arrayJson?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (params?.arrayJson !== undefined) reqParams['arrayJson'] = params.arrayJson;

    return this.request(apiName, info.path, reqParams);
  }

  async downloadFilteredLogs(params?: {
    start?: number;
    limit?: number;
    filterType?: number;
    filterEventSource?: number;
    filterSource?: number;
    filterEventSourceItem?: string;
    filterTimeFrom?: number;
    filterTimeTo?: number;
    filterKeyword?: string;
    doorIds?: string;
    eventTypes?: string;
    update?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DownloadLog',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.filterType !== undefined) reqParams['filterType'] = params.filterType;
    if (params?.filterEventSource !== undefined) reqParams['filterEventSource'] = params.filterEventSource;
    if (params?.filterSource !== undefined) reqParams['filterSource'] = params.filterSource;
    if (params?.filterEventSourceItem !== undefined) reqParams['filterEventSourceItem'] = params.filterEventSourceItem;
    if (params?.filterTimeFrom !== undefined) reqParams['filterTimeFrom'] = params.filterTimeFrom;
    if (params?.filterTimeTo !== undefined) reqParams['filterTimeTo'] = params.filterTimeTo;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.doorIds !== undefined) reqParams['doorIds'] = params.doorIds;
    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.update !== undefined) reqParams['update'] = params.update;

    return this.request(apiName, info.path, reqParams);
  }

  async getDoorNameFromController(params?: {
    ctrlerId?: number;
    ip?: string;
    port?: number;
    userName?: string;
    password?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetDoorNames',
    };

    if (params?.ctrlerId !== undefined) reqParams['ctrlerId'] = params.ctrlerId;
    if (params?.ip !== undefined) reqParams['ip'] = params.ip;
    if (params?.port !== undefined) reqParams['port'] = params.port;
    if (params?.userName !== undefined) reqParams['userName'] = params.userName;
    if (params?.password !== undefined) reqParams['password'] = params.password;

    return this.request(apiName, info.path, reqParams);
  }

  async testConnectionAndAuthentication(params?: {
    ctrlerId?: number;
    ip?: string;
    port?: number;
    userName?: string;
    password?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'TestConnect',
    };

    if (params?.ctrlerId !== undefined) reqParams['ctrlerId'] = params.ctrlerId;
    if (params?.ip !== undefined) reqParams['ip'] = params.ip;
    if (params?.port !== undefined) reqParams['port'] = params.port;
    if (params?.userName !== undefined) reqParams['userName'] = params.userName;
    if (params?.password !== undefined) reqParams['password'] = params.password;

    return this.request(apiName, info.path, reqParams);
  }

  async enumerateControllerListInfo(params?: {
    start?: number;
    limit?: number;
    update?: number;
    blIncludeRecCnt?: boolean;
    blIncludeAuInfo?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.update !== undefined) reqParams['update'] = params.update;
    if (params?.blIncludeRecCnt !== undefined) reqParams['blIncludeRecCnt'] = params.blIncludeRecCnt;
    if (params?.blIncludeAuInfo !== undefined) reqParams['blIncludeAuInfo'] = params.blIncludeAuInfo;

    return this.request(apiName, info.path, reqParams);
  }

  async saveCardholderSetting(params?: {
    arrayJson?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveCardHolder',
    };

    if (params?.arrayJson !== undefined) reqParams['arrayJson'] = params.arrayJson;

    return this.request(apiName, info.path, reqParams);
  }

  async enumerateDoorInfo(params?: {
    DoorIds?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListDoor',
    };

    if (params?.DoorIds !== undefined) reqParams['DoorIds'] = params.DoorIds;

    return this.request(apiName, info.path, reqParams);
  }

  async clearLogsSurveillanceStation(params?: {
    filterType?: number;
    filterEventSource?: unknown;
    filterSource?: number;
    filterEventSourceItem?: string;
    filterTimeFrom?: number;
    filterTimeTo?: number;
    filterKeyword?: string;
    doorIds?: string;
    eventTypes?: string;
    update?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ClearLog',
    };

    if (params?.filterType !== undefined) reqParams['filterType'] = params.filterType;
    if (params?.filterEventSource !== undefined) reqParams['filterEventSource'] = params.filterEventSource;
    if (params?.filterSource !== undefined) reqParams['filterSource'] = params.filterSource;
    if (params?.filterEventSourceItem !== undefined) reqParams['filterEventSourceItem'] = params.filterEventSourceItem;
    if (params?.filterTimeFrom !== undefined) reqParams['filterTimeFrom'] = params.filterTimeFrom;
    if (params?.filterTimeTo !== undefined) reqParams['filterTimeTo'] = params.filterTimeTo;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.doorIds !== undefined) reqParams['doorIds'] = params.doorIds;
    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.update !== undefined) reqParams['update'] = params.update;

    return this.request(apiName, info.path, reqParams);
  }

  async listAllUserPrivilege(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'ListPrivilege',
    });
  }

  async manualLockOperation(params?: {
    doorId?: number;
    operation?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DoorControl',
    };

    if (params?.doorId !== undefined) reqParams['doorId'] = params.doorId;
    if (params?.operation !== undefined) reqParams['operation'] = params.operation;

    return this.request(apiName, info.path, reqParams);
  }

  async saveUserDoorPrivSetting(params?: {
    arrayJson?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SavePrivilege',
    };

    if (params?.arrayJson !== undefined) reqParams['arrayJson'] = params.arrayJson;

    return this.request(apiName, info.path, reqParams);
  }

  async listAllLogs(params?: {
    start?: number;
    limit?: number;
    filterType?: number;
    filterEventSource?: unknown;
    filterSource?: number;
    filterEventSourceItem?: string;
    filterTimeFrom?: number;
    filterTimeTo?: number;
    filterKeyword?: string;
    timezoneOffset?: number;
    doorIds?: string;
    eventTypes?: string;
    update?: number;
    blIncludeRecCnt?: boolean;
    blIncludeAuInfo?: boolean;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListLog',
    };

    if (params?.start !== undefined) reqParams['start'] = params.start;
    if (params?.limit !== undefined) reqParams['limit'] = params.limit;
    if (params?.filterType !== undefined) reqParams['filterType'] = params.filterType;
    if (params?.filterEventSource !== undefined) reqParams['filterEventSource'] = params.filterEventSource;
    if (params?.filterSource !== undefined) reqParams['filterSource'] = params.filterSource;
    if (params?.filterEventSourceItem !== undefined) reqParams['filterEventSourceItem'] = params.filterEventSourceItem;
    if (params?.filterTimeFrom !== undefined) reqParams['filterTimeFrom'] = params.filterTimeFrom;
    if (params?.filterTimeTo !== undefined) reqParams['filterTimeTo'] = params.filterTimeTo;
    if (params?.filterKeyword !== undefined) reqParams['filterKeyword'] = params.filterKeyword;
    if (params?.timezoneOffset !== undefined) reqParams['timezoneOffset'] = params.timezoneOffset;
    if (params?.doorIds !== undefined) reqParams['doorIds'] = params.doorIds;
    if (params?.eventTypes !== undefined) reqParams['eventTypes'] = params.eventTypes;
    if (params?.update !== undefined) reqParams['update'] = params.update;
    if (params?.blIncludeRecCnt !== undefined) reqParams['blIncludeRecCnt'] = params.blIncludeRecCnt;
    if (params?.blIncludeAuInfo !== undefined) reqParams['blIncludeAuInfo'] = params.blIncludeAuInfo;

    return this.request(apiName, info.path, reqParams);
  }

  async deleteSelectedController(params?: {
    ids?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (params?.ids !== undefined) reqParams['ids'] = params.ids;

    return this.request(apiName, info.path, reqParams);
  }

  async retrieveDataFromController(params?: {
    ctrlerId?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Retrieve',
    };

    if (params?.ctrlerId !== undefined) reqParams['ctrlerId'] = params.ctrlerId;

    return this.request(apiName, info.path, reqParams);
  }

  async blockCardholder(params?: {
    arrayJson?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'BlockCardHolder',
    };

    if (params?.arrayJson !== undefined) reqParams['arrayJson'] = params.arrayJson;

    return this.request(apiName, info.path, reqParams);
  }

  async getControllerCount(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'CountByCategory',
    });
  }

  // ========================
  // AxisAcsCtrler.Search
  // ========================

  async startControllerSearch(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Start',
    });
  }

  async getControllerSearchInfo(params?: {
    pid?: number;
    offset?: number;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.AxisAcsCtrler.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const reqParams: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetInfo',
    };

    if (params?.pid !== undefined) reqParams['pid'] = params.pid;
    if (params?.offset !== undefined) reqParams['offset'] = params.offset;

    return this.request(apiName, info.path, reqParams);
  }

  // ==================== Digital Output ====================

  /**
   * Enumerate digital output devices.
   */
  async enumerateDigitalOutput(
    camId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.DigitalOutput';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (camId !== undefined) params['camId'] = camId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Save parameters for a digital output device.
   */
  async saveDigitalOutputParameters(
    camId?: number,
    idx?: number,
    keepSetting?: boolean,
    normalState?: number,
    triggerState?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.DigitalOutput';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (camId !== undefined) params['camId'] = camId;
    if (idx !== undefined) params['idx'] = idx;
    if (keepSetting !== undefined) params['keep_setting'] = keepSetting;
    if (normalState !== undefined) params['normal_state'] = normalState;
    if (triggerState !== undefined) params['trigger_state'] = triggerState;

    return this.request(apiName, info.path, params);
  }

  /**
   * Perform long polling to get the status of a digital output.
   */
  async longPollingDigitalOutputStatus(
    camId?: number,
    idx?: number,
    keep?: boolean,
    setNormalCap?: boolean,
    normal?: number,
    trigger?: boolean,
    timeOut?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.DigitalOutput';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'PollState',
    };

    if (camId !== undefined) params['camId'] = camId;
    if (idx !== undefined) params['idx'] = idx;
    if (keep !== undefined) params['keep'] = keep;
    if (setNormalCap !== undefined) params['setNormalCap'] = setNormalCap;
    if (normal !== undefined) params['normal'] = normal;
    if (trigger !== undefined) params['trigger'] = trigger;
    if (timeOut !== undefined) params['timeOut'] = timeOut;

    return this.request(apiName, info.path, params);
  }

  // ==================== External Event ====================

  /**
   * Trigger an external event in Surveillance Station.
   */
  async triggerExternalEvent(
    eventId?: number,
    eventName?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.ExternalEvent';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Trigger',
    };

    if (eventId !== undefined) params['eventId'] = eventId;
    if (eventName !== undefined) params['eventName'] = eventName;

    return this.request(apiName, info.path, params);
  }

  // ==================== IO Module ====================

  /**
   * Get a list of I/O modules.
   */
  async getListIoModules(
    start?: number,
    limit?: number,
    blFromList?: boolean,
    ownerDsId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;
    if (blFromList !== undefined) params['blFromList'] = blFromList;
    if (ownerDsId !== undefined) params['ownerDsId'] = ownerDsId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get a list of I/O ports for a module.
   */
  async getIoPortList(
    id?: number,
    port?: number,
    ip?: string,
    user?: string,
    pass?: string,
    vendor?: string,
    model?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnumPort',
    };

    if (id !== undefined) params['Id'] = id;
    if (port !== undefined) params['Port'] = port;
    if (ip !== undefined) params['IP'] = ip;
    if (user !== undefined) params['User'] = user;
    if (pass !== undefined) params['Pass'] = pass;
    if (vendor !== undefined) params['Vendor'] = vendor;
    if (model !== undefined) params['Model'] = model;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get a list of supported I/O module vendor models.
   */
  async getSupportedListIoModules(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'EnumVendorModel',
    });
  }

  /**
   * Save or update the settings for an I/O module.
   */
  async saveSettingIoModule(
    name?: string,
    id?: number,
    ownerDsId?: number,
    vendor?: string,
    model?: string,
    ip?: string,
    port?: number,
    userName?: string,
    enabled?: boolean,
    status?: number,
    timeServer?: string,
    passWord?: string,
    ntpEnable?: boolean,
    dioData?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (name !== undefined) params['name'] = name;
    if (id !== undefined) params['id'] = id;
    if (ownerDsId !== undefined) params['ownerDsId'] = ownerDsId;
    if (vendor !== undefined) params['vendor'] = vendor;
    if (model !== undefined) params['model'] = model;
    if (ip !== undefined) params['ip'] = ip;
    if (port !== undefined) params['port'] = port;
    if (userName !== undefined) params['userName'] = userName;
    if (enabled !== undefined) params['enabled'] = enabled;
    if (status !== undefined) params['status'] = status;
    if (timeServer !== undefined) params['timeServer'] = timeServer;
    if (passWord !== undefined) params['passWord'] = passWord;
    if (ntpEnable !== undefined) params['ntpEnable'] = ntpEnable;
    if (dioData !== undefined) params['DIOdata'] = dioData;

    return this.request(apiName, info.path, params);
  }

  /**
   * Enable specified I/O modules.
   */
  async enableIoModules(
    iomlist?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enable',
    };

    if (iomlist !== undefined) params['iomlist'] = iomlist;

    return this.request(apiName, info.path, params);
  }

  /**
   * Disable specified I/O modules.
   */
  async disableIoModules(
    iomlist?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Disable',
    };

    if (iomlist !== undefined) params['iomlist'] = iomlist;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete specified I/O modules.
   */
  async deleteIoModules(
    iomlist?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (iomlist !== undefined) params['iomlist'] = iomlist;

    return this.request(apiName, info.path, params);
  }

  /**
   * Test the connection to a specified I/O module.
   */
  async testConnectionToIoModule(
    id?: number,
    port?: string,
    ip?: string,
    userName?: string,
    passWord?: string,
    model?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'TestConn',
    };

    if (id !== undefined) params['id'] = id;
    if (port !== undefined) params['port'] = port;
    if (ip !== undefined) params['ip'] = ip;
    if (userName !== undefined) params['userName'] = userName;
    if (passWord !== undefined) params['passWord'] = passWord;
    if (model !== undefined) params['model'] = model;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the capability information for a specified I/O module.
   */
  async getCapabilityIoModule(
    vendor?: string,
    model?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetCap',
    };

    if (vendor !== undefined) params['vendor'] = vendor;
    if (model !== undefined) params['model'] = model;

    return this.request(apiName, info.path, params);
  }

  /**
   * Configure the port settings for a specified I/O module.
   */
  async configureIoPortSetting(
    id?: number,
    dioData?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'PortSetting',
    };

    if (id !== undefined) params['id'] = id;
    if (dioData !== undefined) params['DIOdata'] = dioData;

    return this.request(apiName, info.path, params);
  }

  /**
   * Poll the trigger state of digital input (DI) ports for a specified I/O module.
   */
  async pollTriggerStateIoModule(
    id?: number,
    list?: string,
    timeOut?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'PollingDI',
    };

    if (id !== undefined) params['Id'] = id;
    if (list !== undefined) params['list'] = list;
    if (timeOut !== undefined) params['timeOut'] = timeOut;

    return this.request(apiName, info.path, params);
  }

  /**
   * Poll the trigger state of digital output (DO) ports for a specified I/O module.
   */
  async pollDoTriggerModule(
    id?: number,
    idx?: number,
    normal?: number,
    trigger?: boolean,
    timeOut?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'PollingDO',
    };

    if (id !== undefined) params['id'] = id;
    if (idx !== undefined) params['idx'] = idx;
    if (normal !== undefined) params['normal'] = normal;
    if (trigger !== undefined) params['trigger'] = trigger;
    if (timeOut !== undefined) params['timeOut'] = timeOut;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the number of I/O devices for each device station.
   */
  async getNumberOfDevices(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'GetDevNumOfDs',
    });
  }

  /**
   * Get the count of I/O modules by category.
   */
  async getCategoryCountIoModule(
    start?: number,
    limit?: number,
    ownerDsId?: number,
    blFromList?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountByCategory',
    };

    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;
    if (ownerDsId !== undefined) params['ownerDsId'] = ownerDsId;
    if (blFromList !== undefined) params['blFromList'] = blFromList;

    return this.request(apiName, info.path, params);
  }

  // ==================== IO Module Search ====================

  /**
   * Start searching for I/O modules.
   */
  async startSearchIoModule(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Start',
    });
  }

  /**
   * Get information about the current I/O module search.
   */
  async getSearchIoModuleInfo(
    pid?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IOModule.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'InfoGet',
    };

    if (pid !== undefined) params['pid'] = pid;

    return this.request(apiName, info.path, params);
  }

  // ==================== Camera Status ====================

  /**
   * Get the current status of specified cameras.
   */
  async getCurrentCameraStatus(
    idList?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'OneTime',
    };

    if (idList !== undefined) params['id_list'] = idList;

    return this.request(apiName, info.path, params);
  }

  // ==================== PTZ Preset ====================

  /**
   * Enumerate the list of presets for a specified camera.
   */
  async enumPresetCameraList(
    cameraId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the capability information for camera presets.
   */
  async getPresetCameraCapability(
    cameraId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetInfo',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Record the current position of a camera as a preset.
   */
  async recordCurrentCameraPosition(
    cameraId?: number,
    position?: number,
    speed?: number,
    name?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetPreset',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;
    if (position !== undefined) params['position'] = position;
    if (speed !== undefined) params['speed'] = speed;
    if (name !== undefined) params['name'] = name;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete specified presets from a camera.
   */
  async deleteListPresetCamera(
    cameraId?: number,
    position?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DelPreset',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;
    if (position !== undefined) params['position'] = position;

    return this.request(apiName, info.path, params);
  }

  /**
   * Move a camera to a specific preset position at a given speed.
   */
  async goSpecificPresetByGivenSpeed(
    cameraId?: number,
    position?: number,
    speed?: number,
    type?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Execute',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;
    if (position !== undefined) params['position'] = position;
    if (speed !== undefined) params['speed'] = speed;
    if (type !== undefined) params['type'] = type;

    return this.request(apiName, info.path, params);
  }

  /**
   * Set the current position of a camera as the home position.
   */
  async setCurrentCameraPosition(
    cameraId?: number,
    bindPosition?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Preset';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SetHome',
    };

    if (cameraId !== undefined) params['cameraId'] = cameraId;
    if (bindPosition !== undefined) params['bindPosition'] = bindPosition;

    return this.request(apiName, info.path, params);
  }

  // ==================== PTZ Patrol ====================

  /**
   * Enumerate the list of patrols for a specified camera.
   */
  async enumPatrolList(
    cam?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (cam !== undefined) params['cam'] = cam;

    return this.request(apiName, info.path, params);
  }

  /**
   * Enumerate the list of patrol names for a specified camera.
   */
  async enumPatrolNameList(
    camId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnumPartial',
    };

    if (camId !== undefined) params['camId'] = camId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Load the details of a specific patrol.
   */
  async loadPatrolDetail(
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Load',
    };

    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Add or modify a patrol for a camera.
   */
  async addOrModifyPatrol(
    camId?: number,
    id?: number,
    stayTime?: number,
    speed?: number,
    name?: string,
    presetList?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (camId !== undefined) params['camId'] = camId;
    if (id !== undefined) params['id'] = id;
    if (stayTime !== undefined) params['stayTime'] = stayTime;
    if (speed !== undefined) params['speed'] = speed;
    if (name !== undefined) params['name'] = name;
    if (presetList !== undefined) params['presetList'] = presetList;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete a specific patrol from a camera.
   */
  async deleteSpecificPatrol(
    camId?: number,
    patrolId?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (camId !== undefined) params['camId'] = camId;
    if (patrolId !== undefined) params['patrolId'] = patrolId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Run a specified patrol on a camera.
   */
  async runPatrol(
    camId?: number,
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Execute',
    };

    if (camId !== undefined) params['camId'] = camId;
    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Stop the currently running patrol on a camera.
   */
  async stopPatrol(
    camId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.PTZ.Patrol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Stop',
    };

    if (camId !== undefined) params['camId'] = camId;

    return this.request(apiName, info.path, params);
  }

  // ==================== Camera Search ====================

  /**
   * Start searching for cameras.
   */
  async startCameraSearchProcess(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Start',
    });
  }

  /**
   * Get information about the current camera search.
   */
  async getCameraSearchInfo(
    pid?: number,
    offset?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Camera.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetInfo',
    };

    if (pid !== undefined) params['pid'] = pid;
    if (offset !== undefined) params['offset'] = offset;

    return this.request(apiName, info.path, params);
  }

  // ==================== Home Mode ====================

  /**
   * Toggle the Home Mode in Surveillance Station.
   */
  async toggleHomeMode(
    on?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.HomeMode';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Switch',
    };

    if (on !== undefined) params['on'] = on;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the current Home Mode settings.
   */
  async getHomeModeSettings(
    needMobiles?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.HomeMode';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetInfo',
    };

    if (needMobiles !== undefined) params['need_mobiles'] = needMobiles;

    return this.request(apiName, info.path, params);
  }

  // ==================== Transactions Device ====================

  /**
   * Get a list of device transactions with optional filters.
   */
  async getTransactionList(
    filterIds?: string,
    filterDsIds?: string,
    filterEnable?: boolean,
    filterStatus?: number,
    start?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Device';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (filterIds !== undefined) params['filterIds'] = filterIds;
    if (filterDsIds !== undefined) params['filterDsIds'] = filterDsIds;
    if (filterEnable !== undefined) params['filterEnable'] = filterEnable;
    if (filterStatus !== undefined) params['filterStatus'] = filterStatus;
    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  // ==================== Transactions Transaction ====================

  /**
   * Get a list of all transactions with optional filters.
   */
  async getAllTransactionList(
    filterIds?: string,
    dsId?: number,
    filterTimeFrom?: string | number,
    filterStatus?: number,
    filterLock?: boolean,
    filterTimeTo?: string | number,
    filterTimeRangeIntersect?: boolean,
    filterKeyword?: string,
    start?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enum',
    };

    if (filterIds !== undefined) params['filterIds'] = filterIds;
    if (dsId !== undefined) params['dsId'] = dsId;
    if (filterTimeFrom !== undefined) params['filterTimeFrom'] = filterTimeFrom;
    if (filterStatus !== undefined) params['filterStatus'] = filterStatus;
    if (filterLock !== undefined) params['filterLock'] = filterLock;
    if (filterTimeTo !== undefined) params['filterTimeTo'] = filterTimeTo;
    if (filterTimeRangeIntersect !== undefined) params['filterTimeRangeIntersect'] = filterTimeRangeIntersect;
    if (filterKeyword !== undefined) params['filterKeyword'] = filterKeyword;
    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  /**
   * Lock specified history records.
   */
  async lockHistoryRecords(
    filterIds?: string,
    dsId?: number,
    filterStatus?: number,
    filterLock?: boolean,
    filterTimeFrom?: string | number,
    filterTimeTo?: string | number,
    filterTimeRangeIntersect?: boolean,
    filterKeyword?: string,
    start?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (filterIds !== undefined) params['filterIds'] = filterIds;
    if (dsId !== undefined) params['dsId'] = dsId;
    if (filterStatus !== undefined) params['filterStatus'] = filterStatus;
    if (filterLock !== undefined) params['filterLock'] = filterLock;
    if (filterTimeFrom !== undefined) params['filterTimeFrom'] = filterTimeFrom;
    if (filterTimeTo !== undefined) params['filterTimeTo'] = filterTimeTo;
    if (filterTimeRangeIntersect !== undefined) params['filterTimeRangeIntersect'] = filterTimeRangeIntersect;
    if (filterKeyword !== undefined) params['filterKeyword'] = filterKeyword;
    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  /**
   * Unlock specified history records.
   */
  async unlockHistoryRecords(
    filterIds?: string,
    dsId?: number,
    filterStatus?: number,
    filterLock?: boolean,
    filterTimeFrom?: string | number,
    filterTimeTo?: string | number,
    filterTimeRangeIntersect?: boolean,
    filterKeyword?: string,
    start?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (filterIds !== undefined) params['filterIds'] = filterIds;
    if (dsId !== undefined) params['dsId'] = dsId;
    if (filterStatus !== undefined) params['filterStatus'] = filterStatus;
    if (filterLock !== undefined) params['filterLock'] = filterLock;
    if (filterTimeFrom !== undefined) params['filterTimeFrom'] = filterTimeFrom;
    if (filterTimeTo !== undefined) params['filterTimeTo'] = filterTimeTo;
    if (filterTimeRangeIntersect !== undefined) params['filterTimeRangeIntersect'] = filterTimeRangeIntersect;
    if (filterKeyword !== undefined) params['filterKeyword'] = filterKeyword;
    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete specified history records.
   */
  async deleteHistoryRecords(
    filterIds?: string,
    dsId?: number,
    filterStatus?: number,
    filterLock?: boolean,
    filterTimeFrom?: string | number,
    filterTimeTo?: string | number,
    filterTimeRangeIntersect?: boolean,
    filterKeyword?: string,
    start?: number,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (filterIds !== undefined) params['filterIds'] = filterIds;
    if (dsId !== undefined) params['dsId'] = dsId;
    if (filterStatus !== undefined) params['filterStatus'] = filterStatus;
    if (filterLock !== undefined) params['filterLock'] = filterLock;
    if (filterTimeFrom !== undefined) params['filterTimeFrom'] = filterTimeFrom;
    if (filterTimeTo !== undefined) params['filterTimeTo'] = filterTimeTo;
    if (filterTimeRangeIntersect !== undefined) params['filterTimeRangeIntersect'] = filterTimeRangeIntersect;
    if (filterKeyword !== undefined) params['filterKeyword'] = filterKeyword;
    if (start !== undefined) params['start'] = start;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  /**
   * Start a session with a specified session ID.
   */
  async startSessionWithSpecifiedSessionId(
    deviceName?: string,
    sessionId?: string,
    timeout?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Begin',
    };

    if (deviceName !== undefined) params['device_name'] = deviceName;
    if (sessionId !== undefined) params['session_id'] = sessionId;
    if (timeout !== undefined) params['timeout'] = timeout;

    return this.request(apiName, info.path, params);
  }

  /**
   * Complete a session with a specified session ID.
   */
  async completeSessionWithSpecifiedId(
    deviceName?: string,
    sessionId?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Complete',
    };

    if (deviceName !== undefined) params['device_name'] = deviceName;
    if (sessionId !== undefined) params['session_id'] = sessionId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Cancel a session with a specified session ID.
   */
  async cancelSessionWithSpecifiedSessionId(
    deviceName?: string,
    sessionId?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Cancel',
    };

    if (deviceName !== undefined) params['device_name'] = deviceName;
    if (sessionId !== undefined) params['session_id'] = sessionId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Append data to a session with a specified session ID.
   */
  async carryDataIntoSessionId(
    deviceName?: string,
    sessionId?: string,
    content?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Transactions.Transaction';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'AppendData',
    };

    if (deviceName !== undefined) params['device_name'] = deviceName;
    if (sessionId !== undefined) params['session_id'] = sessionId;
    if (content !== undefined) params['content'] = content;

    return this.request(apiName, info.path, params);
  }

  // ==================== Archiving Pull ====================

  /**
   * Add or edit an active vault task for archiving.
   */
  async addEditActiveVaultTask(
    blCustomFolder?: boolean,
    blLimitBySize?: boolean,
    blRotateFile?: boolean,
    blSrcRecNoOverlap?: boolean,
    blUseRecDet?: boolean,
    camId?: number,
    camInfo?: string,
    dayLimit?: number,
    didCode?: string,
    dsSerial?: string,
    execTime?: string | number,
    hostname?: string,
    id?: number,
    name?: string,
    passwd?: string,
    port?: string,
    recEndTm?: string | number,
    recMode?: string,
    recSchedule?: string,
    recStartTm?: string | number,
    schedule?: string,
    storagePath?: string,
    type?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveTask',
    };

    if (blCustomFolder !== undefined) params['blCustomFolder'] = blCustomFolder;
    if (blLimitBySize !== undefined) params['blLimitBySize'] = blLimitBySize;
    if (blRotateFile !== undefined) params['blRotateFile'] = blRotateFile;
    if (blSrcRecNoOverlap !== undefined) params['blSrcRecNoOverlap'] = blSrcRecNoOverlap;
    if (blUseRecDet !== undefined) params['blUseRecDet'] = blUseRecDet;
    if (camId !== undefined) params['camId'] = camId;
    if (camInfo !== undefined) params['camInfo'] = camInfo;
    if (dayLimit !== undefined) params['dayLimit'] = dayLimit;
    if (didCode !== undefined) params['didCode'] = didCode;
    if (dsSerial !== undefined) params['dsSerial'] = dsSerial;
    if (execTime !== undefined) params['execTime'] = execTime;
    if (hostname !== undefined) params['hostname'] = hostname;
    if (id !== undefined) params['id'] = id;
    if (name !== undefined) params['name'] = name;
    if (passwd !== undefined) params['passwd'] = passwd;
    if (port !== undefined) params['port'] = port;
    if (recEndTm !== undefined) params['recEndTm'] = recEndTm;
    if (recMode !== undefined) params['recMode'] = recMode;
    if (recSchedule !== undefined) params['recSchedule'] = recSchedule;
    if (recStartTm !== undefined) params['recStartTm'] = recStartTm;
    if (schedule !== undefined) params['schedule'] = schedule;
    if (storagePath !== undefined) params['storagePath'] = storagePath;
    if (type !== undefined) params['type'] = type;

    return this.request(apiName, info.path, params);
  }

  /**
   * Log in to the source server and retrieve information.
   */
  async loginSourceServerGetInfo(
    port?: string,
    hostname?: string,
    protocol?: boolean,
    username?: string,
    passwd?: string,
    archId?: number,
    didCode?: string,
    srcDsId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'LoginSourceDS',
    };

    if (port !== undefined) params['port'] = port;
    if (hostname !== undefined) params['hostname'] = hostname;
    if (protocol !== undefined) params['protocol'] = protocol;
    if (username !== undefined) params['username'] = username;
    if (passwd !== undefined) params['passwd'] = passwd;
    if (archId !== undefined) params['archId'] = archId;
    if (didCode !== undefined) params['didCode'] = didCode;
    if (srcDsId !== undefined) params['srcDsId'] = srcDsId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete an archive vault task.
   */
  async deleteArchiveVaultTask(
    id?: number,
    keepRec?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteTask',
    };

    if (id !== undefined) params['id'] = id;
    if (keepRec !== undefined) params['keepRec'] = keepRec;

    return this.request(apiName, info.path, params);
  }

  /**
   * List all existing archive vault tasks.
   */
  async listExistArchiveVault(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'ListTask',
    });
  }

  /**
   * Enable an archive vault task.
   */
  async enableArchiveVaultTask(
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enable',
    };

    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Disable an archive vault task.
   */
  async disableArchiveVaultTask(
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DisableTask',
    };

    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Batch edit (disable) archive vault tasks.
   */
  async disableArchiveVaultBatchEditTask(
    taskIds?: string,
    attrs?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'BatchEditTask',
    };

    if (taskIds !== undefined) params['taskIds'] = taskIds;
    if (attrs !== undefined) params['attrs'] = attrs;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the progress of a batch edit operation.
   */
  async getBatchEditProgress(
    pid?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'BatchEditProgress',
    };

    if (pid !== undefined) params['pid'] = pid;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get detailed information about batch edit progress.
   */
  async getBatchEditProgressInfo(
    pid?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetBatchEditProgress',
    };

    if (pid !== undefined) params['pid'] = pid;

    return this.request(apiName, info.path, params);
  }

  /**
   * Clean up batch edit progress data.
   */
  async cleanBatchEditProgressData(
    pid?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Archiving.Pull';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'BatchEditProgressDone',
    };

    if (pid !== undefined) params['pid'] = pid;

    return this.request(apiName, info.path, params);
  }

  // ==================== YouTube Live ====================

  /**
   * Get the current YouTube Live broadcast settings.
   */
  async getYoutubeLiveBroadcastSetting(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.YoutubeLive';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'Load',
    });
  }

  /**
   * Set YouTube Live broadcast information.
   */
  async setYoutubeLiveBroadcastInfo(
    rtmpPath?: string,
    key?: string,
    camId?: number,
    streamProfile?: number,
    liveOn?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.YoutubeLive';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Save',
    };

    if (rtmpPath !== undefined) params['rtmp_path'] = rtmpPath;
    if (key !== undefined) params['key'] = key;
    if (camId !== undefined) params['cam_id'] = camId;
    if (streamProfile !== undefined) params['stream_profile'] = streamProfile;
    if (liveOn !== undefined) params['live_on'] = liveOn;

    return this.request(apiName, info.path, params);
  }

  /**
   * Close the current YouTube Live broadcast.
   */
  async closeYoutubeLiveBroadcast(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.YoutubeLive';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'CloseLive',
    });
  }

  // ==================== IVA (Deep Video Analytics) ====================

  /**
   * Get the list of deep video analytic tasks.
   */
  async getDeepVideoAnalytic(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'ListTask',
    });
  }

  /**
   * Create or edit a Deep Video Analytics (DVA) task.
   */
  async createEditDvaTask(
    analyzeType?: number,
    actFromHost?: boolean,
    name?: string,
    cameraId?: number,
    enable?: boolean,
    enableRecording?: boolean,
    preRecTime?: number,
    postRecTime?: number,
    eventIntegration?: number,
    regionType?: number,
    detRegionCnt?: number,
    detRegion?: number,
    peopleMode?: number,
    resetCntFrequency?: number,
    resetWeekday?: number,
    resetDate?: number,
    resetTimeMinute?: number,
    resetTimeHour?: number,
    fenceDirFlag?: number,
    peopleDisplayPos?: number,
    streamProfile?: number,
    peopleEnableStayMax?: boolean,
    intrusionDetectTarget?: number,
    minObjSize?: string | number,
    minObjSizeOption?: number,
    enableMinDuration?: number,
    peopleDisplayInfo?: number,
    peopleEnter?: number,
    peopleStayMax?: number,
    peopleRegion?: string,
    peopleHintPos?: string,
    blEditMode?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveTask',
    };

    if (analyzeType !== undefined) params['analyze_type'] = analyzeType;
    if (actFromHost !== undefined) params['actFromHost'] = actFromHost;
    if (name !== undefined) params['name'] = name;
    if (cameraId !== undefined) params['camera_id'] = cameraId;
    if (enable !== undefined) params['enable'] = enable;
    if (enableRecording !== undefined) params['enable_recording'] = enableRecording;
    if (preRecTime !== undefined) params['pre_rec_time'] = preRecTime;
    if (postRecTime !== undefined) params['post_rec_time'] = postRecTime;
    if (eventIntegration !== undefined) params['event_integration'] = eventIntegration;
    if (regionType !== undefined) params['region_type'] = regionType;
    if (detRegionCnt !== undefined) params['det_region_cnt'] = detRegionCnt;
    if (detRegion !== undefined) params['det_region'] = detRegion;
    if (peopleMode !== undefined) params['people_mode'] = peopleMode;
    if (resetCntFrequency !== undefined) params['reset_cnt_frequency'] = resetCntFrequency;
    if (resetWeekday !== undefined) params['reset_weekday'] = resetWeekday;
    if (resetDate !== undefined) params['reset_date'] = resetDate;
    if (resetTimeMinute !== undefined) params['reset_time_minute'] = resetTimeMinute;
    if (resetTimeHour !== undefined) params['reset_time_hour'] = resetTimeHour;
    if (fenceDirFlag !== undefined) params['fence_dir_flag'] = fenceDirFlag;
    if (peopleDisplayPos !== undefined) params['people_display_pos'] = peopleDisplayPos;
    if (streamProfile !== undefined) params['stream_profile'] = streamProfile;
    if (peopleEnableStayMax !== undefined) params['people_enable_stay_max'] = peopleEnableStayMax;
    if (intrusionDetectTarget !== undefined) params['intrusion_detect_target'] = intrusionDetectTarget;
    if (minObjSize !== undefined) params['min_obj_size'] = minObjSize;
    if (minObjSizeOption !== undefined) params['min_obj_size_option'] = minObjSizeOption;
    if (enableMinDuration !== undefined) params['enable_min_duration'] = enableMinDuration;
    if (peopleDisplayInfo !== undefined) params['people_display_info'] = peopleDisplayInfo;
    if (peopleEnter !== undefined) params['people_enter'] = peopleEnter;
    if (peopleStayMax !== undefined) params['people_stay_max'] = peopleStayMax;
    if (peopleRegion !== undefined) params['people_region'] = peopleRegion;
    if (peopleHintPos !== undefined) params['people_hint_pos'] = peopleHintPos;
    if (blEditMode !== undefined) params['blEditMode'] = blEditMode;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete a Deep Video Analytics (DVA) task.
   */
  async deleteDvaTask(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteTask',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Enable one or more Deep Video Analytics (DVA) tasks.
   */
  async enableDvaTask(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnableTask',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Disable one or more Deep Video Analytics (DVA) tasks.
   */
  async disableDvaTask(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DisableTask',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Reset the people counting counter for a specific DVA task.
   */
  async resetCounterPeopleCountingTask(
    taskId?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ResetPplCntCounter',
    };

    if (taskId !== undefined) params['taskId'] = taskId;

    return this.request(apiName, info.path, params);
  }

  // ==================== IVA Report ====================

  /**
   * Get the count of people entering and leaving for specified DVA tasks.
   */
  async getPeopleEnterLeaveCount(
    ids?: string,
    timeStart?: string,
    timeEnd?: string,
    timezone?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Report';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetCount',
    };

    if (ids !== undefined) params['ids'] = ids;
    if (timeStart !== undefined) params['timeStart'] = timeStart;
    if (timeEnd !== undefined) params['timeEnd'] = timeEnd;
    if (timezone !== undefined) params['timezone'] = timezone;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the people count report for a specific day.
   */
  async getPeopleCountOfDay(
    ids?: string,
    interval?: number,
    intervalUnit?: number,
    timezone?: number,
    timestamp?: number,
    blOccupancy?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Report';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetReport',
    };

    if (ids !== undefined) params['ids'] = ids;
    if (interval !== undefined) params['interval'] = interval;
    if (intervalUnit !== undefined) params['intervalUnit'] = intervalUnit;
    if (timezone !== undefined) params['timezone'] = timezone;
    if (timestamp !== undefined) params['timestamp'] = timestamp;
    if (blOccupancy !== undefined) params['blOccupancy'] = blOccupancy;

    return this.request(apiName, info.path, params);
  }

  // ==================== IVA Recording ====================

  /**
   * List people counting tasks.
   */
  async listPeopleCountingTask(
    taskList?: string,
    limit?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'List',
    };

    if (taskList !== undefined) params['taskList'] = taskList;
    if (limit !== undefined) params['limit'] = limit;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete recording files associated with detection events.
   */
  async deleteRecordingFileOfDetection(
    slaveDsParam?: string,
    deleteMethod?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (slaveDsParam !== undefined) params['slaveDsParam'] = slaveDsParam;
    if (deleteMethod !== undefined) params['deleteMethod'] = deleteMethod;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get analytic result information for a specific task and frame.
   */
  async getInfoOfTaskAndFrame(
    eventId?: number,
    taskId?: number,
    blAlertEvt?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetAnalyticResult',
    };

    if (eventId !== undefined) params['eventId'] = eventId;
    if (taskId !== undefined) params['taskId'] = taskId;
    if (blAlertEvt !== undefined) params['blAlertEvt'] = blAlertEvt;

    return this.request(apiName, info.path, params);
  }

  /**
   * Lock recording files associated with detection events.
   */
  async lockRecordingFileOfDetection(
    dsId?: number,
    idList?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (dsId !== undefined) params['dsId'] = dsId;
    if (idList !== undefined) params['idList'] = idList;

    return this.request(apiName, info.path, params);
  }

  /**
   * Unlock recording files associated with detection events.
   */
  async unlockRecordingFileOfDetection(
    dsId?: number,
    idList?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.Recording';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (dsId !== undefined) params['dsId'] = dsId;
    if (idList !== undefined) params['idList'] = idList;

    return this.request(apiName, info.path, params);
  }

  // ==================== IVA TaskGroup ====================

  /**
   * Get information about people counting tasks.
   */
  async getInfoPeopleCountingTask(): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'List',
    });
  }

  /**
   * Create a new people counting task.
   */
  async createPeopleCountingTask(
    enable?: boolean,
    taskIds?: string,
    ownerDsId?: number,
    name?: string,
    peopleDisplayInfo?: string,
    peopleEnableStayMax?: number,
    resetCntFrequency?: number,
    resetDate?: number,
    resetWeekday?: number,
    resetTimeHour?: number,
    resetTimeMinute?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Create',
    };

    if (enable !== undefined) params['enable'] = enable;
    if (taskIds !== undefined) params['task_ids'] = taskIds;
    if (ownerDsId !== undefined) params['owner_ds_id'] = ownerDsId;
    if (name !== undefined) params['name'] = name;
    if (peopleDisplayInfo !== undefined) params['people_display_info'] = peopleDisplayInfo;
    if (peopleEnableStayMax !== undefined) params['people_enable_stay_max'] = peopleEnableStayMax;
    if (resetCntFrequency !== undefined) params['reset_cnt_frequency'] = resetCntFrequency;
    if (resetDate !== undefined) params['resert_date'] = resetDate;
    if (resetWeekday !== undefined) params['resert_weekday'] = resetWeekday;
    if (resetTimeHour !== undefined) params['resert_tome_hour'] = resetTimeHour;
    if (resetTimeMinute !== undefined) params['resert_tome_minute'] = resetTimeMinute;

    return this.request(apiName, info.path, params);
  }

  /**
   * Modify the settings of an existing people counting task.
   */
  async modifySettingOfPeopleCountingTask(
    enable?: boolean,
    id?: number,
    taskIds?: string,
    name?: string,
    peopleDisplayInfo?: number,
    peopleEnableMax?: number,
    resetCntFrequency?: number,
    resetDate?: number,
    resetWeekday?: number,
    resetTimeHour?: number,
    resetTimeMinute?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Edit',
    };

    if (enable !== undefined) params['enable'] = enable;
    if (id !== undefined) params['id'] = id;
    if (taskIds !== undefined) params['task_ids'] = taskIds;
    if (name !== undefined) params['name'] = name;
    if (peopleDisplayInfo !== undefined) params['people_display_info'] = peopleDisplayInfo;
    if (peopleEnableMax !== undefined) params['people_enable_max'] = peopleEnableMax;
    if (resetCntFrequency !== undefined) params['reset_cnt_frequency'] = resetCntFrequency;
    if (resetDate !== undefined) params['resert_date'] = resetDate;
    if (resetWeekday !== undefined) params['resert_weekday'] = resetWeekday;
    if (resetTimeHour !== undefined) params['resert_tome_hour'] = resetTimeHour;
    if (resetTimeMinute !== undefined) params['resert_tome_minute'] = resetTimeMinute;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete a people counting task group.
   */
  async deleteTaskGroup(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Enable people counting tasks in specified groups.
   */
  async startCountPeopleTaskInGroups(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Enable',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Disable people counting tasks in specified groups.
   */
  async stopCountPeopleTaskInGroups(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Disable',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Get the people count for a specific task group.
   */
  async getNumberCountingTaskGroup(
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetPeopleCount',
    };

    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Reset the people count for a specific IVA task group.
   */
  async lockRecordingFileResult(
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.IVA.TaskGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ResetPeopleCount',
    };

    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  // ==================== Face Detection ====================

  /**
   * Retrieve the list of face detection tasks.
   */
  async getFaceListTask(
    ids?: string,
    ownerDsId?: number,
    blOnlyEnableDs?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListTask',
    };

    if (ids !== undefined) params['ids'] = ids;
    if (ownerDsId !== undefined) params['ownerDsId'] = ownerDsId;
    if (blOnlyEnableDs !== undefined) params['blOnlyEnableDs'] = blOnlyEnableDs;

    return this.request(apiName, info.path, params);
  }

  /**
   * Create or edit a face detection task.
   */
  async createOrEditTask(
    id?: number,
    idOnRecServer?: number,
    cameraId?: number,
    cameraIdOnRec?: number,
    ownerDsId?: number,
    enable?: boolean,
    blEditMode?: boolean,
    streamProfile?: number,
    name?: string,
    similarity?: number,
    allowedColor?: number,
    allowedList?: string,
    blockedColor?: number,
    blockedList?: string,
    vipColor?: number,
    vipList?: string,
    recognizedColor?: number,
    unrecognizedColor?: number,
    deleted?: boolean,
    detRegion?: string,
    detRegionCnt?: number,
    regionType?: number,
    displayInfo?: number,
    displayType?: number,
    frameDisplayInfo?: number,
    enableMinObjSize?: boolean,
    minObjSize?: number,
    postRecTime?: number,
    preRecTime?: number,
    schedule?: string,
    scheduleOn?: boolean,
    ignoreBadQuality?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListTask',
    };

    if (id !== undefined) params['id'] = id;
    if (idOnRecServer !== undefined) params['id_on_rec_server'] = idOnRecServer;
    if (cameraId !== undefined) params['camera_id'] = cameraId;
    if (cameraIdOnRec !== undefined) params['camera_id_on_rec'] = cameraIdOnRec;
    if (ownerDsId !== undefined) params['owner_ds_id'] = ownerDsId;
    if (enable !== undefined) params['enable'] = enable;
    if (blEditMode !== undefined) params['blEditMode'] = blEditMode;
    if (streamProfile !== undefined) params['stream_profile'] = streamProfile;
    if (name !== undefined) params['name'] = name;
    if (similarity !== undefined) params['similarity'] = similarity;
    if (allowedColor !== undefined) params['allowed_color'] = allowedColor;
    if (allowedList !== undefined) params['allowed_list'] = allowedList;
    if (blockedColor !== undefined) params['blocked_color'] = blockedColor;
    if (blockedList !== undefined) params['blocked_list'] = blockedList;
    if (vipColor !== undefined) params['vip_color'] = vipColor;
    if (vipList !== undefined) params['vip_list'] = vipList;
    if (recognizedColor !== undefined) params['recognized_color'] = recognizedColor;
    if (unrecognizedColor !== undefined) params['unrecognized_color'] = unrecognizedColor;
    if (deleted !== undefined) params['deleted'] = deleted;
    if (detRegion !== undefined) params['det_region'] = detRegion;
    if (detRegionCnt !== undefined) params['det_region_cnt'] = detRegionCnt;
    if (regionType !== undefined) params['region_type'] = regionType;
    if (displayInfo !== undefined) params['display_info'] = displayInfo;
    if (displayType !== undefined) params['display_type'] = displayType;
    if (frameDisplayInfo !== undefined) params['frame_display_info'] = frameDisplayInfo;
    if (enableMinObjSize !== undefined) params['enable_min_ogj_size'] = enableMinObjSize;
    if (minObjSize !== undefined) params['min_ogj_size'] = minObjSize;
    if (postRecTime !== undefined) params['post_rec_time'] = postRecTime;
    if (preRecTime !== undefined) params['pre_rec_time'] = preRecTime;
    if (schedule !== undefined) params['schedule'] = schedule;
    if (scheduleOn !== undefined) params['scheduleOn'] = scheduleOn;
    if (ignoreBadQuality !== undefined) params['ignore_bad_quality'] = ignoreBadQuality;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete one or more face detection tasks.
   */
  async deleteFaceTask(
    ids?: string,
    keepRecording?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteTask',
    };

    if (ids !== undefined) params['ids'] = ids;
    if (keepRecording !== undefined) params['keepRecording'] = keepRecording;

    return this.request(apiName, info.path, params);
  }

  /**
   * Enable face detection tasks to start detection and recording.
   */
  async enableTaskToStartDetectionRecording(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EnableTask',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Disable face detection tasks to stop detection and recording.
   */
  async disableTaskToStopDetectionRecording(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DisableTask',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * List face detection tasks with privilege to watch.
   */
  async listTaskWithPrivilegeToWatch(
    ids?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListPlayableTsk',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Create a new face group.
   */
  async createFaceGroup(
    name?: string,
    description?: string,
    updateRegisteredFace?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CreateFaceGroup',
    };

    if (name !== undefined) params['name'] = name;
    if (description !== undefined) params['description'] = description;
    if (updateRegisteredFace !== undefined) params['update_registered_face'] = updateRegisteredFace;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete (disable) one or more face groups.
   */
  async deleteFaceGroup(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteFaceGroup',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Edit an existing face group.
   */
  async editFaceGroup(
    name?: string,
    description?: string,
    updateRegisteredFace?: string,
    id?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EditFaceGroup',
    };

    if (name !== undefined) params['name'] = name;
    if (description !== undefined) params['description'] = description;
    if (updateRegisteredFace !== undefined) params['update_registered_face'] = updateRegisteredFace;
    if (id !== undefined) params['id'] = id;

    return this.request(apiName, info.path, params);
  }

  /**
   * Retrieve the list of face groups.
   */
  async getFaceGroupList(
    idOnly?: boolean,
    filter?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListFaceGroup',
    };

    if (idOnly !== undefined) params['id_only'] = idOnly;
    if (filter !== undefined) params['filter'] = filter;

    return this.request(apiName, info.path, params);
  }

  /**
   * Count the number of face groups.
   */
  async countFaceGroups(
    filter?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountFaceGroup',
    };

    if (filter !== undefined) params['filter'] = filter;

    return this.request(apiName, info.path, params);
  }

  /**
   * Detect faces in an image.
   */
  async detectFacesImage(
    imageData?: string,
    imageSize?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DetectImageFace',
    };

    if (imageData !== undefined) params['image_data'] = imageData;
    if (imageSize !== undefined) params['image_size'] = imageSize;

    return this.request(apiName, info.path, params);
  }

  /**
   * Create a new registered face.
   */
  async createRegisteredFace(
    account?: string,
    name?: string,
    description?: string,
    imageData?: string,
    imageSize?: number,
    face?: string,
    updateFaceGroup?: string,
    capturedFaceId?: number,
    updateUnrecognizedCapturedFace?: boolean,
    appendImageData?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CreateRegisteredFace',
    };

    if (account !== undefined) params['account'] = account;
    if (name !== undefined) params['name'] = name;
    if (description !== undefined) params['description'] = description;
    if (imageData !== undefined) params['image_data'] = imageData;
    if (imageSize !== undefined) params['image_size'] = imageSize;
    if (face !== undefined) params['face'] = face;
    if (updateFaceGroup !== undefined) params['update_face_group'] = updateFaceGroup;
    if (capturedFaceId !== undefined) params['captured_face_id'] = capturedFaceId;
    if (updateUnrecognizedCapturedFace !== undefined) params['update_unrecognized_captured_face'] = updateUnrecognizedCapturedFace;
    if (appendImageData !== undefined) params['append_image_data'] = appendImageData;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete one or more registered faces.
   */
  async deleteRegisteredFace(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteRegisteredFace',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  /**
   * Edit an existing registered face.
   */
  async editRegisteredFace(
    id?: number,
    account?: string,
    name?: string,
    description?: string,
    imageData?: string,
    imageSize?: number,
    face?: string,
    updateFaceGroup?: string,
    capturedFaceId?: number,
    updateUnrecognizedCapturedFace?: boolean,
    appendImageData?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'EditRegisteredFace',
    };

    if (id !== undefined) params['id'] = id;
    if (account !== undefined) params['account'] = account;
    if (name !== undefined) params['name'] = name;
    if (description !== undefined) params['description'] = description;
    if (imageData !== undefined) params['image_data'] = imageData;
    if (imageSize !== undefined) params['image_size'] = imageSize;
    if (face !== undefined) params['face'] = face;
    if (updateFaceGroup !== undefined) params['update_face_group'] = updateFaceGroup;
    if (capturedFaceId !== undefined) params['captured_face_id'] = capturedFaceId;
    if (updateUnrecognizedCapturedFace !== undefined) params['update_unrecognized_captured_face'] = updateUnrecognizedCapturedFace;
    if (appendImageData !== undefined) params['append_image_data'] = appendImageData;

    return this.request(apiName, info.path, params);
  }

  /**
   * List registered faces.
   */
  async listRegisteredFace(
    idOnly?: boolean,
    filter?: string,
    appendImageData?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'ListRegisteredFace',
    };

    if (idOnly !== undefined) params['id_only'] = idOnly;
    if (filter !== undefined) params['filter'] = filter;
    if (appendImageData !== undefined) params['append_image_data'] = appendImageData;

    return this.request(apiName, info.path, params);
  }

  /**
   * Count the number of registered faces.
   */
  async countRegisteredFace(
    filter?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'CountRegisteredFace',
    };

    if (filter !== undefined) params['filter'] = filter;

    return this.request(apiName, info.path, params);
  }

  /**
   * Search for registered faces by keywords.
   */
  async searchRegisteredFace(
    keywords?: string,
    appendImageData?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SearchRegisteredFace',
    };

    if (keywords !== undefined) params['keywords'] = keywords;
    if (appendImageData !== undefined) params['append_image_data'] = appendImageData;

    return this.request(apiName, info.path, params);
  }

  // ==================== Face Result ====================

  /**
   * Retrieve a list of face recognition results.
   */
  async getFaceResultList(
    filter?: string,
    blIncludeSnapshot?: boolean,
    blIncludeRegisteredFace?: boolean,
    limit?: number,
    slaveDsParam?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'List',
    };

    if (filter !== undefined) params['filter'] = filter;
    if (blIncludeSnapshot !== undefined) params['blIncludeSnapshot'] = blIncludeSnapshot;
    if (blIncludeRegisteredFace !== undefined) params['blIncludeRegisteredFace'] = blIncludeRegisteredFace;
    if (limit !== undefined) params['limit'] = limit;
    if (slaveDsParam !== undefined) params['slaveDsParam'] = slaveDsParam;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete face recognition results.
   */
  async deleteFaceResult(
    filter?: string,
    slaveDsParam?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Delete',
    };

    if (filter !== undefined) params['filter'] = filter;
    if (slaveDsParam !== undefined) params['slaveDsParam'] = slaveDsParam;

    return this.request(apiName, info.path, params);
  }

  /**
   * Lock face recognition results to prevent modification or deletion.
   */
  async lockFaceResult(
    filter?: string,
    slaveDsParam?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Lock',
    };

    if (filter !== undefined) params['filter'] = filter;
    if (slaveDsParam !== undefined) params['slaveDsParam'] = slaveDsParam;

    return this.request(apiName, info.path, params);
  }

  /**
   * Unlock face recognition results to allow modification or deletion.
   */
  async unlockFaceResult(
    filter?: string,
    slaveDsParam?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Unlock',
    };

    if (filter !== undefined) params['filter'] = filter;
    if (slaveDsParam !== undefined) params['slaveDsParam'] = slaveDsParam;

    return this.request(apiName, info.path, params);
  }

  /**
   * Retrieve the recording file associated with a specific captured face.
   */
  async getRecordingFileOfFaceInfo(
    capturedFaceId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetEventInfo',
    };

    if (capturedFaceId !== undefined) params['capturedFaceId'] = capturedFaceId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Retrieve analytic results for face recognition events.
   */
  async getRecognitionFaceInformation(
    taskId?: number,
    eventId?: number,
    startTime?: number,
    endTime?: number,
    blIncludeRegisteredFace?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'GetAnalyticResult',
    };

    if (taskId !== undefined) params['taskId'] = taskId;
    if (eventId !== undefined) params['eventId'] = eventId;
    if (startTime !== undefined) params['startTime'] = startTime;
    if (endTime !== undefined) params['endTime'] = endTime;
    if (blIncludeRegisteredFace !== undefined) params['blIncludeRegisteredFace'] = blIncludeRegisteredFace;

    return this.request(apiName, info.path, params);
  }

  /**
   * Correct the result of a face recognition event by associating it with a registered face.
   */
  async correctFaceResult(
    id?: number,
    registeredFaceId?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'Correct',
    };

    if (id !== undefined) params['id'] = id;
    if (registeredFaceId !== undefined) params['registered_face_id'] = registeredFaceId;

    return this.request(apiName, info.path, params);
  }

  /**
   * Mark one or more face recognition results as strangers.
   */
  async markFaceResultAsStranger(
    ids?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Face.Result';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'MarkAsStranger',
    };

    if (ids !== undefined) params['ids'] = ids;

    return this.request(apiName, info.path, params);
  }

  // ==================== Recording Bookmark ====================

  /**
   * Add a new bookmark to a recording.
   */
  async addNewBookmark(
    id?: number,
    eventId?: number,
    cameraId?: number,
    archId?: number,
    name?: string,
    timestamp?: string | number,
    comment?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Bookmark';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'SaveBookmark',
    };

    if (id !== undefined) params['id'] = id;
    if (eventId !== undefined) params['eventId'] = eventId;
    if (cameraId !== undefined) params['cameraId'] = cameraId;
    if (archId !== undefined) params['archId'] = archId;
    if (name !== undefined) params['name'] = name;
    if (timestamp !== undefined) params['timestamp'] = timestamp;
    if (comment !== undefined) params['comment'] = comment;

    return this.request(apiName, info.path, params);
  }

  /**
   * Delete one or more bookmarks from recordings.
   */
  async deleteBookmark(
    bookmarkIds?: string,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Bookmark';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteBookmark',
    };

    if (bookmarkIds !== undefined) params['bookmarkIds'] = bookmarkIds;

    return this.request(apiName, info.path, params);
  }

  /**
   * List details of bookmarks for recordings.
   * NOTE: The original Python source uses 'DeleteBookmark' as the method name here,
   * which appears to be a bug. Preserving for compatibility.
   */
  async listBookmarkDetail(
    offset?: number,
    limit?: number,
    cameraIds?: string,
    fromTime?: number,
    toTime?: number,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.SurveillanceStation.Recording.Bookmark';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'DeleteBookmark',
    };

    if (offset !== undefined) params['offset'] = offset;
    if (limit !== undefined) params['limit'] = limit;
    if (cameraIds !== undefined) params['cameraIds'] = cameraIds;
    if (fromTime !== undefined) params['fromTime'] = fromTime;
    if (toTime !== undefined) params['toTime'] = toTime;

    return this.request(apiName, info.path, params);
  }

}
