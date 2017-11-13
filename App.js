/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import NetworkImage from 'react-native-image-progress';
import {Circle as Progress} from 'react-native-progress';
import RandManager from './RandManager';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';

const NUM_WALLPAPERS = 5;

var {width, height} = Dimensions.get('window');

class SplashWallsComponent extends Component<{}> {
  constructor(props) {
      super(props);

      this.state = {
          wallsJSON: [],
          isLoading: true
      };

      this.imagePanResponder = {};
  }

  fetchWallsJSON() {
    var url = 'https://picsum.photos/list';

    fetch(url)
       .then(response => response.json())
       .then(jsonData => {
          var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
          var walls = [];

          randomIds.forEach(randomId => {
              walls.push(jsonData[randomId]);
          });

          this.setState({
              isLoading: false,
              wallsJSON: [].concat(walls)
          });
       })
    .catch(error => console.log('Fetch error ' + error));

  }

  handlePanResponderEnd(e, gesturestate) {
      console.log('Finger pulled up from the imgae');
  }

  handlePanResponderGrant(e, gestureState) {
      console.log('Finger touched the image');
  }

  handleStartShouldSetPanResponder(e, gestureState) {
      return true;
  }

  renderLoadingMessage() {
      return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
                animating={true}
                color={'#fff'}
                size={'small'}
                style={{margin: 15}} 
                />
            <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
          </View>
      );
  }

  renderResults() {
      var {wallsJSON, isLoading} = this.state;

      if (!isLoading) {
          return (
              <Swiper
                dot={
                  <View 
                    style={{
                        backgroundColor: 'rgba(255,255,255,.4)',
                        width: 8,
                        height: 8,
                        borderRadius: 10,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3
                    }} />}
                activeDot={
                    <View 
                        style={{
                            backgroundColor: '#fff',
                            width: 13,
                            height: 13,
                            borderRadius: 7,
                            marginLeft: 7,
                            marginRight: 7
                        }} />}
                loop={false}
                onMomentumScrollEnd={this.onMomentumScrollEnd} >

                {wallsJSON.map((wallpaper, index) => {
                    var imageURI = `https://picsum.photos/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`;
                    console.log(imageURI);
                    return (
                        <View key={index} style={{flex: 1}}>
                            <NetworkImage
                                source={{uri: imageURI}}
                                indicator={Progress}
                                style={styles.wallpaperImage} 
                                indicatorProps={{
                                    color: 'rgba(255,255,255,1)',
                                    size: 60,
                                    thickness: 7
                                }}
                                {...this.imagePanResponder.panHandlers}
                                />
                            <Text style={styles.label}>Photo by</Text>
                            <Text style={styles.label_authorName}>{wallpaper.author}</Text>

                        </View>
                    );
                })}
              </Swiper>
          );
      }
  }

  // Lifecycle Methods
  componentWillMount() {
      this.imagePanResponder = PanResponder.create({
          onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
          onPanResponderGrant: this.handlePanResponderGrant,
          onPanResponderRelease: this.handlePanResponderEnd,
          onPanResponderTerminate: this.handlePanResponderEnd
      });
  }

  render() {
      var {isLoading} = this.state;

      if (isLoading)
          return this.renderLoadingMessage();
      else
          return this.renderResults();
  }

  componentDidMount() {
      this.fetchWallsJSON();
  }
}

export default class App extends Component<{}> {
    render() {
        return (<SplashWallsComponent />);
    }
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width / 2
  },
  label_authorName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width/2
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000'
  }
});
