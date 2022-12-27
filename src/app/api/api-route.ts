import { environment } from 'src/environments/environment';

export default class ApiRoute {
  static users = {
    sessions: `${environment.apiURL}/sessions`,
    users: `${environment.apiURL}/users`,
    usersFetch: `${environment.apiURL}/users/fetch`,
    logOut: `${environment.apiURL}/sessions/logout`,
    me: `${environment.apiURL}/users/me`,
    verify: `${environment.apiURL}/users/verify`,
    resendVerify: `${environment.apiURL}/users/resendVerify`,
    resetPassword: `${environment.apiURL}/users/resetPassword`
  };
}
