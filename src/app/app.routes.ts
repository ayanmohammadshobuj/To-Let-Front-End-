import { Routes } from '@angular/router';
import { authGuard } from './core/authentication/auth.guard';
import { HomeComponent } from './features/home/home/home.component';
import {LoginComponent} from "./features/user/pages/login/login.component";
import {RegisterComponent} from "./features/user/pages/register/register.component";
import {loggedInGuard} from "./core/authentication/logged-in.guard";

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loggedInGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule),
    canActivate: [authGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule),
    canActivate: [authGuard]
  },
  {
    path: 'property',
    loadChildren: () => import('./features/property/property.module').then(m => m.PropertyModule),
    canActivate: [authGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./features/notification/notification.module').then(m => m.NotificationModule),
    canActivate: [authGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./features/payment/payment.module').then(m => m.PaymentModule),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/home' }
];
