import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import TabViewComponent from './TabViewPureComponent';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'agapi', title: 'Agapi' },
        { key: 'ami', title: 'Ami' },
        // { key: 'brown', title: 'Brown' },
        // { key: 'meme', title: 'Meme' },
        { key: 'pepe', title: 'Pepe' },
        // { key: 'voz', title: 'Voz' },
      ],
    };
  }

  _renderScene = ({ route }) => {
    const { index, routes } = this.state;
    if (Math.abs(index - routes.indexOf(route)) > 2) {
      return <View />;
    }
    switch (route.key) {
    case 'agapi':
      return <TabViewComponent indexOfTabView={0} />;
    case 'ami':
      return <TabViewComponent indexOfTabView={5} />;
      // case 'brown':
      //   return <TabViewComponent indexOfTabView={2} />;
      // case 'meme':
      //   return <TabViewComponent indexOfTabView={3} />;
    case 'pepe':
      return <TabViewComponent indexOfTabView={4} />;
    // case 'voz':
    //   return <TabViewComponent indexOfTabView={5} />;
    default:
      return null;
    }
  }

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: 'yellow', width: 80 }}
            tabStyle={{ width: 80, height: 40 }}
            style={{ height: 40 }}
            labelStyle={{ fontSize: 12 }}
          />
        )}
        onIndexChange={() => {}}
        initialLayout={initialLayout}
        useNativeDriver
      />
    );
  }
}
