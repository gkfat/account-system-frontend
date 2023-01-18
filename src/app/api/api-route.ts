import { environment } from 'src/environments/environment';

export default class ApiRoute {
  static sessions = {
    logIn: `${environment.apiURL}/sessions/logIn`,
    logOut: `${environment.apiURL}/sessions/logOut`
  };
  static users = {
    users: `${environment.apiURL}/users`,
    usersFetch: `${environment.apiURL}/users/fetch`,
    me: `${environment.apiURL}/users/me`,
    verify: `${environment.apiURL}/users/verify`,
    resendVerify: `${environment.apiURL}/users/resendVerify`,
    resetPassword: `${environment.apiURL}/users/resetPassword`
  };
  static posts = {
    posts: `${environment.apiURL}/posts`,
    postsFetch: `${environment.apiURL}/posts/fetch`,
  }
  static decorators = {
    decorators: `${environment.apiURL}/decorators`,
    decoratorsFetch: `${environment.apiURL}/decorators/fetch`,
  }
}
