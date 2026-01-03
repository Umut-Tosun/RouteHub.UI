import { Routes } from '@angular/router';


export const routes: Routes = [
  // Home
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  
 
];