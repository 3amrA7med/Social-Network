export interface Post{
    id?:string;
    value:string;
    likes:number;
    replies:string[];
  }
  export interface NewNotifications{
      id?:string;
      count:number;
  }