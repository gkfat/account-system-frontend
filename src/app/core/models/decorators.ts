import { Users } from 'src/app/core/models';

export namespace Decorators {
  export class Decorator {
    [key: string]: any;

    id: number = 0;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date;
    categoryId: number = 0;
    levelLimit: number = 1;
    name: string = '';
    // users: Users.User[] = [];
    content: string = '';

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

  export class CreateDecorators {
    [key: string]: any;

    data: Decorator[] = [];

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

  export class UpdateDecorators extends CreateDecorators {}

  export class DeleteDecorator {
    [key: string]: any;

    id: number = 0;

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

  export class FetchDecorators {
    [key: string]: any;

    ids: number[] = [];
    categoryIds: number[] = [];
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

}
