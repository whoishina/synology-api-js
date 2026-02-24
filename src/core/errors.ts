/**
 * Exception hierarchy for Synology API errors.
 * Ported from Python synology_api/exceptions.py
 */
import {
  errorCodes,
  authErrorCodes,
  downloadStationErrorCodes,
  fileStationErrorCodes,
  virtualizationErrorCodes,
  iscsiLunErrorCodes,
  iscsiTargetErrorCodes,
  coreErrorCodes,
} from './error-codes.ts';

// ─── Base exceptions ───────────────────────────────────────────────

/**
 * Base class for all Synology API errors.
 */
export class SynoBaseError extends Error {
  readonly errorMessage: string;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'SynoBaseError';
    this.errorMessage = errorMessage;
  }
}

/**
 * Raised when a network connection error occurs.
 */
export class SynoConnectionError extends SynoBaseError {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'SynoConnectionError';
  }
}

/**
 * Raised when an HTTP error status is returned.
 */
export class SynoHttpError extends SynoBaseError {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'SynoHttpError';
  }
}

/**
 * Raised when the server response cannot be parsed as JSON.
 */
export class SynoJsonDecodeError extends SynoBaseError {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'SynoJsonDecodeError';
  }
}

// ─── API error code exceptions ─────────────────────────────────────

/**
 * Base class for errors derived from API response error codes.
 */
export class SynoApiError extends SynoBaseError {
  readonly errorCode: number;

  constructor(errorCode: number, errorMessage: string) {
    super(errorMessage);
    this.name = 'SynoApiError';
    this.errorCode = errorCode;
  }
}

/**
 * Resolve an error message from common codes, then domain-specific codes.
 */
function resolveMessage(
  errorCode: number,
  domainCodes: Readonly<Record<number, string>> | undefined,
  fallbackLabel: string,
): string {
  const common = errorCodes[errorCode];
  if (common !== undefined) return common;
  if (domainCodes) {
    const domain = domainCodes[errorCode];
    if (domain !== undefined) return domain;
  }
  return `${fallbackLabel} Error: ${errorCode}`;
}

// ─── Concrete error classes ────────────────────────────────────────

export class LoginError extends SynoApiError {
  constructor(errorCode: number) {
    // Login: check common first, then auth-specific
    const msg = errorCodes[errorCode] ?? authErrorCodes[errorCode] ?? `Login Error: ${errorCode}`;
    super(errorCode, msg);
    this.name = 'LoginError';
  }
}

export class LogoutError extends SynoApiError {
  constructor(errorCode: number) {
    const msg = errorCodes[errorCode] ?? authErrorCodes[errorCode] ?? `Logout Error: ${errorCode}`;
    super(errorCode, msg);
    this.name = 'LogoutError';
  }
}

export class DownloadStationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, downloadStationErrorCodes, 'DownloadStation'));
    this.name = 'DownloadStationError';
  }
}

export class FileStationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, fileStationErrorCodes, 'FileStation'));
    this.name = 'FileStationError';
  }
}

export class VirtualizationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, virtualizationErrorCodes, 'Virtualization'));
    this.name = 'VirtualizationError';
  }
}

export class LunError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, iscsiLunErrorCodes, 'ISCSI.Lun'));
    this.name = 'LunError';
  }
}

export class TargetError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, iscsiTargetErrorCodes, 'ISCSI.Target'));
    this.name = 'TargetError';
  }
}

export class AudioStationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'AudioStation'));
    this.name = 'AudioStationError';
  }
}

export class ActiveBackupError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'ActiveBackup'));
    this.name = 'ActiveBackupError';
  }
}

export class ActiveBackupMicrosoftError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'ActiveBackupMicrosoft'));
    this.name = 'ActiveBackupMicrosoftError';
  }
}

export class BackupError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'Backup'));
    this.name = 'BackupError';
  }
}

export class CertificateError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'Certificate'));
    this.name = 'CertificateError';
  }
}

export class CloudSyncError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'CloudSync'));
    this.name = 'CloudSyncError';
  }
}

export class DHCPServerError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'DHCPServer'));
    this.name = 'DHCPServerError';
  }
}

export class DirectoryServerError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'DirectoryServer'));
    this.name = 'DirectoryServerError';
  }
}

export class DockerError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'Docker'));
    this.name = 'DockerError';
  }
}

export class DriveAdminError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'DriveAdmin'));
    this.name = 'DriveAdminError';
  }
}

export class LogCenterError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'LogCenter'));
    this.name = 'LogCenterError';
  }
}

export class NoteStationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'NoteStation'));
    this.name = 'NoteStationError';
  }
}

export class OAuthError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'OAuth'));
    this.name = 'OAuthError';
  }
}

export class PhotosError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'Photos'));
    this.name = 'PhotosError';
  }
}

export class SecurityAdvisorError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'SecurityAdvisor'));
    this.name = 'SecurityAdvisorError';
  }
}

export class TaskSchedulerError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'TaskScheduler'));
    this.name = 'TaskSchedulerError';
  }
}

export class EventSchedulerError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'EventScheduler'));
    this.name = 'EventSchedulerError';
  }
}

export class UniversalSearchError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'UniversalSearch'));
    this.name = 'UniversalSearchError';
  }
}

export class USBCopyError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'USBCopy'));
    this.name = 'USBCopyError';
  }
}

export class VPNError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'VPN'));
    this.name = 'VPNError';
  }
}

export class CoreError extends SynoApiError {
  constructor(errorCode: number) {
    const msg = coreErrorCodes[errorCode] ?? `Core Error: ${errorCode}`;
    super(errorCode, msg);
    this.name = 'CoreError';
  }
}

