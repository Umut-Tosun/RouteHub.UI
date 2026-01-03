import { UserBasicDto } from './user.model';

export interface Comment {
  id: string;
  routeId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  createdDate: Date;
}

export interface CommentBasicDto {
  id: string;
  content: string;
  createdDate: Date;
  user?: UserBasicDto;
}

export interface CommentDetailDto {
  id: string;
  routeId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  createdDate: Date;
  user?: UserBasicDto;
  replies?: CommentBasicDto[];
}

export interface CreateCommentRequest {
  routeId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  id: string;
  content: string;
}