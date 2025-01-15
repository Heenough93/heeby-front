export type RequestData<T> = { data: T };
export type ResponseData<T> = { data: T };

export type OffsetRequestData<T> = { data: T } & PaginationInfo;
export type OffsetResponseData<T> = { data: T } & PaginationInfo;

export interface PaginationInfo {
  total: number,
  offset: number,
  limit: number,
}

export interface Post {
  id: string,
  dateAndTime: string,
  title: string,
  content: string,
}