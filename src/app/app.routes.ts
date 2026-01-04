import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'routes/:routeLink',
    loadComponent: () => import('./features/route-detail/route-detail').then(m => m.RouteDetail)
  }
];