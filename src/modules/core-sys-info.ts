/**
 * Synology Core System Information API module.
 * Ported from Python synology_api/core_sys_info.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class CoreSysInfo extends BaseModule {
  protected readonly application = 'Core';

  // ── File Services ──────────────────────────────────────────────────

  /** Get SMB file service status. */
  async fileservSmb(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.SMB';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get AFP file service status. */
  async fileservAfp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.AFP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get NFS file service status. */
  async fileservNfs(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.NFS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get FTP file service status. */
  async fileservFtp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.FTP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get SFTP file service status. */
  async fileservSftp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.FTP.SFTP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Network & Backup ──────────────────────────────────────────────

  /** Get network backup service information. */
  async networkBackupInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Backup.Service.NetworkBackup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get bandwidth control protocol information. */
  async bandwidthControlProtocol(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.BandwidthControl.Protocol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      protocol: 'NetworkBackup',
    });
  }

  /** Get shared folders information. */
  async sharedFoldersInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Share';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── Services ──────────────────────────────────────────────────────

  /** Get status of core services. */
  async servicesStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Service';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get service discovery information. */
  async servicesDiscovery(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.ServiceDiscovery';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get file transfer status. */
  async fileTransferStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.FileTransfer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Network ───────────────────────────────────────────────────────

  /** Get network status. */
  async networkStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get DSM web status. */
  async webStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Web.DSM';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get current connection information. */
  async currentConnection(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.CurrentConnection';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get bandwidth control status. */
  async bandwidthControlStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.BandwidthControl.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── System Status ─────────────────────────────────────────────────

  /** Get system status. */
  async sysStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get latest system logs. */
  async latestLogs(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'latestlog_get',
    });
  }

  /** Get client notification settings status. */
  async clientNotifySettingsStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SyslogClient.Setting.Notify';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Security ──────────────────────────────────────────────────────

  /** Get security scan configuration. */
  async getSecurityScanInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SecurityScan.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'first_get',
    });
  }

  /** Get security scan rules. */
  async getSecurityScanRules(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SecurityScan.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      items: 'ALL',
      method: 'rule_get',
    });
  }

  /** Get security scan status. */
  async getSecurityScanStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SecurityScan.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'system_get',
    });
  }

  // ── Users & Groups ────────────────────────────────────────────────

  /** Get user list. */
  async getUserList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: '["email", "description", "expired"]',
    });
  }

  // ── QuickConnect ──────────────────────────────────────────────────

  /** Get QuickConnect configuration. */
  async quickconnectInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.QuickConnect';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_misc_config',
    });
  }

  /** Get QuickConnect permissions. */
  async quickconnectPermissions(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.QuickConnect.Permission';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Network Topology & Interfaces ─────────────────────────────────

  /** Get network topology. */
  async networkTopology(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Router.Topology';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get WiFi client information. */
  async networkWifiClient(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Wifi.Client';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get network bond information. */
  async networkBond(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Bond';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get network bridge information. */
  async networkBridge(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Bridge';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get network ethernet information. */
  async networkEthernet(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Ethernet';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get local network bridge information. */
  async networkLocalBridge(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.LocalBridge';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get USB modem information. */
  async networkUsbModem(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.USBModem';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get PPPoE information. */
  async networkPppoe(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.PPPoE';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get IPv6 tunnel information. */
  async networkIpv6tunnel(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.IPv6Tunnel';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Network VPN ───────────────────────────────────────────────────

  /** Get VPN PPTP information. */
  async networkVpnPptp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.VPN.PPTP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get OpenVPN information. */
  async networkOpenvpn(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.VPN.OpenVPN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: '["status"]',
    });
  }

  /** Get VPN L2TP information. */
  async networkVpnL2tp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.VPN.L2TP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── Directory & Domain ────────────────────────────────────────────

  /** Get domain schedule. */
  async domainSchedule(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.Domain.Schedule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get LDAP client information. */
  async clientLdap(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.LDAP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get SSO client information. */
  async clientSso(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.SSO';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Upgrade ───────────────────────────────────────────────────────

  /** Check for system upgrades. */
  async sysUpgradeCheck(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade.Server';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'check',
    });
  }

  /** Get system upgrade download progress. */
  async sysUpgradeDownload(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade.Server.Download';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'progress',
    });
  }

  /** Get system upgrade settings. */
  async sysUpgradeSetting(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Notifications ─────────────────────────────────────────────────

  /** Get SMS notification configuration. */
  async notificationSmsConf(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Notification.SMS.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get mail notification configuration. */
  async notificationMailConf(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Notification.Mail.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get push mail notification configuration. */
  async notificationPushMail(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Notification.Push.Mail';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get push notification configuration. */
  async notificationPushConf(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Notification.Push.Conf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Hardware ──────────────────────────────────────────────────────

  /** Get hardware beep control status. */
  async hardwareBeepControl(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.BeepControl';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get hardware fan speed. */
  async hardwareFanSpeed(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.FanSpeed';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Set hardware fan speed (e.g., 'quietfan', 'coolfan', 'fullfan'). */
  async setFanSpeed(fanSpeed = 'quietfan'): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.FanSpeed';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      dual_fan_speed: fanSpeed,
    });
  }

  /** Enable or disable ZRAM. */
  async enableZram(enableZram = true): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.ZRAM';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      enable_zram: String(enableZram).toLowerCase(),
    });
  }

  /** Enable power recovery options. */
  async enablePowerRecovery(
    restartAutoAfterIssue = true,
    wakeOnLan = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.PowerRecovery';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      rc_power_config: String(restartAutoAfterIssue).toLowerCase(),
      wol1: String(wakeOnLan).toLowerCase(),
    });
  }

  /** Enable or disable beep control options. */
  async enableBeepControl(
    fanFail?: boolean,
    volumeCrash?: boolean,
    poweronBeep?: boolean,
    poweroffBeep?: boolean,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.BeepControl';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      fan_fail: String(fanFail).toLowerCase(),
      volume_crash: String(volumeCrash).toLowerCase(),
      poweron_beep: String(poweronBeep).toLowerCase(),
      poweroff_beep: String(poweroffBeep).toLowerCase(),
    });
  }

  /** Set LED brightness level. */
  async setLedControl(ledBrightness = 2): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Led.Brightness';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      led_brightness: ledBrightness,
    });
  }

  /** Set hibernation idle times. */
  async setHibernation(
    internalHdIdletime = 0,
    usbIdletime = 0,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.Hibernation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      internal_hd_idletime: internalHdIdletime,
      usb_idletime: usbIdletime,
    });
  }

  /** Enable or configure external UPS. */
  async enableExternalUps(
    enable = false,
    mode = 'SLAVE',
    delayTime = 1,
    snmpAuthKeyDirty = false,
    snmpPrivacyKeyDirty = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ExternalDevice.UPS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set',
      enable: String(enable).toLowerCase(),
      mode,
      delay_time: delayTime,
      snmp_auth_key_dirty: String(snmpAuthKeyDirty).toLowerCase(),
      snmp_privacy_key_dirty: String(snmpPrivacyKeyDirty).toLowerCase(),
    });
  }

  // ── System Information ────────────────────────────────────────────

  /** Get system information. */
  async getSystemInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'info',
    });
  }

  /** Get CPU temperature. Returns the sys_temp field from system info. */
  async getCpuTemp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'info',
    });
  }

  // ── System Utilization ────────────────────────────────────────────

  /** Get all system utilization statistics. */
  async getAllSystemUtilization(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Utilization';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get CPU utilization statistics. */
  async getCpuUtilization(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Utilization';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get disk utilization statistics. */
  async getDiskUtilization(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Utilization';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get memory utilization statistics. */
  async getMemoryUtilization(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Utilization';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Power Control ─────────────────────────────────────────────────

  /** Shutdown the system. */
  async shutdown(version?: number): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: version ?? info.maxVersion,
      method: 'shutdown',
    });
  }

  /** Reboot the system. */
  async reboot(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'reboot',
    });
  }

  // ── DSM ───────────────────────────────────────────────────────────

  /** Get DSM information. */
  async dsmInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.DSM.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'getinfo',
    });
  }

  /** Get network information. */
  async getNetworkInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'info',
      type: 'network',
    });
  }

  /** Get volume information. */
  async getVolumeInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'info',
      type: 'storage_v2',
    });
  }

  /** Get hardware hibernation status. */
  async hardwareHibernation(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Hardware.Hibernation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get hardware UPS status. */
  async hardwareUps(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ExternalDevice.UPS';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get terminal information. */
  async terminalInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Terminal';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get SNMP information. */
  async snmpInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.SNMP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get system process information. */
  async process(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Process';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── Storage ───────────────────────────────────────────────────────

  /** Get storage information. */
  async storage(): Promise<SynoResponse> {
    const apiName = 'SYNO.Storage.CGI.Storage';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load_info',
    });
  }

  /** Get USB storage device information. */
  async externalDeviceStorageUsb(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ExternalDevice.Storage.USB';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: ['dev_type', 'product', 'status', 'partitions'],
    });
  }

  /** Get eSATA storage device information. */
  async externalDeviceStorageEsata(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ExternalDevice.Storage.eSATA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: ['dev_type', 'status'],
    });
  }

  /** Get file indexing status. */
  async fileIndexResource(): Promise<SynoResponse> {
    const apiName = 'SYNO.Finder.FileIndexing.Status';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get CMS information. */
  async cmsInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.CMS.Info';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Port Forwarding ───────────────────────────────────────────────

  /** Get port forwarding rules. */
  async portForwardingRules(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.PortForwarding.Rules';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
    });
  }

  /** Get port forwarding router configuration. */
  async portForwardingRouterConf(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.PortForwarding.RouterConf';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── Disk & HDD ────────────────────────────────────────────────────

  /** Get disk list. */
  async diskList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Polling.Data';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get HDD manager information. */
  async hddman(): Promise<SynoResponse> {
    const apiName = 'SYNO.Storage.CGI.HddMan';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── DDNS ──────────────────────────────────────────────────────────

  /** Get DDNS provider information. */
  async ddnsProviderInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.DDNS.Provider';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get DDNS record information. */
  async ddnsRecordInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.DDNS.Record';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get DDNS external IP. */
  async ddnsExternalIp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.DDNS.ExtIP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      retry: 'true',
    });
  }

  /** Get Synology DDNS information. */
  async ddnsSynology(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.DDNS.Synology';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get_myds_account',
    });
  }

  // ── iSCSI ─────────────────────────────────────────────────────────

  /** Get iSCSI LUN information. */
  async iscsiLunInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ISCSI.LUN';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── FTP Security ──────────────────────────────────────────────────

  /** Get FTP security information. */
  async ftpSecurityInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.FTP.Security';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get bandwidth control information (FTP protocol). */
  async bandwidthControlInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.BandwidthControl.Protocol';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      protocol: 'FTP',
    });
  }

  /** Get directory domain information. */
  async directoryDomainInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.Domain';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get WS transfer information. */
  async wsTransferInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.ServiceDiscovery.WSTransfer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get reflink copy information. */
  async refLinkCopyInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.ReflinkCopy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get Bonjour service information. */
  async bonjourServiceInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.ExternalDevice.Printer.BonjourSharing';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get personal photo enable status. */
  async personalPhotoEnable(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.User.Home';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get FTP chroot user information. */
  async ftpChrootUser(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileServ.FTP.ChrootUser';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'load',
    });
  }

  /** Get server pair information. */
  async serverPair(): Promise<SynoResponse> {
    const apiName = 'SYNO.S2S.Server.Pair';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional: ['sync_shares'],
    });
  }

  /** Get groups information. */
  async groupsInfo(
    offset = 0,
    limit = -1,
    nameOnly = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Group';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
      name_only: nameOnly ? 'true' : 'false',
      type: 'local',
    });
  }

  /** Get LDAP information. */
  async ldapInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.LDAP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get SSO IWA information. */
  async ssoIwaInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.SSO.IWA';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get SSO information. */
  async ssoInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Directory.SSO';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get network interface information. */
  async networkInterfaceInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Interface';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get proxy information. */
  async proxyInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Proxy';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get gateway list. */
  async gatewayList(
    ipType = 'ipv4',
    gatewayType = 'wan',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Router.Gateway.List';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      iptype: ipType,
      type: gatewayType,
    });
  }

  /** Get firewall information. */
  async firewallInfo(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Security.Firewall.Profile';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── Auto Upgrade ──────────────────────────────────────────────────

  /** Get auto upgrade status. */
  async autoUpgradeStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade.AutoUpgrade';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
    });
  }

  /** Check upgrade server with extended options. */
  async upgradeServerCheck(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade.Server';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'check',
      user_reading: 'true',
      need_auto_smallupdate: 'true',
      need_promotion: 'true',
    });
  }

  // ── Resource Monitor ──────────────────────────────────────────────

  /** Get alarm rules logs. */
  async alarmRulesLogs(): Promise<SynoResponse> {
    const apiName = 'SYNO.ResourceMonitor.Log';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset: 0,
      limit: 100,
      sort_direction: 'DESC',
      sort_by: 'time',
      mode: 'sequential',
    });
  }

  /** Get alarm rules list. */
  async alarmRulesList(): Promise<SynoResponse> {
    const apiName = 'SYNO.ResourceMonitor.EventRule';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /** Get resource monitor settings. */
  async resourceMonitorSettingsList(): Promise<SynoResponse> {
    const apiName = 'SYNO.ResourceMonitor.Setting';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  // ── File Handling ─────────────────────────────────────────────────

  /** Get file handling access information. */
  async fileHandlingAccess(
    sortDirection: 'ASC' | 'DESC' = 'ASC',
    sortBy = 'service',
    limit = 50,
    offset = 0,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.FileHandle';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      forceReload: 'true',
      action: 'enum',
      sort_direction: sortDirection,
      sort_by: sortBy,
      limit,
      offset,
    });
  }

  // ── Process Groups ────────────────────────────────────────────────

  /** Get service group list. */
  async listServiceGroup(interval = 0): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.ProcessGroup';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      node: 'xnode-3697',
      interval,
    });
  }

  /** Get process group list. */
  async listProcessGroup(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.Process';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  // ── Packages ──────────────────────────────────────────────────────

  /** Get installed package list. */
  async installedPackageList(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Package';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const additional = [
      'description',
      'description_enu',
      'dependent_packages',
      'beta',
      'distributor',
      'distributor_url',
      'maintainer',
      'maintainer_url',
      'dsm_apps',
      'dsm_app_page',
      'dsm_app_launch_name',
      'report_beta_url',
      'support_center',
      'startable',
      'installed_info',
      'support_url',
      'is_uninstall_pages',
      'install_type',
      'autoupdate',
      'silent_upgrade',
      'installing_progress',
      'ctl_uninstall',
      'updated_at',
      'status',
      'url',
      'available_operation',
    ];

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      additional,
    });
  }

  // ── Notifications ─────────────────────────────────────────────────

  /** Get active notifications. */
  async activeNotifications(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.DSMNotify';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'notify',
      action: 'load',
    });
  }

  // ── System Health ─────────────────────────────────────────────────

  /** Get system health information. */
  async getSystemHealth(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.System.SystemHealth';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  /** Get upgrade status. */
  async upgradeStatus(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Upgrade';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'status',
    });
  }
}
