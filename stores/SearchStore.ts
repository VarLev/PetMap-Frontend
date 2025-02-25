// FeedStore.ts

import { makeAutoObservable, runInAction } from 'mobx';
import apiClient from '@/hooks/axiosConfig';
import { IPostPhotos, IPost } from '@/dtos/Interfaces/feed/IPost';
import { Post, CommentWithUser } from '@/dtos/classes/feed/Post';
import { handleAxiosError } from '@/utils/axiosUtils';
import { getFilesInDirectory, storage } from '@/firebaseConfig';
import { randomUUID } from 'expo-crypto';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/utils/utils';
import userStore from './UserStore';
import i18n from '@/i18n';
import axios from 'axios';

class SearchStore {
  posts: IPost[] = [];
  news: string[] = [];
  loading: boolean = false;
  postPageSize: number = 5; // размер страницы
  postHasMore: boolean = true; // флаг, что ещё есть данные
  postPage: number = 1;

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
    this.postPage += 1;
  }

  resetPage() {
    this.postPage = 1;
  }

  getUserId() {
    return userStore.currentUser?.id;
  }

  async fetchPosts() {
    if (this.loading) return;
    this.setLoading(true);
    try {
      const response = await apiClient.get(`/post?page=${this.postPage}&pageSize=${this.postPageSize}`);

      const fetchedPosts = response.data.map((postData: any) => new Post(postData));
      runInAction(() => {
        if (this.postPage === 1) {
          this.posts = fetchedPosts;
        } else {
          this.posts = [...this.posts, ...fetchedPosts];
        }
        if (fetchedPosts.length < this.postPageSize) {
          this.postHasMore = false;
        }
      });
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async getUserPosts(userId: string): Promise<Post[] | [] | void> {
    try {
      const response = await apiClient.get(`/post/owner/${userId}`);

      const fetchedPosts = response.data.map((postData: any) => new Post(postData));
      if (fetchedPosts.length === 0) {
        return [];
      }
      return fetchedPosts;
    } catch (error) {
      return handleAxiosError(error);
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
        } // Обновление в рамках действия
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

  async createPost(content: string, items: string[], isVideo: boolean): Promise<string | void> {
    this.setLoading(true);
    try {
      if (!isVideo) {
        const uploadedImages = await this.uploadPostImages(items);
        const response = await apiClient.post('/post', {
          userId: this.getUserId(),
          content,
          postPhotos: uploadedImages.map((image) => ({
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
        return newPost.id;
      } else {
        // Предполагается, что видео хранится в массиве videos, и вы разрешаете только одно видео
        const videoUri = items[0];
        // Метод uploadPostVideo должен реализовывать загрузку видео в Bunny Stream
        const uploadedVideo = await this.uploadPostVideo(videoUri);
        const response = await apiClient.post('/post', {
          userId: this.getUserId(),
          content,
          postPhotos: [{ id: uploadedVideo.id, url: uploadedVideo.url }]
          ,
        });
        const newPost = new Post(response.data);
        newPost.userAvatar = userStore.currentUser?.thumbnailUrl!;
        newPost.userName = userStore.currentUser?.name!;
        newPost.createdAt = new Date();
        runInAction(() => {
          this.posts.unshift(newPost);
        });
        return newPost.id;
      }
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
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get(`/post/${postId}/likes/hasLiked`, {
        params: { userId },
      });

      return response.data ?? false;
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

  async complain(text: string) {
    this.setLoading(true);
    try {
      const res = await apiClient.post(`/users/complaint`, text, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async fetchNews() {
    try {
      const files = await getFilesInDirectory(`news/${i18n.locale}`);
      if (files.length > 0) {
        this.setNews(files);
        return;
      }
      return files;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  async uploadPostVideo(videoUri: string) {
    const libraryId = '384458'; // ID вашей видео-библиотеки в Bunny Stream
    const apiKey = 'fce3e49f-804f-4c62-9a6ed8a2269d-d76b-4c11'; // Ваш API-ключ Bunny Stream

    // 1. Создаем объект видео (Create Video)
    const createUrl = `https://video.bunnycdn.com/library/${libraryId}/videos`;

    let videoId: string;
    try {
      const createResponse = await axios.post(
        createUrl,
        { title: 'My Video' }, // Здесь можно задать название видео; можно использовать и другой параметр, если требуется
        {
          headers: {
            Accept: 'application/json',
            AccessKey: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      // Предполагается, что ответ содержит поле guid с идентификатором видео
      videoId = createResponse.data.guid;
    } catch (error) {
      // handleAxiosError – ваша функция обработки ошибок
      handleAxiosError(error);
      throw error;
    }

    // 2. Загрузка видеофайла (Upload Video)
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
    console.log('uploadPostVideo: uploadUrl =', uploadUrl);


    const response = await fetch(videoUri);
    const videoBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', {
      uri: videoUri,
      name: 'video.mp4',
      type: 'video/mp4',
    } as any);
    console.log('uploadPostVideo: formData =', videoUri);

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT', // согласно документации используется PUT
        headers: {
          Accept: 'application/json',
          AccessKey: apiKey,
          // Не указываем 'Content-Type', чтобы fetch сам установил multipart/form-data с boundary
        },
        body: videoBlob,
      });
      
      const data = await response.json();
      console.log('uploadPostVideo: data =', data);
      return { id: videoId, url: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=true&muted=true&preload=true&responsive=true` };
    } catch (error) {
      console.error('uploadPostVideo: ошибка загрузки видео:', error);
      //handleAxiosError(error);
      throw error;
    }
  }
}
const searchStore = new SearchStore();
export default searchStore;
