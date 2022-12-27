import { Users, APIResponse } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as auth from './auth.action';
import { UsersService } from 'src/app/api/users.service';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { Store } from '@ngrx/store';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';

@Injectable()
export class AuthEffects {
  private tokenKey: string = environment.cookieKeys.token;
  private accessToken: string | null = null;

  constructor(
    private actions$: Actions,
    private router: Router,
    private usersServ: UsersService,
    private spinnerState: Store<SpinnerState>,
    private errServ: ErrorHandlerService
  ) { }

  logIn$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.LogInAction>(auth.LOG_IN),
      map(action => action.payload),
      switchMap(payload => {
        this.spinnerState.dispatch(new OpenAction(''));
        return this.usersServ.LogIn(payload).pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            // TODO: 用 status code 來判斷，若為使用者未驗證則導向重發驗證信
            this.router.navigate(['/resend-verify']);
            this.errServ.HttpErrorHandle(err);
            return of();
          }),
          map(res => res.data),
          tap((data: APIResponse.LogIn) => {
            this.spinnerState.dispatch(new CloseAction());
            localStorage.removeItem(this.tokenKey);
            localStorage.setItem(this.tokenKey, data.accessToken);
            this.accessToken = data.accessToken;
          }),
          switchMap(() => this.usersServ.me()),
          map(res => res.data),
          tap(data => this.spinnerState.dispatch(new CloseAction())),
          switchMap((user: Users.User) => {
            return of(new auth.LogInSuccessAction({
              user: user,
              accessToken: this.accessToken
            }));
          })
        )
      })
    )
  )

  tokenLogIn$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.TokenLogInAction>(auth.TOKEN_LOG_IN),
      switchMap(() => {
        this.spinnerState.dispatch(new OpenAction('Token log in...'));
        return this.usersServ.me().pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            localStorage.removeItem(this.tokenKey);
            this.router.navigate(['/log-in']);
            return of();
          }),
          map(res => res.data),
          tap(data => this.spinnerState.dispatch(new CloseAction())),
          switchMap((user: Users.User) => {
            this.accessToken = localStorage.getItem(this.tokenKey);
            return of(new auth.LogInSuccessAction({
              user: user,
              accessToken: this.accessToken
            }));
          })
        )
      })
    )
  )

  logOut$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.LogOutAction>(auth.LOG_OUT),
      switchMap(() => {
        this.spinnerState.dispatch(new OpenAction(''));
        return this.usersServ.LogOut().pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            return of();
          }),
          map(res => res.Data),
          tap(() => {
            this.spinnerState.dispatch(new CloseAction());
            localStorage.removeItem(this.tokenKey);
            this.router.navigate(['/log-in']);
          }),
          switchMap(() => of(new auth.LogOutSuccessAction()))
        )
      })
    )
  )


}
