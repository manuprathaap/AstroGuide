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
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [guestGuard],
    title: 'Reset Password — AstroGuide'
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [guestGuard],
    title: 'Reset Password — AstroGuide'
  },

  {
    path: 'language',
    loadComponent: () => import('./features/language/language-selection/language-selection.component').then(m => m.LanguageSelectionComponent),
    title: 'Select Language — AstroGuide'
  },
  {
    path: 'explore',
    loadComponent: () => import('./features/explore/explore.component').then(m => m.ExploreComponent),
    canActivate: [authGuard],
    title: 'Explore — AstroGuide'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard — AstroGuide'
  },
  {
    path: 'horoscope',
    loadComponent: () => import('./features/horoscope/horoscope.component').then(m => m.HoroscopeComponent),
    canActivate: [authGuard],
    title: 'Birth Chart — AstroGuide'
  },
  {
    path: 'palmistry',
    loadComponent: () => import('./features/palmistry/palmistry.component').then(m => m.PalmistryComponent),
    title: 'Palm Reading & Hastarekha Analysis — AstroGuide'
  },
  {
    path: 'palm-reading',
    redirectTo: 'palmistry',
    pathMatch: 'full'
  },
  {
    path: 'birth-details',
    loadComponent: () => import('./features/birth-details/birth-details.component').then(m => m.BirthDetailsComponent),
    canActivate: [authGuard],
    title: 'Birth Details — AstroGuide'
  },
  {
    path: 'reading/prepare',
    loadComponent: () => import('./features/reading/reading-prepare/reading-prepare.component').then(m => m.ReadingPrepareComponent),
    canActivate: [authGuard],
    title: 'Understanding Your Reading — AstroGuide'
  },
  {
    path: 'reading/question',
    loadComponent: () => import('./features/reading/reading-question/reading-question.component').then(m => m.ReadingQuestionComponent),
    canActivate: [authGuard],
    title: 'Ask Question — AstroGuide'
  },
  {
    path: 'reading/result',
    loadComponent: () => import('./features/reading/reading-result/reading-result.component').then(m => m.ReadingResultComponent),
    canActivate: [authGuard],
    title: 'Your Reading — AstroGuide'
  },
  {
    path: 'guidance',
    redirectTo: 'explore',
    pathMatch: 'full'
  },
  {
    path: 'guidance/history',
    loadComponent: () => import('./features/reading/reading-history/reading-history.component').then(m => m.ReadingHistoryComponent),
    canActivate: [authGuard],
    title: 'Guidance History — AstroGuide'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
