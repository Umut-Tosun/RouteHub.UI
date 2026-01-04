import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'routes',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/routes-list/routes-list').then(m => m.RoutesListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./features/route-create/route-create').then(m => m.RouteCreateComponent)
      },
      {
        path: ':routeLink',
        loadComponent: () => import('./features/route-detail/route-detail').then(m => m.RouteDetail)
      }
    ]
  },
  {
    path: 'categories',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/categories/categories').then(m => m.CategoriesComponent)
      },
      {
        path: ':slug',
        loadComponent: () => import('./features/category-detail/category-detail').then(m => m.CategoryDetailComponent)
      }
    ]
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: ':userId',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.ContactComponent)
  }
];