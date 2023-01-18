import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Users, Posts, APIResponse } from 'src/app/core/models';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PostsService } from 'src/app/api/posts.service';
import { NgbModal, NgbModalRef, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { AuthState, selectState } from 'src/app/store/auth';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent extends BaseComponent implements OnInit {  
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    maxHeight: '200px',
    minHeight: '200px',
    translate: 'yes',
    placeholder: this.translateServ.instant('PLACEHOLDER.ENTER_CONTENT'),
    defaultParagraphSeparator: 'p',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    sanitize: true,
  };
  
  // 新文章 Modal
  @ViewChild('modal') modal!: ElementRef;
  public modalRef!: NgbModalRef;
  private auth$ = this.authStore.select(selectState);

  @Input() queryUserId: number | null = null;
  public isUserSelf: boolean = false;
  public user: Users.User = new Users.User();
  public postsData: APIResponse.FetchPosts | null = null;
  
  // 0: 一般文章, 1: 公告
  public categoryIdSelection: number[] = [0, 1];
  public postForm: UntypedFormGroup = this.formBuilder.group(
    {
      id: 0,
      title: ['', Validators.required],
      categoryId: this.categoryIdSelection[0],
      content: [null, Validators.required]
    });
  
  constructor(
    private postsServ: PostsService,
    private cd: ChangeDetectorRef,
    private authStore: Store<AuthState>,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private errServ: ErrorHandlerService,
    private spinnerState: Store<SpinnerState>,
    private translateServ: TranslateService,
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
          this.isUserSelf = this.user.id === this.queryUserId;
        }
        this.resetPostForm();
        this.fetchPosts();
      })
    ).subscribe();
  }

  public resetPostForm() {
    this.postForm.reset();
    if ( this.user.roleLevel === 0 ) {
      this.getFormControl().categoryId.disable();
    }
    this.postForm.patchValue({ categoryId: this.categoryIdSelection[0] });
  }

  public fetchPosts() {
    const authorIds = [this.queryUserId];
    const payload = new Posts.FetchPosts({
            ids: [],
            authorIds: authorIds,
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

  public getFormControl(): {
    id: AbstractControl,
    title: AbstractControl,
    categoryId: AbstractControl,
    content: AbstractControl
  } {
    return {
      id: this.postForm.get('id')!,
      title: this.postForm.get('title')!,
      categoryId: this.postForm.get('categoryId')!,
      content: this.postForm.get('content')!
    };
  }

  public createPost() {
    const formControl = this.getFormControl(),
          payload = new Posts.CreatePost({
            title: formControl.title.value,
            content: formControl.content.value,
            categoryId: formControl.categoryId.value,
            authorId: this.user.id
          });
    this.spinnerState.dispatch(new OpenAction(''));
    this.postsServ.CreatePost(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(data => {
        alert(this.translateServ.instant('ALERT.PUBLISH_POST_SUCCESS'));
        this.modalRef.close();
        this.postForm.reset();
        this.fetchPosts();
        this.spinnerState.dispatch(new CloseAction());
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public updatePost() {
    const formControl = this.getFormControl(),
          payload = new Posts.UpdatePost({
            id: formControl.id.value,
            title: formControl.title.value,
            content: formControl.content.value,
            categoryId: formControl.categoryId.value
          });
    this.spinnerState.dispatch(new OpenAction(''));
    this.postsServ.UpdatePost(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(data => {
        alert(this.translateServ.instant('ALERT.PUBLISH_POST_SUCCESS'));
        this.modalRef.close();
        this.postForm.reset();
        this.fetchPosts();
        this.spinnerState.dispatch(new CloseAction());
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  /*
  ** Modal
  */
  public openModal(post?: Posts.Post) {
    if ( post ) {
      this.postForm.patchValue({
        id: post.id,
        title: post.title,
        categoryId: this.categoryIdSelection.filter(c => c === post.categoryId)[0],
        content: post.content
      });
    } else {
      this.resetPostForm();
    }
    this.modalRef = this.modalServ.open(this.modal, { size: 'lg' });
  }

}
