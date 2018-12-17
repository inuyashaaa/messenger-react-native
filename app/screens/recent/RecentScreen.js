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
import TabViewComponent from '../home/TabViewComponent';
import AppPreferences from '../../utils/AppPreferences';

const { width } = Dimensions.get('window');

export default class RecentScreen extends TabViewComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentTickets: [],
    };
  }

  componentDidMount = async () => {
    this._loadData();
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

  _renderImage = item => (
    <TouchableOpacity onPress={() => this._handleClickImage(item)}>
      <FastImage
        style={styles.item}
        source={{ uri: item.link, priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </TouchableOpacity>
  )

  render() {
    const { recentTickets } = this.state;
    if (!recentTickets.length) {
      return (
        <View>
          <Text>Nothing to show</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={recentTickets}
          renderItem={this._renderImage}
          numColumns={4}
        />
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
