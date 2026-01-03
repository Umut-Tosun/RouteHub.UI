export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  createdDate: Date;
}

export interface CategoryBasicDto {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}