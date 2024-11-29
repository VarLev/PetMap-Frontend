// FeedStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "@/hooks/axiosConfig";
import { IImage, IPost } from "@/dtos/Interfaces/feed/IPost";
import { Post, Comment } from "@/dtos/classes/feed/Post";
import { handleAxiosError } from "@/utils/axiosUtils";
import { storage } from "@/firebaseConfig";
import { randomUUID } from "expo-crypto";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { compressImage } from "@/utils/utils";
import userStore from "./UserStore";

class FeedStore {
  posts: IPost[] = [];
  loading: boolean = false;
  page: number = 1;
  

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

  getUserId() {
    return userStore.currentUser?.id;
  }

  async fetchPosts() {
    if (this.loading) return;
    this.setLoading(true);
    try {
      const response = await apiClient.get(`/post` );
      
      const fetchedPosts = response.data.map((postData: any) => new Post(postData));
      if (fetchedPosts.length === 0) {
        console.log('No more posts to load');
        return;
      }
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
      await apiClient.post(`/post/${postId}/like`, { userId: this.getUserId() });
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
      await apiClient.post(`/post/${postId}/unlike`, { userId: this.getUserId() });
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
      const response = await apiClient.post(`/post/${postId}/comments`, {
        userId: this.getUserId(),
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

  async createPost(content: string, images: string[]) {
    this.setLoading(true);
    try {
      const uploadedImages = await this.uploadPostImages(images);
      const response = await apiClient.post('/post', {
        userId: this.getUserId(),
        content,
        postPhotos: uploadedImages.map(image => ({
          id: image.id, // ID изображения
          url: image.url, // URL загруженного изображения
        })),
      });
      const newPost = new Post(response.data);
      runInAction(() => {
        this.posts.unshift(newPost); // Обновление в рамках действия
      });
    } catch (error) {
    return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async uploadPostImages(images: string[]): Promise<IImage[]> {
    const uploadedImages: IImage[] = [];
  
    for (const imageUri of images) {
      const compressedImage = await compressImage(imageUri);
      const response = await fetch(compressedImage);
      const blob = await response.blob();
      const imageId = randomUUID();
      const storageRef = ref(storage, `post/${imageId}`);
  
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
