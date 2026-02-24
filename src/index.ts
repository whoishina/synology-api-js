// Core
export { SynoClient } from './core/client.ts';
export { BaseModule } from './modules/base-module.ts';

// Errors
export {
  SynoBaseError,
  SynoConnectionError,
  SynoHttpError,
  SynoJsonDecodeError,
  SynoApiError,
  LoginError,
  LogoutError,
  DownloadStationError,
  FileStationError,
  VirtualizationError,
  LunError,
  TargetError,
  AudioStationError,
  ActiveBackupError,
  ActiveBackupMicrosoftError,
  BackupError,
  CertificateError,
  CloudSyncError,
  DHCPServerError,
  DirectoryServerError,
  DockerError,
  DriveAdminError,
  LogCenterError,
  NoteStationError,
  OAuthError,
  PhotosError,
  SecurityAdvisorError,
  TaskSchedulerError,
  EventSchedulerError,
  UniversalSearchError,
  USBCopyError,
  VPNError,
  CoreError,
  CoreSysInfoError,
  SurveillanceStationError,
  UndefinedError,
  dispatchApiError,
  getErrorMessage,
} from './core/errors.ts';

// Error codes
export {
  CODE_SUCCESS,
  CODE_UNKNOWN,
  errorCodes,
  authErrorCodes,
  downloadStationErrorCodes,
  fileStationErrorCodes,
  virtualizationErrorCodes,
  calendarErrorCodes,
  surveillanceStationErrorCodes,
  iscsiLunErrorCodes,
  iscsiTargetErrorCodes,
  coreErrorCodes,
} from './core/error-codes.ts';

// Types
export type { ApiInfo, ApiListMap, SynoResponse } from './types/api-info.ts';
export type {
  ClientConfig,
  ClientEvent,
  BeforeRequestContext,
  AfterResponseContext,
  RequestOptions,
  CompoundEntry,
  BatchOptions,
} from './types/client.ts';
export type { SortDirection, PaginationOptions, FolderMeta } from './types/common.ts';

// Utils
export { validatePath, mergeDicts, makeFolderMetaListFromPath, buildUploadFormData, readLocalFile } from './core/utils.ts';

// Encryption
export { aesEncrypt } from './core/encryption/aes-cipher.ts';
export { rsaEncrypt } from './core/encryption/rsa-encrypt.ts';
export { noiseIkHandshake, decodeSsidCookie, encodeSsidCookie } from './core/encryption/noise-handshake.ts';
export { encryptParams } from './core/encryption/param-encryptor.ts';
export type { EncryptionInfo } from './core/encryption/param-encryptor.ts';

// Modules
export { CoreUser } from './modules/core-user.ts';
export { CoreGroup } from './modules/core-group.ts';
export { OAuth } from './modules/oauth.ts';
export { LogCenter } from './modules/log-center.ts';
export { SecurityAdvisor } from './modules/security-advisor.ts';
export { UniversalSearch } from './modules/universal-search.ts';
export { USBCopy } from './modules/usb-copy.ts';
export { DhcpServer } from './modules/dhcp-server.ts';
export { VPN } from './modules/vpn.ts';
export { CoreShare } from './modules/core-share.ts';
export { CoreCertificate } from './modules/core-certificate.ts';
export { CorePackage } from './modules/core-package.ts';
export { DriveAdminConsole } from './modules/drive-admin-console.ts';
export { DirectoryServer } from './modules/directory-server.ts';
export { NoteStation } from './modules/note-station.ts';
export { AudioStation } from './modules/audio-station.ts';
export { EventScheduler } from './modules/event-scheduler.ts';
export { Virtualization } from './modules/virtualization.ts';
export { DownloadStation } from './modules/download-station.ts';
export { Photos } from './modules/photos.ts';
export { Docker } from './modules/docker.ts';
export { FileStation } from './modules/file-station.ts';
export { CoreSysInfo } from './modules/core-sys-info.ts';
export { ActiveBackup } from './modules/active-backup.ts';
export { ActiveBackupMicrosoft } from './modules/abm.ts';
export { CoreBackup } from './modules/core-backup.ts';
export { CloudSync } from './modules/cloud-sync.ts';
export { Snapshot } from './modules/snapshot.ts';
export { TaskScheduler } from './modules/task-scheduler.ts';
export { CoreISCSI } from './modules/core-iscsi.ts';
export { SurveillanceStation } from './modules/surveillance-station.ts';
