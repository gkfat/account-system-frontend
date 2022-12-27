import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth-guard/auth-guard.service';
import { LayoutComponent } from '../layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'log-in', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('src/app/layout/routes/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profile',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('src/app/layout/routes/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'log-in',
        loadChildren: () => import('src/app/layout/routes/log-in/log-in.module').then(m => m.LogInModule)
      },
      {
        path: 'verify',
        loadChildren: () => import('src/app/layout/routes/verify/verify.module').then(m => m.VerifyModule)
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
