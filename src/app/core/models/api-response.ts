import { Users } from './users';
import { Posts } from './posts';
import { Decorators } from './decorators';

export namespace APIResponse {

  export class General<T> {
    message: string = '';
    data!: T;
  }

  /*
  ** User
  */
  export class Me {
    payload!: Users.User;
  };

  export class CreateUser extends Users.User {};

  export class Verify {
    verifyState: number = 0;
  };
  
  export class UpdateUser {
    accessToken: string = '';
  };

  export class LogIn {
    accessToken: string = '';
  }

  export class FetchUsers {
    data: Users.User[] = [];
    count: number = 0;
  }

  /*
  ** Posts
  */
  export class CreatePost extends Posts.Post {}

  export class FetchPosts {
    data: Posts.Post[] = [];
    count: number = 0;
  }

  /*
  ** Decorators
  */

  export class FetchDecorators {
    data: Decorators.Decorator[] = [];
    count: number = 0;
  }

}
