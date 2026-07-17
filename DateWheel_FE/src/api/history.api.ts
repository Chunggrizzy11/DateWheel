import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { SpinHistory } from '../types/history';
import { ApiResponse } from '../types/api';

export const historyApi = {
  getAll: (owner: string) =>
    api.get<ApiResponse<SpinHistory[]>>(ENDPOINTS.HISTORIES, { params: { owner } }).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`${ENDPOINTS.HISTORIES}/${id}`).then((res) => res.data),
};
