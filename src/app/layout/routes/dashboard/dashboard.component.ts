import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Users, APIResponse } from 'src/app/core/models';
import { UsersService } from 'src/app/api/users.service';
import { Router } from '@angular/router';
import { AuthState } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { UntypedFormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseComponent implements OnInit {
  public usersData: APIResponse.FetchUsers | null = null;

  constructor(
    private usersServ: UsersService,
    private cd: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private spinnerState: Store<SpinnerState>,
    private translateServ: TranslateService,
    public sanitizer: DomSanitizer
  ) { super(); }

  ngOnInit() {
    this.authListener();
  }

  public formatTimestamp(ISODate: Date) {
    return new Date(ISODate).getTime();
  }

  public authListener() {
    const token: string | null = localStorage.getItem(environment.cookieKeys.token);
    if (!token) {
      this.router.navigateByUrl('/verify');
    } else {
      this.fetchUsers();
    }
  }

  // 查詢使用者資訊
  public fetchUsers() {
    const payload = new Users.FetchUsers({
            ids: [],
            page: 0,
            take: 100,
            order: {
              by: 'id',
              order: -1
            }
          })
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.FetchUsers(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(data => {
        this.usersData = {
          users: {
            data: data.users.data,
            count: data.users.count
          },
          activeUsersToday: {
            data: data.activeUsersToday.data,
            count: data.activeUsersToday.count
          },
          averageUsersLast7Days: {
            data: data.averageUsersLast7Days.data,
            count: data.averageUsersLast7Days.count
          }
        };
        this.spinnerState.dispatch(new CloseAction());
        this.cd.markForCheck();
      })
    ).subscribe();
  }

}
