import {
  CLIENT_ID as DEV_CLIENT_ID,
} from 'react-native-dotenv';

export default class AppConfig {
  static CLIENT_ID = '8199676913db8bf';

  static getClientId() {
    return __DEV__ ? DEV_CLIENT_ID : AppConfig.CLIENT_ID;
  }
}
