import { Router } from '@angular/router';
import { Posts, Users } from 'src/app/core/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from 'src/app/api/posts.service';
import { takeUntil, catchError, map, tap, of } from 'rxjs';
import { BaseComponent } from '../base.component';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent extends BaseComponent implements OnInit {
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

  @Input() user!: Users.User;
  @Input() post: Posts.Post | null = null;
  @Input() newPost: boolean = false;
  @Input() showEditIcon: boolean = false;
  @Output() postUpdated: EventEmitter<number> = new EventEmitter();
  @ViewChild('editPostModal') modal!: ElementRef;
  public modalRef!: NgbModalRef;
  public modalStatus: 'read' | 'newPost' | 'edit' = 'read';

  public today = new Date().getTime();
  public postedTime: {
    type: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR';
    diffTime: number;
  } = {
    type: 'HOUR',
    diffTime: 0
  }

  // 0: 一般文章, 1: 公告
  public categoryIdSelection: number[] = [0, 1];
  public postForm: UntypedFormGroup = this.formBuilder.group(
    {
      id: 0,
      title: [null, Validators.required],
      description: [null, Validators.required],
      categoryId: this.categoryIdSelection[0],
      content: [null, Validators.required]
    });

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private spinnerState: Store<SpinnerState>,
    private errServ: ErrorHandlerService,
    private translateServ: TranslateService,
    private postsServ: PostsService,
    private modalServ: NgbModal
  ) {super();}

  ngOnInit() {
    if ( this.post ) {
      this.postedTime = this.calcPostedTime(this.post);
    }
  }


  public resetPostForm() {
    this.postForm.reset();
    if ( this.user.roleLevel === 0 ) {
      this.getFormControl().categoryId.disable();
    }
    this.postForm.patchValue({
      id: 0,
      categoryId: this.categoryIdSelection[0]
    });
    this.cd.markForCheck();
  }

  public getFormControl(): {
    id: AbstractControl,
    title: AbstractControl,
    description: AbstractControl,
    categoryId: AbstractControl,
    content: AbstractControl
  } {
    return {
      id: this.postForm.get('id')!,
      title: this.postForm.get('title')!,
      description: this.postForm.get('description')!,
      categoryId: this.postForm.get('categoryId')!,
      content: this.postForm.get('content')!
    };
  }

  public createPost() {
    const formControl = this.getFormControl(),
          payload = new Posts.CreatePost({
            title: formControl.title.value,
            content: formControl.content.value,
            description: formControl.description.value,
            categoryId: parseInt(formControl.categoryId.value),
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
      tap(data => {
        alert(this.translateServ.instant('ALERT.PUBLISH_POST_SUCCESS'));
        this.modalRef.close();
        this.postUpdated.emit(1);
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
            description: formControl.description.value,
            content: formControl.content.value,
            categoryId: parseInt(formControl.categoryId.value)
          });
    this.spinnerState.dispatch(new OpenAction(''));
    this.postsServ.UpdatePost(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      tap(data => {
        alert(this.translateServ.instant('ALERT.PUBLISH_POST_SUCCESS'));
        this.modalRef.close();
        this.postUpdated.emit(2);
        this.spinnerState.dispatch(new CloseAction());
        this.cd.markForCheck();
      })
    ).subscribe();
  }


  public deletePost(post: Posts.Post) {
    if ( confirm(this.translateServ.instant('CONFIRM.DELETE_POST')) ) {
      const payload = new Posts.DeletePost(post.id);
      this.spinnerState.dispatch(new OpenAction(''));
      this.postsServ.DeletePost(payload).pipe(
        takeUntil(this.unsubscribe$),
        catchError(err => {
          this.errServ.HttpErrorHandle(err);
          this.spinnerState.dispatch(new CloseAction());
          return of();
        }),
        tap(res => {
          alert(this.translateServ.instant('ALERT.DELETE_SUCCESS'));
          this.spinnerState.dispatch(new CloseAction());
          this.postUpdated.emit(3);
        })
      ).subscribe();
    } 
  }

  public calcPostedTime(post: Posts.Post): {
      type: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR',
      diffTime: number
    } {
    let createdTime = new Date(post.createdAt!).getTime(),
        diffTime = ( this.today - createdTime ) / ( 1000 * 3600 ),
        type: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR' = 'HOUR';

    // Hour
    if ( diffTime >= 24 ) {
      diffTime = diffTime / 24;
      type = 'DAY';
    }
    // Day
    if ( diffTime >= 30 && type === 'DAY' ) {
      diffTime = diffTime / 30;
      type = 'MONTH';
    }
    // Month
    if ( diffTime >= 12 && type === 'MONTH' ) {
      diffTime = diffTime / 12;
      type = 'YEAR';
    }
    // YEAR
    return { type, diffTime };
  }

  /*
  ** Modal
  */
  public openModal(modalStatus: 'read' | 'newPost' | 'edit', post?: Posts.Post) {
    switch ( modalStatus ) {
      case 'read':
      case 'edit':
        break;
      case 'newPost':
        this.resetPostForm();
        this.modalRef = this.modalServ.open(this.modal, { size: 'lg', scrollable: true });
        break;
    }
    this.modalStatus = modalStatus;
    if ( post ) {
      const payload = new Posts.FetchPosts();
      payload.ids.push(post.id);
      payload.withContent = true;
      this.postsServ.FetchPosts(payload).pipe(
        takeUntil(this.unsubscribe$),
        catchError(err => {
          this.errServ.HttpErrorHandle(err);
          return of();
        }),
        map(res => res.data.data[0]),
        tap(post => {
          this.postForm.patchValue({
            id: post.id,
            title: post.title,
            description: post.description,
            categoryId: this.categoryIdSelection.filter(c => c === post.categoryId)[0],
            content: post.content
          });
          this.modalRef = this.modalServ.open(this.modal, { size: 'lg', scrollable: true });
          this.cd.markForCheck();
        })
      ).subscribe();
    }
  }

  public navigateTo(url: string, params: object) {
    this.router.navigate([url], { queryParams: params });
  }

}
