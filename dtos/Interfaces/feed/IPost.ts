// IPоst.ts

export interface IImage {
    id: string;
    url: string;
  }
  
  export interface IComment {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }
  
  export interface IPost {
    id: string;
    userId: string;
    title: string;
    content: string;
    images: IImage[];
    likesCount: number;
    hasLiked: boolean;
    comments: IComment[];
    createdAt: string;
  }