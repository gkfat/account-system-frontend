import { APIResponse, Posts } from 'src/app/core/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ApiRoute from './api-route';
import { Decorators } from '../core/models/decorators';

@Injectable()
export class DecoratorsService {
  
  constructor(
    private http: HttpClient
  ) { }

  public CreateDecorators(payload: Decorators.CreateDecorators): Observable<APIResponse.General<any>> {
    const url = ApiRoute.decorators.decorators;
    return this.http.post<any>(url, payload);
  }

  public UpdateDecorators(payload: Decorators.UpdateDecorators): Observable<APIResponse.General<any>> {
    const url = ApiRoute.decorators.decorators;
    return this.http.put<any>(url, payload);
  }

  public DeleteDecorator(payload: Decorators.DeleteDecorator): Observable<any> {
    const url = ApiRoute.decorators.decorators + `/${payload.id}`;
    return this.http.delete<any>(url);
  }

  public FetchDecorators(payload: Decorators.FetchDecorators): Observable<APIResponse.General<APIResponse.FetchDecorators>> {
    const url = ApiRoute.decorators.decoratorsFetch;
    return this.http.post<any>(url, payload);
  }


}
