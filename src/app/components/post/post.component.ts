import { Router } from '@angular/router';
import { Posts } from 'src/app/core/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  @Input() post!: Posts.Post;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {

  }

  public navigateTo(url: string, params: object) {
    this.router.navigate([url], { queryParams: params });
  }

}
