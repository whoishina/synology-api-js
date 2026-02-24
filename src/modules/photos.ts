/**
 * Synology Photos API module.
 * Ported from Python synology_api/photos.py
 */
import { BaseModule } from './base-module.ts';
import type { SynoResponse } from '../types/api-info.ts';

/** Folder entry returned by the Photos browse API. */
interface FolderEntry {
  readonly id: number;
  readonly name: string;
}

/** Data shape for folder list responses. */
interface FolderListData {
  readonly list: FolderEntry[];
}

/** Data shape for folder count responses. */
interface FolderCountData {
  readonly count: number;
}

/** Data shape for user info responses. */
interface UserInfoData {
  readonly id: number;
}

/** Data shape for share set_shared responses. */
interface ShareData {
  readonly passphrase: string;
}

export class Photos extends BaseModule {
  protected readonly application = 'Foto';

  private cachedUserInfo: SynoResponse<UserInfoData> | null = null;

  /**
   * Retrieve user information for the current session.
   * Caches the result after the first call.
   */
  async getUserinfo(): Promise<SynoResponse<UserInfoData>> {
    if (this.cachedUserInfo !== null) {
      return this.cachedUserInfo;
    }

    const apiName = 'SYNO.Foto.UserInfo';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    this.cachedUserInfo = await this.request<UserInfoData>(apiName, info.path, {
      version: info.maxVersion,
      method: 'me',
    });

    return this.cachedUserInfo;
  }

