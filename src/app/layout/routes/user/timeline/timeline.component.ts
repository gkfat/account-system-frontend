import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Input } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Users, Posts, APIResponse } from 'src/app/core/models';
import { PostsService } from 'src/app/api/posts.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthState, selectState } from 'src/app/store/auth';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent extends BaseComponent implements OnInit {  
  // 文章 Modal
  @ViewChild('editPostModal') modal!: ElementRef;
  public modalRef!: NgbModalRef;

  private auth$ = this.authStore.select(selectState);

  @Input() queryUserId: number | null = null;
  @Input() isUserSelf: boolean = false;
  public user: Users.User = new Users.User();
  public postsData: APIResponse.FetchPosts | null = null;
  
  constructor(
    private postsServ: PostsService,
    private cd: ChangeDetectorRef,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private modalServ: NgbModal
  ) { super(); }

  ngOnInit() {
    this.authListener();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        if ( state.user ) {
          this.user = state.user;
          this.fetchPosts();
        }
      })
    ).subscribe();
  }

  public fetchPosts($event?: number) {
    const authorIds = [this.queryUserId];
    const payload = new Posts.FetchPosts({
            ids: [],
            authorIds: authorIds,
            withContent: false,
            categoryIds: [],
            page: 0,
            take: 100,
            order: {
              by: 'id',
              order: -1
            }
          })
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

}
