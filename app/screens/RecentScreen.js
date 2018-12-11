import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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
    console.log('==============================================');
    console.log('Recent: ', recentTickets);
    console.log('==============================================');
  }

  _renderRecentListImage = () => {
    const { recentTickets } = this.state;
    if (!recentTickets.length) {
      return null;
    }
    const listImage = recentTickets.map((image, index) => this._renderImage(image, index));
    return listImage;
  }

  _renderImage = (image, index) => (
    <TouchableOpacity
      key={index}
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
          source={{ uri: image.link, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
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
  list_item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
