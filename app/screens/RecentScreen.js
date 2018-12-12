import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TabViewComponent from './home/TabViewComponent';

const { width } = Dimensions.get('window');

export default class RecentScreen extends TabViewComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentTickets: [],
    };
  }

  componentDidMount = async () => {
    const recentTickets = await AsyncStorage.getItem('recentTickets');
    this.setState({ recentTickets: JSON.parse(recentTickets) });
  }

  _renderRecentListImage = () => {
    const { recentTickets } = this.state;
    if (!recentTickets.length) {
      return null;
    }

    return (
      <FlatList
        data={recentTickets}
        renderItem={({ item }) => this._renderImage(item)}
        numColumns={4}
      />
    );
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
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.list_item}>
            {this._renderRecentListImage()}
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
