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
  comments: ICommentWithUser[];
  createdAt: Date;
  userAvatar?: string;
  userName?: string;

  // incrementLikes: () => void;
  // decrementLikes: () => void;
}

export interface INews {
  id: string;
  title: string;
  content: string;
  postPhotos: IPostPhotos[];
  likesCount: number;
  hasLiked: boolean;
  createdAt: Date;

  incrementLikes: () => void;
  decrementLikes: () => void;
}

export interface ICommentWithUser {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  userAvatar?: string;
  userName?: string;
}