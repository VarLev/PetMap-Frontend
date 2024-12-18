// FeedStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "@/hooks/axiosConfig";
import { IPostPhotos, IPost, INews } from "@/dtos/Interfaces/feed/IPost";
import { Post, CommentWithUser } from "@/dtos/classes/feed/Post";
import { handleAxiosError } from "@/utils/axiosUtils";
import { getFilesInDirectory, storage } from "@/firebaseConfig";
import { randomUUID } from "expo-crypto";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { compressImage } from "@/utils/utils";
import userStore from "./UserStore";

class SearchStore {
  posts: IPost[] = [];
  news: string[] = [];
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

  setNews(news: string[]) {
    this.news = news;
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
        this.setPosts(fetchedPosts);
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

  async likePost(postId: string): Promise<boolean> {
    try {
      await apiClient.post(`/post/${postId}/like`, { userId: this.getUserId() });
      return true;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async unlikePost(postId: string): Promise<boolean> {
    try {
      await apiClient.post(`/post/${postId}/unlike`, { userId: this.getUserId() });
      return true;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async fetchGetComments(postId: string) {
    this.setLoading(true);
    try {
      const response = await apiClient.get(`/post/${postId}/comments`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      return 0;
    } finally {
      this.setLoading(false);
    }
  }

  async addComment(postId: string, content: string) {
    this.setLoading(true);
    try {
      const response = await apiClient.post(`/post/${postId}/comments`, {
        userId: this.getUserId(),
        content,
      });
      const newComment = new CommentWithUser(response.data);
      newComment.userAvatar = userStore.currentUser?.thumbnailUrl!;
      newComment.userName = userStore.currentUser?.name!;
      newComment.userId = userStore.currentUser?.id!;

      const post = this.posts.find((p) => p.id === postId);

      runInAction(() => {
        if (post) {
          post.comments.push(newComment);
        }; // Обновление в рамках действия
      });

    } catch (error) {
      return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async deletePostComment(commentId: string) {
    try {
      if (commentId) {
        await apiClient.delete(`post/comments/${commentId}`);
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
      newPost.userAvatar = userStore.currentUser?.thumbnailUrl!;
      newPost.userName = userStore.currentUser?.name!;
      newPost.createdAt = new Date();
      runInAction(() => {
        this.posts.unshift(newPost); // Обновление в рамках действия
      });
    } catch (error) {
    return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async uploadPostImages(images: string[]): Promise<IPostPhotos[]> {
    const uploadedImages: IPostPhotos[] = [];
  
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

  async fetchLikesCount(postId: string): Promise<number> {
    try {
      const response = await apiClient.get(`/post/${postId}/likes/count`);
      
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      return 0;
    }
  }

  async hasUserLiked(postId: string): Promise<boolean> {
    try {
      const userId = this.getUserId(); // Получаем ID текущего пользователя
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      const response = await apiClient.get(`/post/${postId}/likes/hasLiked`, {
        params: { userId },
      });
  
      return response.data ?? false;;
    } catch (error) {
      handleAxiosError(error);
      return false; // Если ошибка, возвращаем, что лайк отсутствует
    }
  }
  
  async deletePost(postId: string) {
    try {
      if (postId) {
        await apiClient.delete(`/post/${postId}`);
      }
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async fetchNews() {
    try {
      const files = await getFilesInDirectory('news');
      if (files.length > 0) {
        this.setNews(files);
        return;
      }
      return files;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

}

const searchStore = new SearchStore();
export default searchStore;
