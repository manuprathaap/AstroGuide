import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'AstroGuide — Unlock Your Celestial Blueprint'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Sign In — AstroGuide'
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Create Account — AstroGuide'
  },
  {
    path: 'language',
    loadComponent: () => import('./features/language/language-selection/language-selection.component').then(m => m.LanguageSelectionComponent),
    canActivate: [authGuard],
    title: 'Select Language — AstroGuide'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard — AstroGuide'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
