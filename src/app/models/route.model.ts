export interface Stop {
  id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  orderNumber: number;
  imageUrl?: string;
  duration?: number;
}

export interface Comment {
  id: string;
  content: string;
  createdDate: Date;
  user?: UserBasicDto;
  parentCommentId?: string;
  replies?: Comment[];
}

export interface RouteDetailDto {
  id: string;
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  viewCount: number;
  thumbnailUrl?: string;
  status: number;
  stops?: Stop[];
  comments?: Comment[];
  categories?: CategoryBasicDto[];
  user?: UserBasicDto;
  stopCount: number;
  commentCount: number;
  createdDate: Date;
}

export interface CategoryBasicDto {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface UserBasicDto {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileImageUrl?: string;
}

export interface Route {
  id: string;
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  viewCount: number;
  thumbnailUrl?: string;
  status: RouteStatus;
  createdDate: Date;
  stopCount: number;
  commentCount: number;
  user?: UserBasicDto;
  categories?: CategoryBasicDto[];
}

export enum RouteStatus {
  Draft = 1,
  Active = 2,
  Archived = 3
}

export interface CreateRouteRequest {
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  thumbnailUrl?: string;
}

export interface CreateStopRequest {
  routeId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  orderNumber: number;
  address?: string;
  imageUrl?: string;
  duration?: number;
}
