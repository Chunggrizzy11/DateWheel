import { api } from './axios';
import { ENDPOINTS } from '../constants/api';
import { Folder, CreateFolderDto, UpdateFolderDto } from '../types/folder';
import { ApiResponse } from '../types/api';

export const folderApi = {
  getAll: (owner: string) =>
    api.get<ApiResponse<Folder[]>>(ENDPOINTS.FOLDERS, { params: { owner } }).then((res) => res.data),

  create: (data: CreateFolderDto) =>
    api.post<ApiResponse<Folder>>(ENDPOINTS.FOLDERS, data).then((res) => res.data),

  update: (id: string, data: UpdateFolderDto) =>
    api.put<ApiResponse<Folder>>(`${ENDPOINTS.FOLDERS}/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`${ENDPOINTS.FOLDERS}/${id}`).then((res) => res.data),
};
