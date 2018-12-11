import React, { Component } from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';

export default class SettingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Setting Screen</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 90,
    height: 90,
    margin: 3,
  },
});
