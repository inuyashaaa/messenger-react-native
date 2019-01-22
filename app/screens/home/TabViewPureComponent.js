import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import AppPreferences from '../../utils/AppPreferences';

const { width, height } = Dimensions.get('window');
export default class TabViewPureComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
    };
  }

  componentWillMount() {
    this._loadData();
  }

  _loadData = async () => {
    this._loadImageFromStore();
  }

  _loadImageFromStore = async () => {
    try {
      const albums = await AppPreferences.getImageAlbums();
      console.log('============================================');
      console.log('albums', JSON.parse(albums));
      console.log('============================================');
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

  _keyExtractor = (item, index) => `${item.id} ${index}`;

  _renderImage = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => this._handleSendImage(item)}
    >
      <View
        style={[
          { width: (width) / 4 },
          { height: (width) / 4 },
          { marginBottom: 10 },
        ]}
      >
        <FastImage
          style={{ flex: 1, width: undefined, height: undefined }}
          source={{
            uri: item.link,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={{ borderRadius: 5 }}
        />
      </View>
    </TouchableOpacity>
  )

  _renderListImage = (indexOfTabView) => {
    const { albums } = this.state;
    if (!albums.length) {
      return null;
    }

    return (
      <FlatList
        numColumns={4}
        data={albums[indexOfTabView].images}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderImage}
        removeClippedSubviews
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
