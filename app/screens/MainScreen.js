import React, { Component } from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import {
  createAppContainer,
  createBottomTabNavigator,
  SafeAreaView,
} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './home/HomeScreen';
import SettingScreen from './settings/SettingScreen';
import RecentScreen from './recent/RecentScreen';
import { scale } from '../libs/reactSizeMatter/scalingUtils';

const MAIN_TAB_BAR_HEIGHT = scale(40);
export { MAIN_TAB_BAR_HEIGHT };
const TabsNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Trang Chủ',
        tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="home" size={25} color={tintColor} />,
      }),
    },
    Recent: {
      screen: RecentScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Hay Dùng',
        tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="history" size={25} color={tintColor} />,
      }),
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Cài Đặt',
        tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="settings" size={25} color={tintColor} />,
      }),
    },
  },
  {
    lazy: true,
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      style: {
        height: MAIN_TAB_BAR_HEIGHT,
      },
    },
    animationEnabled: true,
  },
);

const TabsContainer = createAppContainer(TabsNavigator);

export default class MainScreen extends Component {
  render() {
    return (
      <TabsContainer />
    );
  }
}
