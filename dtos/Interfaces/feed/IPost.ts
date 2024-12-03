// IPоst.ts

export interface IPostPhotos {
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
    postPhotos: IPostPhotos[];
    likesCount: number;
    hasLiked: boolean;
    comments: IComment[];
    createdAt: string;
    userAvatar?: string;
    userName?: string;

    incrementLikes: () => void;
    decrementLikes: () => void;
  }