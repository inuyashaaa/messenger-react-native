/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import Share, { ShareSheet, Button } from 'react-native-share';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n'
    + 'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  _handleSendImage = async () => {
    try {
      const baseUrl = await this._fetchUrlImage();
      const shareImageBase64 = {
        url: `data:image/gif;base64,${baseUrl}`,
      };
      await Share.open(shareImageBase64);
    } catch (error) {
      console.log('eror', error);
    }
  }

  _fetchUrlImage = async () => {
    try {
      const res = await RNFetchBlob.fetch('GET', 'https://i.imgur.com/vhrzVxU.gif');
      const status = res.info().status;

      if (status === 200) {
        const base64Str = res.base64();
        console.log('base64Str', base64Str);
        console.log('Json', res.info());
        return base64Str;
      }
    } catch (error) {
      console.log('errorMessage', error);
    }
  }

  _yourImage = () => (
    <FastImage
      style={styles.image}
      source={{
        uri: 'https://unsplash.it/400/400?image=1',
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._handleSendImage}
        >
          <Text>
            Haha
          </Text>
          {this._yourImage()}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    width: 50,
    height: 50,
  },
});
