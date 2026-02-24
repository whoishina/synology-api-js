/**
 * Synology DHCP Server API module.
 * Ported from Python synology_api/dhcp_server.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class DhcpServer extends BaseModule {
  protected readonly application = 'DHCPServer';

  async getGeneralInfo(ifname = 'ovs_eth0'): Promise<SynoResponse> {
    const apiName = 'SYNO.Network.DHCPServer';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      ifname,
    });
  }

  async getVendor(): Promise<SynoResponse> {
    const apiName = 'SYNO.Network.DHCPServer.Vendor';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getPxe(): Promise<SynoResponse> {
    const apiName = 'SYNO.Network.DHCPServer.PXE';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getTftp(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.TFTP';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }

  async getNetworkBond(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Bond';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getNetworkEthernet(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Network.Ethernet';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  async getDhcpClientList(ifname = 'bond0'): Promise<SynoResponse> {
    const apiName = 'SYNO.Network.DHCPServer.ClientList';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      ifname,
    });
  }

  async getDhcpReservations(ifname = 'bond0'): Promise<SynoResponse> {
    const apiName = 'SYNO.Network.DHCPServer.Reservation';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      ifname,
    });
  }
}
