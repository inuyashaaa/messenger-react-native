/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, AsyncStorage, Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';

const { width } = Dimensions.get('window');

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
    };
  }

  componentDidMount = async () => {
    const albums = await AsyncStorage.getItem('albums');
    if (albums) {
      this.setState({ albums: JSON.parse(albums) });
      return;
    }
    await this.getData();
  }

  getData = async () => {
    console.log('====================================');
    console.log('Get new data');
    console.log('====================================');

    const albums = await this.getAlbum();
    this.setState({ albums });
  }

  getAlbum = async () => {
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
      return albums;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  _handleSendImage = async (image) => {
    try {
      const { base64Str, imageType } = await this._fetchUrlImage(image);
      const shareImageBase64 = {
        url: `data:${imageType};base64,${base64Str}`,
      };
      await Share.open(shareImageBase64);
    } catch (error) {
      console.log('eror', error);
    }
  }

  _fetchUrlImage = async (image) => {
    try {
      const res = await RNFetchBlob.fetch('GET', image.link);
      const { status } = res.info();

      if (status === 200) {
        const base64Str = res.base64();
        return { base64Str, imageType: image.type };
      }
    } catch (error) {
      console.log('errorMessage', error);
    }
  }

  _handleClickImage = async (image) => {
    try {
      await this._handleSendImage(image);
    } catch (error) {
      console.log('_handleClickImage._error: ', error);
    }
    console.log('====================================');
    console.log('Imagessss', image);
    console.log('====================================');
  }

  _renderListImage = () => {
    const { albums } = this.state;
    if (!albums.length) {
      return null;
    }
    const listImage = albums[5].images.map((image, index) => this._renderImage(image, index));
    return listImage;
  }

  _renderImage = (image, index) => {
    console.log('====================================');
    console.log('Image', image);
    console.log('====================================');

    return (
      <TouchableOpacity
        key={image.id}
        onPress={() => this._handleClickImage(image)}
      >
        <View
          style={[
            { width: (width) / 4 },
            { height: (width) / 4 },
            index % 4 !== 0 ? { paddingLeft: 10 } : { paddingLeft: 0 },
            { marginBottom: 10 },
          ]}
        >
          <FastImage
            style={{ flex: 1, width: undefined, height: undefined }}
            source={{
              uri: image.link,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this._renderListImage()}
          </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 90,
    height: 90,
    margin: 3,
  },
});
