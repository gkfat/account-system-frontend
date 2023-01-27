import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, Input, Output } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Users, APIResponse, Posts, Decorators } from 'src/app/core/models';
import { UsersService } from 'src/app/api/users.service';
import { Router } from '@angular/router';
import { AuthState, selectState } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { UntypedFormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { PostsService } from 'src/app/api/posts.service';
import { DecoratorsService } from 'src/app/api/decorators.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectState);
  public user: Users.User | null = null;

  public postsData: APIResponse.FetchPosts | null = null;
  public usersData: APIResponse.FetchUsers | null = null;
  public decoratorsData: APIResponse.FetchDecorators | null = null;

  // File upload
  public files: File[] = [];
  public createDecoratorsData: Decorators.Decorator[] = [];

  constructor(
    private postsServ: PostsService,
    private usersServ: UsersService,
    private decoratorsServ: DecoratorsService,
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
    this.fetchPosts();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        if ( state.user ) {
          this.user = state.user;
        }
      })
    ).subscribe();
  }

  public onNavChange(changeEvent: NgbNavChangeEvent) {
    switch ( changeEvent.nextId ) {
      case 1:
        if ( !this.postsData ) {
          this.fetchPosts();
        }
        break;
      case 2:
        if ( !this.usersData ) {
          this.fetchUsers();
        }
        break;
      case 3:
        if ( !this.decoratorsData ) {
          this.fetchDecorators();
        }
        break;
      default:
        break;
    }
  }

  public fetchPosts() {
    const payload = new Posts.FetchPosts();
    payload.categoryIds.push(1);
    this.postsServ.FetchPosts(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        return of();
      }),
      map(res => res.data),
      tap(data => {
        this.postsData = {
            data: data.data,
            count: data.count
        };
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public fetchUsers() {
    const payload = new Users.FetchUsers();
    this.usersServ.FetchUsers(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        return of();
      }),
      map(res => res.data),
      tap(data => {
        this.usersData = {
            data: data.data,
            count: data.count
        };
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public fetchDecorators() {
    const payload = new Decorators.FetchDecorators();
    this.decoratorsServ.FetchDecorators(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        return of();
      }),
      map(res => res.data),
      tap(data => {
        this.decoratorsData = {
          data: data.data,
          count: data.count
        }
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public navigateTo(url: string, params: object) {
    this.router.navigate([url], { queryParams: params });
  }

  /*
  ** File upload
  */
  public addFilesToData() {
    this.files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.createDecoratorsData.push(new Decorators.Decorator({
          categoryId: 0,
          levelLimit: 1,
          content: reader.result,
          name: file.name
        }));
        this.files.splice(this.files.indexOf(file), 1);
        this.cd.markForCheck();
      }
      reader.readAsDataURL(file);
    })
  }

  public createDecorators() {
    const payload = new Decorators.CreateDecorators({
      data: this.createDecoratorsData
    });
    this.decoratorsServ.CreateDecorators(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        return of();
      }),
      tap(data => {
        alert(this.translateServ.instant('ALERT.UPLOAD_SUCCESS'));
        this.createDecoratorsData = [];
        this.fetchDecorators();
      })
    ).subscribe();
  }

  public updateDecorators() {
    const payload = new Decorators.UpdateDecorators({
      data: this.decoratorsData!.data
    });
    this.decoratorsServ.UpdateDecorators(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        return of();
      }),
      tap(data => {
        alert(this.translateServ.instant('ALERT.UPDATE_SUCCESS'));
        this.fetchDecorators();
      })
    ).subscribe();
  }

  public deleteDecorator(id: number) {
    const confirmBox = confirm(this.translateServ.instant('CONFIRM.DELETE_DECORATOR'));
    if ( confirmBox ) {
      const payload = new Decorators.DeleteDecorator({ id: id });
      this.decoratorsServ.DeleteDecorator(payload).pipe(
        takeUntil(this.unsubscribe$),
        catchError(err => {
          this.errServ.HttpErrorHandle(err);
          return of();
        }),
        tap(data => {
          alert(this.translateServ.instant('ALERT.DELETE_SUCCESS'));
          this.fetchDecorators();
        })
      ).subscribe();
    }
  }

  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.addFilesToData();
  }

  public removeFile(i: number) {
    this.createDecoratorsData.splice(i, 1);
    this.cd.markForCheck();
  }

}
