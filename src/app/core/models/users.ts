import { Decorators } from './decorators';
export namespace Users {
  export class User {
    [key: string]: any;

    id: number = 0;
    createdAt: Date | null = null;
    updatedAt: Date | null = null;
    deletedAt: Date | null = null;
    email: string = '';
    firstName: string = '';
    lastName: string = '';
    nickName: string = '';
    roleLevel: number = 1;
    level: number = 1;
    experience: number = 0;
    avatarId: number = 0;
    frameId: number = 0;
    sessions: Session[] = [];
    verified: boolean = false;
    avatar: Decorators.Decorator | null = null;
    frame: Decorators.Decorator | null = null;

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class Session {
    id: number = 0;
    createdAt: Date | null = null;
    updatedAt: Date | null = null;
    deletedAt: Date | null = null;
    lastLoggedIn: Date | null = null;
    userId: number = 0;
  }

  export class CreateUser {
    [key: string]: any;

    email: string = '';
    firstName: string = '';
    lastName: string = '';
    nickName: string = '';
    password: string = '';
    passwordConfirm: string = '';
    socialSignUp: boolean = false;

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class FetchUsers {
    [key: string]: any;

    ids: number[] = [];
    page: number = 1;
    take: number = 15;
    order: {
      by: string;
      order: number;
    } = {
      by: 'id',
      order: -1
    }

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class LogIn {
    [key: string]: any;

    email: string = '';
    password: string = '';
    socialLogin: boolean = false;

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class ResetPassword {
    [key: string]: any;

    id: number = 0;
    oldPassword: string = '';
    newPassword: string = '';
    newPasswordConfirm: string = '';

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class UpdateUser {
    [key: string]: any;

    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    nickName: string = '';
    avatarId: number = 0;
    frameId: number = 0;

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class Verify {
    [key: string]: any;

    id: number = 0;
    verificationCode: string = '';

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class ResendVerify {
    [key: string]: string;

    email: string = '';

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( data[key] ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

}
