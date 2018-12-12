import { AsyncStorage } from 'react-native';

export default class AppPreferences {
  static async saveImageAlbums(albums) {
    AsyncStorage.setItem('albums', JSON.stringify(albums));
  }

  static async getImageAlbums() {
    return await AsyncStorage.getItem('albums');
  }

  static async saveRecentTickets(recentTickets) {
    AsyncStorage.setItem('recentTickets', JSON.stringify(recentTickets));
  }

  static async getRecentTickets() {
    return await AsyncStorage.getItem('recentTickets');
  }
}
