/**
 * Synology Core Certificate API module.
 * Ported from Python synology_api/core_certificate.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class CoreCertificate extends BaseModule {
  protected readonly application = 'Core';

  async listCerts(): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Certificate.CRT';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: '1',
      method: 'list',
    });
  }

  async setDefaultCert(certId: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Certificate.CRT';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: '1',
      method: 'set',
      as_default: 'true',
      desc: '""',
      id: `"${certId}"`,
    });
  }

  async deleteCertificate(ids: string | string[]): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Certificate.CRT';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const idList = Array.isArray(ids) ? ids : [ids];

    return this.request(apiName, info.path, {
      version: '1',
      method: 'delete',
      ids: JSON.stringify(idList),
    });
  }

  async uploadCert(options: {
    serverKey: File | Blob;
    serverCert: File | Blob;
    caCert?: File | Blob;
    setAsDefault?: boolean;
    certId?: string;
    desc?: string;
  }): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Certificate';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const formData = new FormData();
    formData.append('key', options.serverKey);
    formData.append('cert', options.serverCert);
    if (options.caCert) {
      formData.append('inter_cert', options.caCert);
    }
    formData.append('id', options.certId ?? '');
    formData.append('desc', options.desc ?? '');
    formData.append('as_default', options.setAsDefault !== false ? 'true' : '');

    return this.uploadRequest(apiName, info.path, formData, {
      version: info.minVersion,
      method: 'import',
    });
  }

  async setCertificateForService(
    certId: string,
    serviceName = 'DSM Desktop Service',
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Core.Certificate.Service';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    // Retrieve existing certificates to find the old cert id
    const certsResponse = await this.listCerts();
    const certs = (certsResponse as unknown as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
    const certificates = (certs?.certificates ?? []) as Array<{
      id: string;
      services: Array<{ display_name: string }>;
    }>;

    let oldCertId = '';
    for (const cert of certificates) {
      for (const service of cert.services) {
        if (service.display_name === serviceName) {
          oldCertId = cert.id;
          break;
        }
      }
    }

    if (oldCertId === certId) {
      return { success: true } as SynoResponse;
    }

    const serviceData: Record<string, unknown> = {
      display_name: serviceName,
      display_name_i18n: 'common:web_desktop',
      isPkg: false,
      owner: 'root',
      service: 'default',
      subscriber: 'system',
      multiple_cert: true,
      user_setable: true,
    };

    const settings = JSON.stringify([{
      service: serviceData,
      old_id: oldCertId,
      id: certId,
    }]);

    return this.request(apiName, info.path, {
      settings,
      api: apiName,
      version: info.minVersion,
      method: 'set',
    }, { method: 'post' });
  }

  async exportCert(certId: string): Promise<ArrayBuffer> {
    const apiName = 'SYNO.Core.Certificate';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const response = await this.request(apiName, info.path, {
      version: info.minVersion,
      method: 'export',
      file: '"archive"',
      id: certId,
    }, { rawResponse: true });

    return response as unknown as ArrayBuffer;
  }
}
