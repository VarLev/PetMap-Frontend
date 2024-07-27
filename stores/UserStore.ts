import { UserDTO } from '@/dtos/userDTO';
import { UserCredential } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';

class UserStore {
  fUser: UserCredential | null = null;
  currentUser: UserDTO | null = null;
  isLogged: boolean = false;
  
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoginedUser(user: any) {
    this.fUser = user;
    this.isLogged = !!user;
  }

  setUser(user: UserDTO | null) {
    this.currentUser = user;
    this.isLogged = !!user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setLogged(isLogged: boolean) {
    this.isLogged = isLogged;
  }

  setCreatedUser(user: UserCredential) {
    this.fUser = user;
  }
  getUser(user: UserCredential) {
    this.fUser = user;
  }

  async getCurrentUser(): Promise<UserDTO> {
    return new UserDTO();
  }
}

const userStore = new UserStore();
export default userStore;