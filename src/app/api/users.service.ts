import { APIResponse, Users } from 'src/app/core/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay, timer, mergeMap } from 'rxjs';
import ApiRoute from './api-route';

@Injectable()
export class UsersService {
  
  constructor(
    private http: HttpClient
  ) { }

  // Create user
  public CreateUser(payload: Users.CreateUser): Observable<APIResponse.General<APIResponse.CreateUser>> {
    const url = ApiRoute.users.users;
    return this.http.post<any>(url, payload);
  }

  // Log in
  public LogIn(payload: Users.LogIn): Observable<APIResponse.General<APIResponse.LogIn>> {
    const url = ApiRoute.users.sessions;
    return this.http.post<any>(url, payload);
  }

  // Fetch users
  public FetchUsers(payload: Users.FetchUsers): Observable<APIResponse.General<APIResponse.FetchUsers>> {
    const url = ApiRoute.users.usersFetch;
    return this.http.post<any>(url, payload);
  }

  // Reset password
  public ResetPassword(payload: Users.ResetPassword): Observable<APIResponse.General<string>> {
    const url = ApiRoute.users.resetPassword;
    return this.http.post<any>(url, payload);
  }

  // Me
  public me(): Observable<APIResponse.General<APIResponse.Me>> {
    const url = ApiRoute.users.me;
    return this.http.get<any>(url);
  }

  // Verify
  public verify(payload: Users.Verify): Observable<APIResponse.General<APIResponse.Verify>> {
    const url = `${ApiRoute.users.verify}/${payload.id}/${payload.verificationCode}`;
    return this.http.get<any>(url);
  }

  // Resend Verify
  public resendVerify(payload: Users.ResendVerify): Observable<APIResponse.General<APIResponse.Verify>> {
    const url = ApiRoute.users.resendVerify;
    return this.http.post<any>(url, payload);
  }

  // Update user data
  public UpdateData(payload: Users.UpdateData): Observable<APIResponse.General<APIResponse.UpdateData>> {
    const url = ApiRoute.users.me;
    return this.http.put<any>(url, payload);
  }

  // Log out
  public LogOut(): Observable<any> {
    const url = ApiRoute.users.logOut;
    return this.http.get<any>(url);
  }

}
