export interface PageDTO<T> {
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
  content: T[];
}