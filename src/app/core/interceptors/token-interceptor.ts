import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private tokenKey: string = environment.storageTokenKey;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem(this.tokenKey) || null,
        clonedRequest: HttpRequest<any> = req;

    if ( token ) {
      clonedRequest = req.clone({
        headers: req.headers.set('authorization', token),
        body: req.body
      });
    }

    return next.handle(clonedRequest);
  }

}