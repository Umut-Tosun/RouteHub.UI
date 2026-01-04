// API'den dönen generic response yapısı
// Backend BaseResult<T> yapısına uyumlu
export interface ApiResponse<T> {
  data?: T;
  isSuccess?: boolean;
  statusCode?: number;
  errorMessages?: string[];
  messages?: Array<{ propertyName?: string; message: string }>;
}

// Pagination için
export interface PagedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}