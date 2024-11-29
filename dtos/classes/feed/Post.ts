// Post.ts

import { IPost, IImage, IComment } from '@/dtos/Interfaces/feed/IPost';

export class Post implements IPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  images: IImage[];
  likesCount: number;
  hasLiked: boolean;
  comments: IComment[];
  createdAt: string;
  userAvatar?: string;
  userName?: string;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title || '';
    this.content = data.content || '';
    this.images = data.images || [];
    this.likesCount = data.likesCount || 0;
    this.hasLiked = data.hasLiked || false;
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || '';
    this.userAvatar = data.userAvatar || '';
    this.userName = data.userName || '';
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