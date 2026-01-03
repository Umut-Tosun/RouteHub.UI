import { CategoryBasicDto } from './category.model';
import { UserBasicDto } from './user.model';

export enum RouteStatus {
  Draft = 1,
  Active = 2,
  Archived = 3
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
}

export interface RouteBasicDto {
  id: string;
  title: string;
  routeLink: string;
  thumbnailUrl?: string;
  viewCount: number;
  status: RouteStatus;
}

export interface RouteDetailDto {
  id: string;
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  viewCount: number;
  thumbnailUrl?: string;
  status: RouteStatus;
  createdDate: Date;
  user?: UserBasicDto;
  categories?: CategoryBasicDto[];
  stopCount: number;
  commentCount: number;
}

export interface CreateRouteRequest {
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  thumbnailUrl?: string;
  categoryIds: string[];
}

export interface UpdateRouteRequest {
  id: string;
  title: string;
  description?: string;
  routeLink: string;
  isPublic: boolean;
  thumbnailUrl?: string;
  status: RouteStatus;
  categoryIds: string[];
}