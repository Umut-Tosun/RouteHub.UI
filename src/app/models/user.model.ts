export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profileImageUrl?: string;
  createdDate: Date;
}

export interface UserBasicDto {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileImageUrl?: string;
}

export interface GetUsersQueryResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profileImageUrl?: string;
  routeCount: number;
  commentCount: number;
}

export interface GetUserByIdQueryResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profileImageUrl?: string;
  routes?: RouteBasicDto[];
  comments?: any[];
}

export interface RouteBasicDto {
  id: string;
  title: string;
  routeLink: string;
  isPublic: boolean;
  status: number;
  viewCount: number;
  thumbnailUrl?: string;
  stopCount: number;
  commentCount: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expirationTime: Date;
  user: GetUserByIdQueryResult;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profileImageUrl?: string;
}