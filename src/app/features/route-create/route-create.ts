import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { RouteService } from '../../core/services/route';
import { StopService } from '../../core/services/stop';
import { CategoryService } from '../../core/services/category';
import { AuthService } from '../../core/services/auth.service';
import { Category } from '../../models/category.model';
import { CreateRouteRequest, CreateStopRequest } from '../../models/route.model';

interface StopFormData {
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  orderNumber: number;
}

@Component({
  selector: 'app-route-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-create.html',
  styleUrl: './route-create.css'
})
export class RouteCreateComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private stopService = inject(StopService);
  private categoryService = inject(CategoryService);
  authService = inject(AuthService);
  private router = inject(Router);

  routeForm: FormGroup;
  categories = signal<Category[]>([]);
  selectedCategories = signal<string[]>([]);
  stops = signal<StopFormData[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  constructor() {
    this.routeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isPublic: [true],
      thumbnailUrl: ['']
    });
  }

  ngOnInit(): void {
    // Giriş yapmadan da rota oluşturabilir
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.categories.set(response.data);
        }
      }
    });
  }

  initMap(): void {
    const mapElement = document.getElementById('route-create-map');
    if (!mapElement) return;

    this.map = L.map('route-create-map').setView([41.008, 28.978], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.addStopFromMap(e.latlng.lat, e.latlng.lng);
    });
  }

  toggleCategory(categoryId: string): void {
    const selected = this.selectedCategories();
    if (selected.includes(categoryId)) {
      this.selectedCategories.set(selected.filter(id => id !== categoryId));
    } else {
      this.selectedCategories.set([...selected, categoryId]);
    }
  }

  addStopFromMap(lat: number, lng: number): void {
    const orderNumber = this.stops().length + 1;
    const newStop: StopFormData = {
      title: `Durak ${orderNumber}`,
      latitude: lat,
      longitude: lng,
      orderNumber: orderNumber
    };

    this.stops.set([...this.stops(), newStop]);
    this.addMarkerToMap(lat, lng, orderNumber);
    this.updateMapBounds();
  }

  addMarkerToMap(lat: number, lng: number, orderNumber: number, skipPolyline: boolean = false): void {
    if (!this.map) return;

    const totalStops = this.stops().length;
    let color = '#3c83f6';
    if (orderNumber === 1) color = '#22c55e';
    if (orderNumber === totalStops && totalStops > 1) color = '#ef4444';

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${orderNumber}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([lat, lng], { icon }).addTo(this.map);
    this.markers.push(marker);
    
    if (!skipPolyline) {
      this.redrawPolyline();
    }
  }

  redrawPolyline(): void {
    if (!this.map) return;

    // Remove existing polylines
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        this.map?.removeLayer(layer);
      }
    });

    // Draw new polyline if we have at least 2 stops
    const stops = this.stops();
    if (stops.length > 1) {
      const coordinates: [number, number][] = stops.map(s => [s.latitude, s.longitude]);
      L.polyline(coordinates, {
        color: '#3c83f6',
        weight: 4,
        opacity: 0.7
      }).addTo(this.map);
    }
  }

  updateMapBounds(): void {
    if (!this.map || this.stops().length === 0) return;

    const coordinates: [number, number][] = this.stops().map(s => [s.latitude, s.longitude]);
    this.map.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50] });
  }

  removeStop(index: number): void {
    // Remove marker
    if (this.markers[index]) {
      this.map?.removeLayer(this.markers[index]);
      this.markers.splice(index, 1);
    }

    const updatedStops = this.stops().filter((_, i) => i !== index);
    updatedStops.forEach((stop, i) => {
      stop.orderNumber = i + 1;
    });
    this.stops.set(updatedStops);

    // Redraw all markers with new order numbers
    this.redrawAllMarkers();
    this.redrawPolyline();
  }

  redrawAllMarkers(): void {
    if (!this.map) return;

    // Remove all markers
    this.markers.forEach(marker => this.map?.removeLayer(marker));
    this.markers = [];

    // Add all markers again with correct colors
    const stops = this.stops();
    stops.forEach((stop, index) => {
      this.addMarkerToMap(stop.latitude, stop.longitude, stop.orderNumber, index < stops.length - 1);
    });
    this.redrawPolyline();
  }

  updateStopTitle(index: number, title: string): void {
    const stops = this.stops();
    stops[index].title = title;
    this.stops.set([...stops]);
  }

  generateRouteLink(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onSubmit(): void {
    if (this.routeForm.invalid || this.stops().length === 0) {
      this.routeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.routeForm.value;
    const routeLink = this.generateRouteLink(formValue.title);

    const routeData: CreateRouteRequest = {
      title: formValue.title,
      description: formValue.description || undefined,
      routeLink: routeLink,
      isPublic: formValue.isPublic,
      thumbnailUrl: formValue.thumbnailUrl || undefined
    };

    this.routeService.create(routeData).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          const routeId = (response.data as any).id || (response.data as any).data?.id;
          if (routeId) {
            this.createStops(routeId);
          } else {
            // If route ID not in response, try to get route by link
            this.routeService.getByLink(routeLink).subscribe({
              next: (routeResponse) => {
                if (routeResponse.isSuccess && routeResponse.data) {
                  this.createStops(routeResponse.data.id);
                }
              }
            });
          }
        } else {
          this.isSubmitting.set(false);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/routes']);
  }

  createStops(routeId: string): void {
    const stops = this.stops();
    if (stops.length === 0) {
      this.isSubmitting.set(false);
      this.router.navigate(['/routes', this.generateRouteLink(this.routeForm.value.title)]);
      return;
    }

    let completed = 0;
    stops.forEach((stop, index) => {
      const stopData: CreateStopRequest = {
        routeId: routeId,
        title: stop.title,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        orderNumber: stop.orderNumber
      };

      this.stopService.create(stopData).subscribe({
        next: () => {
          completed++;
          if (completed === stops.length) {
            this.isSubmitting.set(false);
            this.router.navigate(['/routes', this.generateRouteLink(this.routeForm.value.title)]);
          }
        },
        error: () => {
          completed++;
          if (completed === stops.length) {
            this.isSubmitting.set(false);
            this.router.navigate(['/routes', this.generateRouteLink(this.routeForm.value.title)]);
          }
        }
      });
    });
  }
}

