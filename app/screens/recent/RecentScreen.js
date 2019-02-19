import React from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import PubSub from 'pubsub-js';
import TabViewComponent from '../home/TabViewComponent';
import AppPreferences from '../../utils/AppPreferences';

const { width } = Dimensions.get('window');

export default class RecentScreen extends TabViewComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentTickets: [],
      refreshing: false,
    };
  }

  componentWillMount = async () => {
    this._loadData();
  }

  componentDidMount = () => {
    PubSub.subscribe('send-sticker', () => {
      this._loadData();
    });
  }

  _loadData = async () => {
    try {
      await this._loadDataFromStore();
    } catch (error) {
      console.log('RecentScreen._loadData._error: ', error);
    }
  }

  _loadDataFromStore = async () => {
    const recentTickets = await AppPreferences.getRecentTickets();
    if (!recentTickets) {
      return;
    }
    this.setState({ recentTickets: JSON.parse(recentTickets) });
  }

  _handleSendImage = async (idImage) => {
    try {
      const { base64Str, imageType } = await this._fetchUrlImage(idImage);
      const shareImageBase64 = {
        url: `data:${imageType};base64,${base64Str}`,
      };
      await Share.open(shareImageBase64);
    } catch (error) {
      console.log('BaseTabs._handleSendImage._error: ', error);
    }
  }

  _fetchUrlImage = async (idImage) => {
    try {
      const { recentTickets } = this.state;
      const indexImage = _.findIndex(recentTickets, { id: idImage });
      if (indexImage === -1) {
        return;
      }
      const image = recentTickets[indexImage];

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

  _renderImage = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => this._handleSendImage(item.id)}
    >
      <View
        style={[
          { width: (width) / 4 - 8 },
          { height: (width) / 4 - 8 },
          {
            margin: 4, elevation: 2, borderRadius: 5,
          },
        ]}
      >
        <FastImage
          style={{
            flex: 1, width: undefined, height: undefined, borderRadius: 5, margin: 4,
          }}
          source={{ uri: item.link, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </TouchableOpacity>
  )

  _keyExtractor = item => item.id;

  _handleReloadScreen = async () => {
    this.setState({ refreshing: true });
    await this._loadData();
    this.setState({ refreshing: false });
  }

  render() {
    const { recentTickets, refreshing } = this.state;
    if (!recentTickets.length) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text>Nothing to show</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={recentTickets}
          extraData={this.state}
          renderItem={this._renderImage}
          numColumns={4}
          keyExtractor={this._keyExtractor}
          refreshing={refreshing}
          onRefresh={this._handleReloadScreen}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: width / 4,
    height: width / 4,
    marginBottom: 10,
  },
});
