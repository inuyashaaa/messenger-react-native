import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import TabViewComponent from './TabViewComponent';

const LazyPlaceholder = ({ route }) => (
  <View style={styles.scene}>
    <Text>
Loading
      {' '}
      {route.title}
…
    </Text>
  </View>
);


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'agapi', title: 'Agapi' },
        { key: 'ami', title: 'Ami' },
        { key: 'brown', title: 'Brown' },
        { key: 'meme', title: 'Meme' },
        { key: 'pepe', title: 'Pepe' },
        { key: 'voz', title: 'Voz' },
      ],
      loaded: ['agapi'],
    };
  }

  _renderScene = ({ route }) => {
    const { routes, index, loaded } = this.state;
    if (routes.indexOf(route) !== index && !loaded.includes(route.key)) {
      return <LazyPlaceholder route={route} />;
    }

    switch (route.key) {
    case 'agapi':
      return <TabViewComponent indexOfTabView={0} />;
    case 'ami':
      return <TabViewComponent indexOfTabView={1} />;
    case 'brown':
      return <TabViewComponent indexOfTabView={2} />;
    case 'meme':
      return <TabViewComponent indexOfTabView={3} />;
    case 'pepe':
      return <TabViewComponent indexOfTabView={4} />;
    case 'voz':
      return <TabViewComponent indexOfTabView={5} />;
    default:
      return null;
    }
  }

  _handleIndexChange = (index) => {
    this.setState((state) => {
      const { key } = state.routes[index];

      return {
        index,
        loaded: state.loaded.includes(key)
          ? state.loaded
          : [...state.loaded, key],
      };
    });
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'yellow' }}
          />
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