  /**
   * Retrieve information about a specific folder.
   */
  async getFolder(folderId = 0): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Browse.Folder';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      id: folderId,
    });
  }

  /**
   * List folders in Personal Space.
   */
  async listFolders(
    folderId = 0,
    limit = 1000,
    offset = 0,
    additional: string[] = [],
  ): Promise<SynoResponse<FolderListData>> {
    const apiName = 'SYNO.Foto.Browse.Folder';
    return this.listFoldersInternal(folderId, limit, offset, additional, apiName);
  }

  /**
   * List folders in Team Space.
   */
  async listTeamsFolders(
    folderId = 0,
    limit = 2000,
    offset = 0,
    additional: string[] = [],
  ): Promise<SynoResponse<FolderListData>> {
    const apiName = 'SYNO.FotoTeam.Browse.Folder';
    return this.listFoldersInternal(folderId, limit, offset, additional, apiName);
  }

  /**
   * Internal method to list folders.
   */
  private async listFoldersInternal(
    folderId: number,
    limit: number,
    offset: number,
    additional: string[],
    apiName: string,
  ): Promise<SynoResponse<FolderListData>> {
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request<FolderListData>(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      id: folderId,
      limit,
      offset,
      additional: JSON.stringify(additional),
    });
  }

  /**
   * Count folders in Personal Space.
   */
  async countFolders(folderId = 0): Promise<SynoResponse<FolderCountData>> {
    const apiName = 'SYNO.Foto.Browse.Folder';
    return this.countFoldersInternal(folderId, apiName);
  }

  /**
   * Count folders in Team Space.
   */
  async countTeamFolders(folderId = 0): Promise<SynoResponse<FolderCountData>> {
    const apiName = 'SYNO.FotoTeam.Browse.Folder';
    return this.countFoldersInternal(folderId, apiName);
  }

  /**
   * Internal method to count folders.
   */
  private async countFoldersInternal(
    folderId: number,
    apiName: string,
  ): Promise<SynoResponse<FolderCountData>> {
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request<FolderCountData>(apiName, info.path, {
      version: info.maxVersion,
      method: 'count',
      id: folderId,
    });
  }

  /**
   * Lookup a folder by path in Personal Space.
   * Returns the matching folder entry or undefined if not found.
   */
  async lookupFolder(path: string): Promise<FolderEntry | undefined> {
    return this.lookupFolderInternal(
      path,
      'SYNO.Foto.Browse.Folder',
      'SYNO.Foto.Browse.Folder',
    );
  }

  /**
   * Lookup a folder by path in Team Space.
   * Returns the matching folder entry or undefined if not found.
   */
  async lookupTeamFolder(path: string): Promise<FolderEntry | undefined> {
    return this.lookupFolderInternal(
      path,
      'SYNO.FotoTeam.Browse.Folder',
      'SYNO.FotoTeam.Browse.Folder',
    );
  }

  /**
   * Internal method to lookup a folder by navigating path segments.
   */
  private async lookupFolderInternal(
    path: string,
    apiNameCount: string,
    apiNameList: string,
  ): Promise<FolderEntry | undefined> {
    let parent = 0;
    let foundPath = '';
    let folder: FolderEntry | undefined;

    const parts = path.replace(/^\/+|\/+$/g, '').split('/');

    for (const part of parts) {
      const countResponse = await this.countFoldersInternal(parent, apiNameCount);
      if (!countResponse.success || !countResponse.data) {
        return undefined;
      }

      const count = countResponse.data.count;
      let matched = false;

      for (let offsetVal = 0; offsetVal < count; offsetVal += 1000) {
        const foldersResponse = await this.listFoldersInternal(
          parent,
          1000,
          offsetVal,
          [],
          apiNameList,
        );
        if (!foldersResponse.success || !foldersResponse.data) {
          return undefined;
        }

        const targetName = `${foundPath}/${part}`;
        const match = foldersResponse.data.list.find(
          (entry) => entry.name === targetName,
        );

        if (match) {
          parent = match.id;
          foundPath = match.name;
          folder = match;
          matched = true;
          break;
        }
      }

      // Python for/else: if inner loop did not break, return undefined
      if (!matched) {
        return undefined;
      }
    }

    return folder;
  }

  /**
   * Retrieve information about a specific album.
   */
  async getAlbum(
    albumId: string | string[],
    additional: string[] = [],
  ): Promise<SynoResponse> {
    const ids = Array.isArray(albumId) ? albumId : [albumId];

    const apiName = 'SYNO.Foto.Browse.Album';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
      id: JSON.stringify(ids),
      additional: JSON.stringify(additional),
    });
  }

  /**
   * List albums.
   */
  async listAlbums(offset = 0, limit = 100): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Browse.Album';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
    });
  }

  /**
   * Suggest album conditions based on a keyword.
   */
  async suggestCondition(
    keyword: string,
    condition: string[] = ['general_tag'],
    userId?: number,
  ): Promise<SynoResponse> {
    let resolvedUserId = userId;
    if (resolvedUserId === undefined) {
      const userInfo = await this.getUserinfo();
      if (!userInfo.data) {
        throw new Error('Failed to retrieve user info for suggestCondition');
      }
      resolvedUserId = userInfo.data.id;
    }

    const apiName = 'SYNO.Foto.Browse.ConditionAlbum';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'suggest',
      user_id: resolvedUserId,
      keyword,
      condition: JSON.stringify(condition),
    });
  }

  /**
   * Create a new album with the specified condition.
   */
  async createAlbum(
    name: string,
    condition: string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Browse.ConditionAlbum';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'create',
      name: `"${name}"`,
      condition: JSON.stringify(condition),
    });
  }

  /**
   * Delete an album (or multiple albums) by ID.
   */
  async deleteAlbum(albumId: string | string[]): Promise<SynoResponse> {
    const ids = Array.isArray(albumId) ? albumId : [albumId];

    const apiName = 'SYNO.Foto.Browse.Album';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'delete',
      id: JSON.stringify(ids),
    });
  }

  /**
   * Set the condition for an album.
   */
  async setAlbumCondition(
    folderId: number,
    condition: string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Browse.ConditionAlbum';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'set_condition',
      id: folderId,
      condition: JSON.stringify(condition),
    });
  }

  /**
   * Share an album with specified permissions.
   */
  async shareAlbum(
    albumId: string,
    permission?: string | string[],
    enabled = true,
    expiration: number | string = 0,
  ): Promise<SynoResponse | undefined> {
    const apiName = 'SYNO.Foto.Sharing.Passphrase';
    return this.shareInternal(apiName, 'album', permission, expiration, {
      album_id: albumId,
      enabled,
    });
  }

  /**
   * Share a team folder with specified permissions.
   */
  async shareTeamFolder(
    folderId: number,
    permission?: string,
    enabled = true,
    expiration: number | string = 0,
  ): Promise<SynoResponse | undefined> {
    const apiName = 'SYNO.FotoTeam.Sharing.Passphrase';
    return this.shareInternal(apiName, 'folder', permission, expiration, {
      folder_id: folderId,
      enabled,
    });
  }

  /**
   * Internal method to share an album or folder.
   * First sets shared state, then optionally updates permission and expiration.
   */
  private async shareInternal(
    apiName: string,
    policy: string,
    permission: string | string[] | undefined,
    expiration: number | string,
    extraParams: Record<string, unknown>,
  ): Promise<SynoResponse | undefined> {
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const sharedResponse = await this.request<ShareData>(apiName, info.path, {
      version: info.maxVersion,
      method: 'set_shared',
      policy,
      ...extraParams,
    });

    if (!sharedResponse.success) {
      return undefined;
    }

    if (!permission) {
      return sharedResponse;
    }

    const passphrase = sharedResponse.data?.passphrase;

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'update',
      passphrase,
      expiration,
      permission: JSON.stringify(permission),
    });
  }

  /**
   * List users and groups that can be shared with.
   */
  async listShareableUsersAndGroups(
    teamSpaceSharableList = false,
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Sharing.Misc';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list_user_group',
      team_space_sharable_list: teamSpaceSharableList,
    });
  }

  /**
   * List all items in folders in Personal Space.
   *
   * @param offset - Number of items to skip.
   * @param limit - Maximum items to return. 0 means all.
   * @param folderId - Folder ID to list items from.
   * @param sortBy - Sort field: 'filename', 'filesize', 'takentime', 'item_type'.
   * @param sortDirection - Sort direction: 'asc' or 'desc'.
   * @param type - Item type filter: 'photo', 'video', 'live'.
   * @param passphrase - Passphrase for a shared album.
   * @param additional - Additional fields to include.
   */
  async listItemInFolders(
    offset = 0,
    limit = 0,
    folderId = 0,
    sortBy = 'filename',
    sortDirection: 'asc' | 'desc' = 'desc',
    type?: string,
    passphrase?: string,
    additional?: string[],
  ): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Browse.Item';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    const params: Record<string, unknown> = {
      version: info.maxVersion,
      method: 'list',
      offset,
      limit,
      folder_id: folderId,
      sort_by: sortBy,
      sort_direction: sortDirection,
    };

    if (type !== undefined) {
      params.type = type;
    }
    if (passphrase !== undefined) {
      params.passphrase = passphrase;
    }
    if (additional !== undefined) {
      params.additional = additional;
    }

    return this.request(apiName, info.path, params);
  }

  /**
   * List available search filters.
   */
  async listSearchFilters(): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Search.Filter';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'list',
    });
  }

  /**
   * Retrieve guest settings for Photos.
   */
  async getGuestSettings(): Promise<SynoResponse> {
    const apiName = 'SYNO.Foto.Setting.Guest';
    const info = this.getApiInfo(apiName);
    if (!info) throw new Error(`API ${apiName} not found`);

    return this.request(apiName, info.path, {
      version: info.maxVersion,
      method: 'get',
    });
  }
}
