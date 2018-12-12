/* eslint-disable react/no-multi-comp */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
import Screens from './app/screens/Screens';

const StackApp = createStackNavigator(Screens, {
  mode: 'modal',
  headerMode: 'none',
});

export default createAppContainer(StackApp);
