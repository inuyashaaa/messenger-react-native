import React, { Component } from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import HomeScreen from './home/HomeScreen';
import SettingScreen from './settings/SettingScreen';
import RecentScreen from './recent/RecentScreen';

const TabsNavigator = createBottomTabNavigator({
  HomeScreen,
  RecentScreen,
  SettingScreen,
});

const TabsContainer = createAppContainer(TabsNavigator);

export default class MainScreen extends Component {
  render() {
    return (
      <TabsContainer />
    );
  }
}
