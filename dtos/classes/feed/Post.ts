// Post.ts

import { makeObservable, observable, action } from "mobx";
import { IPost, IPostPhotos, IComment, ICommentWithUser } from '@/dtos/Interfaces/feed/IPost';

export class Post implements IPost {
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

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title || '';
    this.content = data.content || '';
    this.postPhotos = data.postPhotos || [];
    this.likesCount = data.likesCount || 0;
    this.hasLiked = data.hasLiked || false;
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || '';
    this.userAvatar = data.userAvatar || '';
    this.userName = data.userName || '';

    makeObservable(this, {
      likesCount: observable,
      hasLiked: observable,
      userAvatar: observable,
      userName: observable,
      comments: observable,
      incrementLikes: action,
      decrementLikes: action,
    });
  }

  // Действия для изменения состояния
  incrementLikes() {
    this.likesCount++;
    this.hasLiked = true;
  }

  decrementLikes() {
    this.likesCount--;
    this.hasLiked = false;
  }
}

export class Comment implements IComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.content = data.content || '';
    this.createdAt = data.createdAt || '';
  }
}

export class CommentWithUser implements ICommentWithUser {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  userAvatar?: string;
  userName?: string;

  constructor(data: any) {
    this.id = data.id;
    this.postId = data.postId;
    this.userId = data.userId;
    this.content = data.content || '';
    this.createdAt = data.createdAt || '';
    this.userAvatar = data.userAvatar || '';
    this.userName = data.userName || '';
  }
}