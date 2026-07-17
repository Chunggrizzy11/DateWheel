import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';
import { ApiResponse } from '../types/api';

export const categoryApi = {
  getAll: (owner: string) =>
    api.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES, { params: { owner } }).then((res) => res.data),

  create: (data: CreateCategoryDto) =>
    api.post<ApiResponse<Category>>(ENDPOINTS.CATEGORIES, data).then((res) => res.data),

  update: (id: string, data: UpdateCategoryDto) =>
    api.put<ApiResponse<Category>>(`${ENDPOINTS.CATEGORIES}/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`${ENDPOINTS.CATEGORIES}/${id}`).then((res) => res.data),
};
