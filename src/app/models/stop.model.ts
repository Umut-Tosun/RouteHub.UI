export interface Stop {
  id: string;
  routeId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  orderNumber: number;
  imageUrl?: string;
  duration?: number; // dakika cinsinden
  createdDate: Date;
}

export interface StopBasicDto {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  orderNumber: number;
}

export interface CreateStopRequest {
  routeId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  orderNumber: number;
  imageUrl?: string;
  duration?: number;
}

export interface UpdateStopRequest {
  id: string;
  routeId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  orderNumber: number;
  imageUrl?: string;
  duration?: number;
}