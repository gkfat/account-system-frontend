import { Users } from './users';

export namespace Posts {
  export class Post {
    [key: string]: any;

    id: number = 0;
    createdAt: Date | null = null;
    updatedAt: Date | null = null;
    title: string = '';
    description: string = '';
    content: string = '';
    categoryId: number = 0;
    author!: Users.User;

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

  export class CreatePost {
    [key: string]: any;

    title: string = '';
    description: string = '';
    content: string = '';
    categoryId: number = 0;
    authorId: number = 0;

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

  export class UpdatePost {
    [key: string]: any;

    id: number = 0;
    title: string = '';
    description: string = '';
    content: string = '';
    categoryId: number = 0;

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

  export class DeletePost {
    id: number = 0;
    constructor(id: number) {
      this.id = id;
    }
  }

  export class FetchPosts {
    [key: string]: any;

    ids: number[] = [];
    withContent: boolean = false;
    authorIds: number[] = [];
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
