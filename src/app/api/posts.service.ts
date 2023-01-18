import { APIResponse, Posts } from 'src/app/core/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ApiRoute from './api-route';

@Injectable()
export class PostsService {
  
  constructor(
    private http: HttpClient
  ) { }

  // Create post
  public CreatePost(payload: Posts.CreatePost): Observable<APIResponse.General<APIResponse.CreatePost>> {
    const url = ApiRoute.posts.posts;
    return this.http.post<any>(url, payload);
  }

  // Update post
  public UpdatePost(payload: Posts.UpdatePost): Observable<APIResponse.General<APIResponse.CreatePost>> {
    const url = ApiRoute.posts.posts;
    return this.http.put<any>(url, payload);
  }

  // Fetch posts
  public FetchPosts(payload: Posts.FetchPosts): Observable<APIResponse.General<APIResponse.FetchPosts>> {
    const url = ApiRoute.posts.postsFetch;
    return this.http.post<any>(url, payload);
  }

}
