import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { SpinRequest, SpinResult } from '../types/wheel';
import { ApiResponse } from '../types/api';

export const wheelApi = {
  spin: (data: SpinRequest) =>
    api.post<ApiResponse<SpinResult>>(ENDPOINTS.WHEEL_SPIN, data).then((res) => res.data),
};