export class CoreSysInfoError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'CoreSysInfo'));
    this.name = 'CoreSysInfoError';
  }
}

export class SurveillanceStationError extends SynoApiError {
  constructor(errorCode: number) {
    super(errorCode, resolveMessage(errorCode, undefined, 'SurveillanceStation'));
    this.name = 'SurveillanceStationError';
  }
}

export class UndefinedError extends SynoApiError {
  readonly apiName: string;

  constructor(errorCode: number, apiName: string) {
    super(errorCode, `Undefined Error: API: ${apiName}, Code: ${errorCode}`);
    this.name = 'UndefinedError';
    this.apiName = apiName;
  }
}

// ─── Error dispatcher ──────────────────────────────────────────────

/**
 * Dispatch the correct error class based on the API name.
 * Mirrors the Python auth.py request_data error dispatch logic.
 */
export function dispatchApiError(errorCode: number, apiName: string): SynoApiError {
  if (apiName.includes('DownloadStation')) return new DownloadStationError(errorCode);
  if (apiName.includes('FileStation')) return new FileStationError(errorCode);
  if (apiName.includes('AudioStation')) return new AudioStationError(errorCode);
  if (apiName.includes('ActiveBackupOffice365')) return new ActiveBackupMicrosoftError(errorCode);
  if (apiName.includes('ActiveBackup')) return new ActiveBackupError(errorCode);
  if (apiName.includes('Virtualization')) return new VirtualizationError(errorCode);
  if (apiName.includes('SYNO.Backup')) return new BackupError(errorCode);
  if (apiName.includes('CloudSync')) return new CloudSyncError(errorCode);
  if (apiName.includes('Core.Certificate')) return new CertificateError(errorCode);
  if (apiName.includes('DHCPServer') || apiName === 'SYNO.Core.TFTP') return new DHCPServerError(errorCode);
  if (apiName.includes('ActiveDirectory') || apiName === 'SYNO.Auth.ForgotPwd' || apiName === 'SYNO.Entry.Request') return new DirectoryServerError(errorCode);
  if (apiName.includes('Docker')) return new DockerError(errorCode);
  if (apiName.includes('SynologyDrive') || apiName === 'SYNO.C2FS.Share') return new DriveAdminError(errorCode);
  if (apiName.includes('LogCenter')) return new LogCenterError(errorCode);
  if (apiName.includes('NoteStation')) return new NoteStationError(errorCode);
  if (apiName.includes('SYNO.OAUTH')) return new OAuthError(errorCode);
  if (apiName.includes('SYNO.Foto')) return new PhotosError(errorCode);
  if (apiName.includes('SecurityAdvisor')) return new SecurityAdvisorError(errorCode);
  if (apiName.includes('SYNO.Core.TaskScheduler')) return new TaskSchedulerError(errorCode);
  if (apiName.includes('SYNO.Core.EventScheduler')) return new EventSchedulerError(errorCode);
  if (apiName.includes('SYNO.Core.ISCSI.LUN')) return new LunError(errorCode);
  if (apiName.includes('SYNO.Core.ISCSI.Target')) return new TargetError(errorCode);
  if (apiName.includes('SYNO.Finder')) return new UniversalSearchError(errorCode);
  if (apiName.includes('SYNO.USBCopy')) return new USBCopyError(errorCode);
  if (apiName.includes('VPNServer')) return new VPNError(errorCode);
  if (apiName.includes('SurveillanceStation')) return new SurveillanceStationError(errorCode);
  if (apiName.includes('SYNO.Core')) return new CoreError(errorCode);
  if (apiName.includes('SYNO.Storage')) return new CoreSysInfoError(errorCode);
  if (apiName.includes('SYNO.ResourceMonitor')) return new CoreSysInfoError(errorCode);
  if (['SYNO.Backup.Service.NetworkBackup', 'SYNO.Finder.FileIndexing.Status', 'SYNO.S2S.Server.Pair'].includes(apiName)) {
    return new CoreSysInfoError(errorCode);
  }
  return new UndefinedError(errorCode, apiName);
}

/**
 * Get a human-readable error message for a code + API name.
 */
export function getErrorMessage(code: number, apiName: string): string {
  const common = errorCodes[code];
  if (common !== undefined) return `Error ${code} - ${common}`;

  if (apiName === 'Auth') {
    const msg = authErrorCodes[code] ?? '<Undefined.Auth.Error>';
    return `Error ${code} - ${msg}`;
  }
  if (apiName.includes('DownloadStation')) {
    const msg = downloadStationErrorCodes[code] ?? '<Undefined.DownloadStation.Error>';
    return `Error ${code} - ${msg}`;
  }
  if (apiName.includes('Virtualization')) {
    const msg = virtualizationErrorCodes[code] ?? '<Undefined.Virtualization.Error>';
    return `Error ${code} - ${msg}`;
  }
  if (apiName.includes('FileStation')) {
    const msg = fileStationErrorCodes[code] ?? '<Undefined.FileStation.Error>';
    return `Error ${code} - ${msg}`;
  }
  if (apiName.includes('SYNO.Core.ISCSI.LUN')) {
    const msg = iscsiLunErrorCodes[code] ?? '<Undefined.ISCSI.LUN.Error>';
    return `Error ${code} - ${msg}`;
  }
  if (apiName.includes('SYNO.Core.ISCSI.Target')) {
    const msg = iscsiTargetErrorCodes[code] ?? '<Undefined.ISCSI.Target.Error>';
    return `Error ${code} - ${msg}`;
  }
  return `Error ${code} - <Undefined.${apiName}.Error>`;
}
