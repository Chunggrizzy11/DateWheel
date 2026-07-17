import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { Profile } from '../types/profile';
import { ApiResponse } from '../types/api';

export const profileApi = {
  getAll: () =>
    api.get<ApiResponse<Profile[]>>(ENDPOINTS.PROFILES).then((res) => res.data),
};
