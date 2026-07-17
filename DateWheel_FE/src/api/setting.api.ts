import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { Settings, UpdateSettingsDto } from '../types/setting';
import { ApiResponse } from '../types/api';

export const settingApi = {
  get: (owner: string) =>
    api.get<ApiResponse<Settings>>(ENDPOINTS.SETTINGS, { params: { owner } }).then((res) => res.data),

  update: (data: UpdateSettingsDto) =>
    api.patch<ApiResponse<Settings>>(`${ENDPOINTS.SETTINGS}/${data.owner}`, data).then((res) => res.data),
};
