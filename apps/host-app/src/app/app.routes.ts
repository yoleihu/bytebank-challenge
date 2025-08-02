import { Route } from '@angular/router';
import { authGuard } from '@core/guards/auth';
import { Base } from '@pages/base/base';

export const appRoutes: Route[] = [
  // Rota inicial
  { 
    path: '', 
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  // Rotas públicas
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: '',
    component: Base,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'extract',
        loadComponent: () => import('./pages/extract/extract').then(m => m.Extract)
      },
      // Microfrontends
      {
        path: 'resume-account-mf',
        loadChildren: () =>
          import('resume-account-mf/Routes').then((m) => m.remoteRoutes),
      },
    ]
  },
  // Fallback para rotas não encontradas
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  },
  { 
    path: '**', 
    redirectTo: 'not-found'
  }
];
