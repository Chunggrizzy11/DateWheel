export interface Folder {
  _id: string;
  name: string;
  owner: string;
  categories: any[];
  createdAt: string;
}

export interface CreateFolderDto {
  name: string;
  owner: string;
}

export interface UpdateFolderDto {
  name?: string;
  categories?: string[];
}
