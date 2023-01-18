import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthState, selectState } from 'src/app/store/auth';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private auth$ = this.authStore.select(selectState);
  public authState: AuthState | null = null;

  constructor(
    private router: Router,
    private authStore: Store<AuthState>,
  ) {
    this.auth$.subscribe(state => this.authState = state);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result: boolean = false;

    // AuthState 有 user 就可通過
    if ( this.authState && this.authState.user ) {
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
