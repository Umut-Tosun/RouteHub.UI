import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import * as L from 'leaflet';
import { RouteService } from '../../core/services/route';
import { AuthService } from '../../core/services/auth.service';
import { RouteDetailDto } from '../../models/route.model';


@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './route-detail.html',
  styleUrl: './route-detail.css'
})
export class RouteDetail implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private routeService = inject(RouteService);
  authService = inject(AuthService);

  routeDetail = signal<RouteDetailDto | null>(null);
  isLoading = signal<boolean>(true);
  
  private map: L.Map | null = null;

  ngOnInit(): void {
    const routeLink = this.route.snapshot.paramMap.get('routeLink');
    if (routeLink) {
      this.loadRoute(routeLink);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  loadRoute(routeLink: string): void {
    this.isLoading.set(true);
    
    this.routeService.getByLink(routeLink).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.routeDetail.set(response.data);
          this.routeService.incrementView(response.data.id).subscribe();
          setTimeout(() => this.drawStops(), 300);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  initMap(): void {
    const mapElement = document.getElementById('route-map');
    if (!mapElement) return;

    this.map = L.map('route-map').setView([41.008, 28.978], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  drawStops(): void {
    if (!this.map || !this.routeDetail()?.stops || this.routeDetail()!.stops!.length === 0) return;

    const stops = this.routeDetail()!.stops!;
    const coordinates: [number, number][] = [];

    stops.forEach((stop, index) => {
      coordinates.push([stop.latitude, stop.longitude]);

      let color = '#3c83f6';
      if (index === 0) color = '#22c55e';
      if (index === stops.length - 1) color = '#ef4444';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${stop.orderNumber}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon }).addTo(this.map!);
      marker.bindPopup(`<strong>${stop.orderNumber}. ${stop.title}</strong>`);
    });

    if (coordinates.length > 1) {
      L.polyline(coordinates, {
        color: '#3c83f6',
        weight: 4,
        opacity: 0.7
      }).addTo(this.map!);
      
      this.map!.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50] });
    }
  }
}