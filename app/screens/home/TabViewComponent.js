import React, { Component } from 'react';
import {
  View, ScrollView, TouchableOpacity, StyleSheet, AsyncStorage, Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const { width } = Dimensions.get('window');

export default class TabViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
    };
  }

  componentDidMount = async () => {
    const albums = await AsyncStorage.getItem('albums');
    this.setState({ albums: JSON.parse(albums) });
  }

  _handleSendImage = async (image) => {
    try {
      const { base64Str, imageType } = await this._fetchUrlImage(image);
      const shareImageBase64 = {
        url: `data:${imageType};base64,${base64Str}`,
      };
      await Share.open(shareImageBase64);
    } catch (error) {
      console.log('BaseTabs._handleSendImage._error: ', error);
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
      console.log('BaseTabs._fetchUrlImage._error: ', error);
    }
  }

  _handleClickImage = async (image) => {
    try {
      await this._handleSendImage(image);
    } catch (error) {
      console.log('_handleClickImage._error: ', error);
    }
  }

  _renderListImage = (positon) => {
    const { albums } = this.state;
    if (!albums.length) {
      return null;
    }
    const listImage = albums[positon].images.map((image, index) => this._renderImage(image, index));
    return listImage;
  }

  _renderImage = (image, index) => (
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
  )

  render() {
    const { indexOfTabView } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this._renderListImage(indexOfTabView)}
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
});
