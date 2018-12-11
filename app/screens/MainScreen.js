import React, { Component } from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import HomeScreen from './home/HomeScreen';
import SettingScreen from './SettingScreen';

export default class MainScreen extends Component {
  render() {
    return (
      <TabsContainer />
    );
  }
}

const TabsNavigator = createBottomTabNavigator({
  HomeScreen,
  SettingScreen,
});

const TabsContainer = createAppContainer(TabsNavigator);
