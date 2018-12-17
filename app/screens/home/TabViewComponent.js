import React, { Component } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import AppPreferences from '../../utils/AppPreferences';

const { width } = Dimensions.get('window');

export default class TabViewComponent extends Component {
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
    await this._loadImageFromStore();
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

  _handleSendImage = async (image) => {
    try {
      const { base64Str, imageType } = await this._fetchUrlImage(image);
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

  _keyExtractor = item => item.id;


  _renderListImage = (positon) => {
    const { albums } = this.state;
    if (!albums.length) {
      return null;
    }
    return (
      <FlatList
        numColumns={4}
        data={albums[positon].images}
        extraData={this.state}
        renderItem={this._renderImage}
        keyExtractor={this._keyExtractor}
      />
    );
  }

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
