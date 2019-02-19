import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  WebView,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import _ from 'lodash';
import AppPreferences from '../../utils/AppPreferences';

export default class TabViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
    };
  }

  componentDidMount = async () => {
    this._loadData();
  }

  _loadData = async () => {
    this._loadImageFromStore();
  }

  _loadImageFromStore = async () => {
    try {
      const albums = await AppPreferences.getImageAlbums();
      if (!albums) {
        return;
      }
      this.setState({ albums: JSON.parse(albums) });
    } catch (error) {
      console.log('TabViewComponent._loadImageFromStore._error: ', error);
    }
  }

  _handleSendImage = async (idImage) => {
    try {
      const { base64Str, imageType, image } = await this._fetchUrlImage(idImage);
      const shareImageBase64 = {
        url: `data:${imageType};base64,${base64Str}`,
      };
      await Share.open(shareImageBase64);
      this._setRecentTicket(image);
    } catch (error) {
      console.log('BaseTabs._handleSendImage._error: ', error);
    }
  }

  _setRecentTicket = async (image) => {
    ticketRecent = await AppPreferences.getRecentTickets();

    const ticket = [image];
    if (ticketRecent) {
      const newTicketRecent = [...ticket, ...JSON.parse(ticketRecent)];
      return await AppPreferences.saveRecentTickets(newTicketRecent);
    }
    await AppPreferences.saveRecentTickets(ticket);
  }

  _fetchUrlImage = async (idImage) => {
    try {
      const { albums } = this.state;
      const { indexOfTabView } = this.props;
      const listImage = albums[indexOfTabView];
      const indexImage = _.findIndex(listImage.images, { id: idImage });
      if (indexImage === -1) {
        return;
      }
      const image = listImage.images[indexImage];

      const res = await RNFetchBlob.fetch('GET', image.link);
      const { status } = res.info();

      if (status === 200) {
        const base64Str = res.base64();
        return { base64Str, imageType: image.type, image };
      }
      return;
    } catch (error) {
      console.log('BaseTabs._fetchUrlImage._error: ', error);
    }
  }

  _keyExtractor = item => item.id;

  _renderImages = (albums, indexOfTabView) => {
    try {
      const listImageToShow = albums[indexOfTabView];
      const imageRowElementHtml = listImageToShow.images.map(image => `<img src="${image.link}" onclick="onImageClicked('${image.id}')" style="width: 24%; height: 20%;">`);
      this.webview.injectJavaScript(`
        onImageClicked = function(image) {
          if (document.postMessage) {
            document.postMessage(image);
          } else if (window.postMessage) {
            window.postMessage(image);
          }
        };
        const imageRowHtml = ${`\`${_.join(imageRowElementHtml, '')}\``};
        $(\'#image-container\').append(imageRowHtml);
      `);
    } catch (error) {
      console.log('TabViewComponent._renderImages._error: ', error);
    }
  }

  _renderListImage = (indexOfTabView) => {
    const { albums } = this.state;
    if (!albums.length) {
      return null;
    }

    return (
      <WebView
        ref={ref => (this.webview = ref)}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        style={{ width: '100%', height: '100%' }}
        source={Platform.OS === 'ios' ? require('./ImageRender.html') : { uri: 'file:///android_asset/ImageRender.html' }}
        onMessage={(event) => {
          this._handleSendImage(event.nativeEvent.data);
        }}
        onLoadStart={() => {
          this._renderImages(albums, indexOfTabView);
        }}
      />
    );
  }

  render() {
    const { indexOfTabView } = this.props;
    return (
      <View style={styles.container}>
        {this._renderListImage(indexOfTabView)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
