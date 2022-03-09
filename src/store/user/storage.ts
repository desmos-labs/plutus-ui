import { UserData } from "../../types";

const USER_DATA_KEY = "userdata";

export class UserStorage {
  static isLoggedIn(): boolean {
    return window.localStorage.getItem(USER_DATA_KEY) !== null;
  }

  static storeUserData(data: UserData) {
    window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  }

  static getUserData(): UserData {
    return JSON.parse(window.localStorage.getItem(USER_DATA_KEY)!) as UserData;
  }

  static deleteUserData() {
    window.localStorage.removeItem(USER_DATA_KEY);
  }
}

export default UserStorage;
