import { Users } from './users';

export namespace APIResponse {

  export class General<T> {
    message: string = '';
    data!: T;
  }

  export class Me extends Users.User {};

  export class CreateUser extends Users.User {};

  export class Verify {
    verifyState: number = 0;
  };
  
  export class UpdateData {
    accessToken: string = '';
  };

  export class LogIn {
    accessToken: string = '';
  }

  export class FetchUser {
    data: Users.User[] = [];
    count: number = 0;
  }

  export class FetchUsers {
    users: FetchUser = {
      data: [],
      count: 0
    }
    activeUsersToday: FetchUser = {
      data: [],
      count: 0
    }
    averageUsersLast7Days: FetchUser = {
      data: [],
      count: 0
    }
  };

}
