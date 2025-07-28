class StorageService {
  static setData(key, data) {
    localStorage.setItem(key, typeof String == data ? data : JSON.stringify(data));
  }

  static getData(key) {
    const val = localStorage.getItem(key);
    if ((val != undefined && val != 'undefined') && (val != null && val != 'null')) {
      return JSON.parse(val);
    } else {
      return null;
    }
  }

  static clear() {
    localStorage.clear();
  }
}

export default StorageService;
