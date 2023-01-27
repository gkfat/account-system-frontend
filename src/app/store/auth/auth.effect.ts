import { HttpErrorResponse } from '@angular/common/http';
import { Users, APIResponse, Decorators } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as auth from './auth.action';
import { UsersService } from 'src/app/api/users.service';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { Store } from '@ngrx/store';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { DecoratorsService } from 'src/app/api/decorators.service';

@Injectable()
export class AuthEffects {
  private tokenKey: string = environment.storageTokenKey;
  private decoratorsKey: string = environment.storageDecoratorsKey;
  private accessToken: string | null = null;

  constructor(
    private actions$: Actions,
    private router: Router,
    private usersServ: UsersService,
    private decoratorsServ: DecoratorsService,
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
          catchError((err: HttpErrorResponse) => {
            this.spinnerState.dispatch(new CloseAction());
            // 以 status code 來判斷，若為使用者未驗證則導向重發驗證信
            if ( err.status === 401 ) {
              this.router.navigate(['/verify']);
            }
            // Invalid email or password
            if ( err.status === 400 ) {
              
            }
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
          switchMap(() => {
            // Fetch decorators to storage
            const payload = new Decorators.FetchDecorators();
            return this.decoratorsServ.FetchDecorators(payload).pipe(
              map(res => res.data.data),
              tap(decorators => {
                localStorage.removeItem(this.decoratorsKey);
                localStorage.setItem(this.decoratorsKey, JSON.stringify(decorators));
              })
            )
          }),
          switchMap((decorators: Decorators.Decorator[]) => {
            return this.usersServ.Me().pipe(
              map(res => res.data.payload),
              switchMap((user: Users.User) => {
                this.spinnerState.dispatch(new CloseAction());
                const newUser = new Users.User(user);
                newUser.avatar = decorators.filter(d => d.id === user.avatarId)[0];
                newUser.frame = decorators.filter(d => d.id === user.frameId)[0];
                return of(new auth.LogInSuccessAction({
                  user: newUser,
                  accessToken: this.accessToken
                }));
              })
            )
          }),
        )
      })
    )
  )

  tokenLogIn$ = createEffect(
    () => this.actions$.pipe(
      ofType<auth.TokenLogInAction>(auth.TOKEN_LOG_IN),
      switchMap(() => {
        // Fetch decorators to storage
        const payload = new Decorators.FetchDecorators();
        return this.decoratorsServ.FetchDecorators(payload).pipe(
          map(res => res.data.data),
          tap(decorators => {
            localStorage.removeItem(this.decoratorsKey);
            localStorage.setItem(this.decoratorsKey, JSON.stringify(decorators));
          })
        )
      }),
      switchMap((decorators: Decorators.Decorator[]) => {
        console.log('Token log in');
        this.spinnerState.dispatch(new OpenAction(''));
        return this.usersServ.Me().pipe(
          catchError(err => {
            this.spinnerState.dispatch(new CloseAction());
            this.errServ.HttpErrorHandle(err);
            localStorage.removeItem(this.tokenKey);
            this.router.navigate(['/log-in']);
            return of();
          }),
          map(res => res.data.payload),
          switchMap((user: Users.User) => {
            this.spinnerState.dispatch(new CloseAction());
            this.accessToken = localStorage.getItem(this.tokenKey);
            const newUser = new Users.User(user);
            newUser.avatar = decorators.filter(d => d.id === user.avatarId)[0];
            newUser.frame = decorators.filter(d => d.id === user.frameId)[0];
            return of(new auth.LogInSuccessAction({
              user: newUser,
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
        const accessToken = localStorage.getItem(this.tokenKey);
        if ( accessToken ) {
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
        } else {
          return of(new auth.LogOutSuccessAction());
        }
      })
    )
  )


}
