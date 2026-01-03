// API'den dönen generic response yapısı
export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  statusCode: number;
  errorMessages: string[];
}

// Pagination için
export interface PagedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}