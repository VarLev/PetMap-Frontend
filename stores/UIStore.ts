import { makeAutoObservable } from 'mobx';

class UIStore {
  isPointSearchFilterTagSelected : boolean = false;
  isBottomTableViewSheetOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsPointSearchFilterTagSelected(isSelected: boolean) {
    this.isPointSearchFilterTagSelected = isSelected;
  }

  getIsPointSearchFilterTagSelected() {
    return this.isPointSearchFilterTagSelected;
  }

  setIsBottomTableViewSheetOpen(isOpen: boolean) {
    this.isBottomTableViewSheetOpen = isOpen;
  }

  getIsBottomTableViewSheetOpen() {
    return this.isBottomTableViewSheetOpen;
  }
}

const uiStore = new UIStore();
export default uiStore;