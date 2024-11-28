// FeedStore.ts

import { makeAutoObservable } from "mobx";
import apiClient from "@/hooks/axiosConfig";
import { IImage, IPost } from "@/dtos/Interfaces/feed/IPost";
import { Post, Comment } from "@/dtos/classes/feed/Post";
import { handleAxiosError } from "@/utils/axiosUtils";
import { storage } from "@/firebaseConfig";
import { randomUUID } from "expo-crypto";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class FeedStore {
  posts: IPost[] = [];
  loading: boolean = false;
  page: number = 1;
  userId: string = "user-id"; // Получите текущего пользователя из аутентификации

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setPosts(posts: IPost[]) {
    this.posts = posts;
  }

  addPosts(posts: IPost[]) {
    this.posts = [...this.posts, ...posts];
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  async fetchPosts() {
    this.setLoading(true);
    try {
      const response = await apiClient.get(`/posts?page=${this.page}`);
      const fetchedPosts = response.data.map(
        (postData: any) => new Post(postData)
      );
      if (this.page === 1) {
        this.setPosts(fetchedPosts);
      } else {
        this.addPosts(fetchedPosts);
      }
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async likePost(postId: string) {
    try {
      await apiClient.post(`/posts/${postId}/like`, { userId: this.userId });
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.likesCount += 1;
        post.hasLiked = true;
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async unlikePost(postId: string) {
    try {
      await apiClient.post(`/posts/${postId}/unlike`, { userId: this.userId });
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.likesCount -= 1;
        post.hasLiked = false;
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async addComment(postId: string, content: string) {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, {
        userId: this.userId,
        content,
      });
      const newComment = new Comment(response.data);
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.push(newComment);
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async createPost(title: string, content: string, images: string[]) {
    this.setLoading(true);
    try {
      const uploadedImages = await this.uploadPostImages(images);
      const response = await apiClient.post('/posts', {
        userId: this.userId,
        title,
        content,
        images: uploadedImages,
      });
      const newPost = new Post(response.data);
      this.posts.unshift(newPost);
    } catch (error) {
    return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async uploadPostImages(images: string[]): Promise<IImage[]> {
    const uploadedImages: IImage[] = [];
  
    for (const imageUri of images) {
      const compressedImage = await this.compressImage(imageUri);
      const response = await fetch(compressedImage);
      const blob = await response.blob();
      const imageId = randomUUID();
      const storageRef = ref(storage, `posts/${imageId}`);
  
      await uploadBytes(storageRef, blob);
  
      const downloadURL = await getDownloadURL(storageRef);
      uploadedImages.push({ id: imageId, url: downloadURL });
    }
  
    return uploadedImages;
  }
  
  async compressImage(uri: string): Promise<string> {
    // Используйте ваш метод сжатиия изображений
    // For now, return the original URI as a placeholder
    return uri;
  }
}

const feedStore = new FeedStore();
export default feedStore;
