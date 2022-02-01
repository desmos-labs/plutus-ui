export const Keys = {
  DesmosAddress: 'desmos-address'
}

export class Store {
  static setValue(key, value) {
    window.localStorage.setItem(key, value);
  }

  static getValue(key) {
    return window.localStorage.getItem(key);
  }
}