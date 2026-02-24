/**
 * Synology Universal Search API module.
 * Ported from Python synology_api/universal_search.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

export class UniversalSearch extends BaseModule {
  protected readonly application = 'Finder';

  async search(keyword: string): Promise<SynoResponse> {
    const apiName = 'SYNO.Finder.FileIndexing.Search';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const fields = [
      'SYNOMDAcquisitionMake', 'SYNOMDAcquisitionModel', 'SYNOMDAlbum',
      'SYNOMDAperture', 'SYNOMDAudioBitRate', 'SYNOMDAudioTrackNumber',
      'SYNOMDAuthors', 'SYNOMDCodecs', 'SYNOMDContentCreationDate',
      'SYNOMDContentModificationDate', 'SYNOMDCreator', 'SYNOMDDurationSecond',
      'SYNOMDExposureTimeString', 'SYNOMDExtension', 'SYNOMDFSCreationDate',
      'SYNOMDFSName', 'SYNOMDFSSize', 'SYNOMDISOSpeed', 'SYNOMDLastUsedDate',
      'SYNOMDMediaTypes', 'SYNOMDMusicalGenre', 'SYNOMDOwnerUserID',
      'SYNOMDOwnerUserName', 'SYNOMDRecordingYear', 'SYNOMDResolutionHeightDPI',
      'SYNOMDResolutionWidthDPI', 'SYNOMDTitle', 'SYNOMDVideoBitRate',
      'SYNOMDIsEncrypted',
    ];

    const searchWeightList = [
      { field: 'SYNOMDWildcard', weight: 1 },
      { field: 'SYNOMDTextContent', weight: 1 },
      { field: 'SYNOMDSearchFileName', weight: 8.5, trailing_wildcard: 'true' },
    ];

    return this.request(apiName, info.path, {
      query_serial: 1,
      indice: '[]',
      keyword,
      orig_keyword: keyword,
      criteria_list: '[]',
      from: 0,
      size: 10,
      fields: JSON.stringify(fields),
      file_type: '',
      search_weight_list: JSON.stringify(searchWeightList),
      sorter_field: 'relevance',
      sorter_direction: 'asc',
      sorter_use_nature_sort: 'false',
      sorter_show_directory_first: 'true',
      api: apiName,
      method: 'search',
      version: 1,
    });
  }
}
