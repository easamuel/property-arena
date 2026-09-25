export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: boolean;
    nextPage: number;
  };
}