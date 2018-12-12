import React, { Component } from 'react';
import {
  StyleSheet, View, Text, AsyncStorage,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

export default class SplashScreen extends Component {
  componentDidMount = async () => {
    this.getData();
  }

  getData = async () => {
    this.setAlbumsFromUrl();
  }

  setAlbumsFromUrl = async () => {
    const { navigation } = this.props;
    try {
      const url = [
        'https://api.imgur.com/3/album/RKdYw',
        'https://api.imgur.com/3/album/zWr7i',
        'https://api.imgur.com/3/album/LGQGu',
        'https://api.imgur.com/3/album/ulf7o',
        'https://api.imgur.com/3/album/0LEvazq',
        'https://api.imgur.com/3/album/eRCCtp1',
      ];

      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Client-ID 8199676913db8bf',
      };

      const result = await Promise.all([
        fetch(url[0], { headers }),
        fetch(url[1], { headers }),
        fetch(url[2], { headers }),
        fetch(url[3], { headers }),
        fetch(url[4], { headers }),
        fetch(url[5], { headers }),
      ]);

      const jsonPepe = await result[0].json();
      const jsonAgapi = await result[1].json();
      const jsonMoew = await result[2].json();
      const jsonMeme = await result[3].json();
      const jsonVoz = await result[4].json();
      const jsonAmi = await result[5].json();

      const albums = [
        { images: jsonPepe.data.images, title: 'Pepe', id: 0 },
        { images: jsonAgapi.data.images, title: 'Agapi', id: 1 },
        { images: jsonMoew.data.images, title: 'Brown', id: 2 },
        { images: jsonMeme.data.images, title: 'Meme', id: 3 },
        { images: jsonVoz.data.images, title: 'Voz', id: 4 },
        { images: jsonAmi.data.images, title: 'Ami', id: 5 },
      ];

      await AsyncStorage.setItem('albums', JSON.stringify(albums));
      // navigation.navigate('MainScreen');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MainScreen' }),
        ],
      });
      navigation.dispatch(resetAction);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>MESSENGER REACT NATIVE</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42A5F5',
  },
  textTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
