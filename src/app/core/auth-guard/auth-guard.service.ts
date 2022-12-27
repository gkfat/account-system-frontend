import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthState } from 'src/app/store/auth';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private tokenKey: string = environment.cookieKeys.token;

  constructor(
    private router: Router,
    private authStore: Store<AuthState>,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result: boolean = false;

    // 若 storage 有 token 就可進入，若沒有就導去登入頁
    let token = localStorage.getItem(this.tokenKey) || null;
    if ( token ) {
      result = true;
    } else {
      this.router.navigate(['/log-in']);
    }

    return result;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

}
