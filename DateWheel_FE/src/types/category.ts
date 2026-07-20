export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  purchaseUrl?: string;
  owner: string;
  itemCount?: number;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
  purchaseUrl?: string;
  owner: string;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  color?: string;
  purchaseUrl?: string;
}
