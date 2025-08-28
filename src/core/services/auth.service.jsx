import { APPLICATION_CONSTANTS } from "../constants/app.constant";
import StorageService from "./storage.service";

export class UserAuthService {
  static checkIsLoggedIn() {
    const tokenDetails = StorageService.getData(APPLICATION_CONSTANTS.STORAGE.TOKEN);
    if (tokenDetails && 'token' in tokenDetails) {
      return true;
    }
    return false;
  }

  static logoutUser() {
    StorageService.clear(); 
  }
}