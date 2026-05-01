// API 응답 공통 타입
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// 페이지네이션 응답 공통 타입
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
