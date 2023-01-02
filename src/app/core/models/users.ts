export namespace Users {
  export class User {
    id: number = 0;
    createdAt: Date | null = null;
    updatedAt: Date | null = null;
    deletedAt: Date | null = null;
    email: string = '';
    firstName: string = '';
    lastName: string = '';
    loggedInTimes: number = 0;
    sessions: Session[] = [];
    verified: boolean = false;
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
    password: string = '';
    passwordConfirm: string = '';
    socialSignUp: boolean = false;

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( key ) {
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
          if ( key ) {
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
          if ( key ) {
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
          if ( key ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

  export class UpdateData {
    [key: string]: any;

    id: number = 0;
    firstName: string = '';
    lastName: string = '';

    constructor ( data?: any ) {
      if ( data ) {
        Object.keys(this).forEach(key => {
          if ( key ) {
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
          if ( key ) {
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
          if ( key ) {
            this[key] = data[key];
          }
        });
      }
    }
  }

}
