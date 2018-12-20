
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, WebView,
} from 'react-native';
import _ from 'lodash';


export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: 0,
    };
  }

  _renderImages = () => {
    const imageRowElementHtml = `
      <div style="display: flex; flex-direction: row; margin-bottom: 3px;">
        <img src="https://media.giphy.com/media/YVbFW9JoU5v1K/giphy.gif" onclick="onImageClicked(1)" style="width: 30%; height: 30%;">
        <img src="https://media.giphy.com/media/YVbFW9JoU5v1K/giphy.gif" onclick="onImageClicked(2)"  style="width: 30%;height: 30%; margin-left: 3px; margin-right: 3px;">
        <img src="https://media.giphy.com/media/YVbFW9JoU5v1K/giphy.gif" onclick="onImageClicked(3)" style="width: 30%; height: 30%;">
      </div>
    `;


    this.webview.injectJavaScript(`
      onImageClicked = function(index) {
        if (document.postMessage) {
          document.postMessage(index);
        } else if (window.postMessage) {
          window.postMessage(index);
        }
      };
      const imageRowHtml = ${`\`${imageRowElementHtml}\``};
      ${_.map(new Array(100), () => '$(\'#image-container\').append(imageRowHtml)').join(';')}
    `);
  }

  render() {
    const { selectedImage } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <WebView
            ref={ref => (this.webview = ref)}
            javaScriptEnabled
            domStorageEnabled
            style={{ width: '100%', height: '100%' }}
            source={require('./ImageRender.html')}
            onMessage={(event) => {
              this.setState({ selectedImage: event.nativeEvent.data });
            }}
            onLoadEnd={this.renderImages}
          />
        </View>

        <Text>{`Selected index: ${selectedImage}`}</Text>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
