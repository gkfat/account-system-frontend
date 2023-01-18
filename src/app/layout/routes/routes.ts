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
        path: 'news',
        loadChildren: () => import('src/app/layout/routes/news/news.module').then(m => m.NewsModule)
      },
      {
        path: 'user',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('src/app/layout/routes/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'gkbot-survival',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('src/app/layout/routes/gkbot-survival/gkbot-survival.module').then(m => m.GkbotSurvivalModule)
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
