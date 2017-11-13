/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import NetworkImage from 'react-native-image-progress';
import {Circle as Progress} from 'react-native-progress';
import ProgressHUD from './ProgressHUD';
import RandManager from './RandManager';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  CameraRoll,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import Utils from './Utils';


const DOUBLE_TAP_DELAY = 300; 
const DOUBLE_TAP_RADIUS = 20;
const NUM_WALLPAPERS = 5;

var {width, height} = Dimensions.get('window');

class SplashWallsComponent extends Component<{}> {
  constructor(props) {
      super(props);

      this.state = {
          wallsJSON: [],
          isLoading: true,
          isHudVisible: false
      };

      this.currentWallIndex = 0;

      this.imagePanResponder = {};
      this.prevTouchInfo = {
          prevTouchX: 0,
          prevTouchY: 0,
          prevTouchTimeStamp: 0
      };

      this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
      this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
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
      var currentTouchTimeStamp = Date.now();
      
      if (this.isDoubleTap(currentTouchTimeStamp, gestureState))
          this.saveCurrentWallpaperToCameraRoll();

      this.prevTouchInfo = {
          prevTouchX: gestureState.x0,
          prevTouchY: gestureState.y0,
          prevTouchTimeStamp: currentTouchTimeStamp
      };
  }

  handleStartShouldSetPanResponder(e, gestureState) {
      return true;
  }

  isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
      var {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
      var dt = currentTouchTimeStamp - prevTouchTimeStamp;

      return (dt < DOUBLE_TAP_DELAY && Utils.distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
  }

  onMomentumScrollEnd(e, state, context) {
      this.currentWallIndex = state.index;
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
      var {wallsJSON, isLoading, isHudVisible} = this.state;

      if (!isLoading) {
          return (
              <View style={{flex:1}}>
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
              </View>
          );
      }
  }

  saveCurrentWallpaperToCameraRoll() {
      this.setState({isHudVisible: true});

      var {wallsJSON} = this.state;
      var currentWall = wallsJSON[this.currentWallIndex];
      var currentWallURL = `https://picsum.photos/${currentWall.width}/${currentWall.height}?image=${currentWall.id}`;
      
      CameraRoll.saveToCameraRoll(currentWallURL, 'photo')
          .then((data) => {
              this.setState({isHudVisible: false});

              Alert.alert(
                  'Saved',
                  'Wallpaper successfully saved to Camera Roll',
                  [
                    {'text': 'High 5!', onPress: () => console.log('OK Pressed!')}
                  ]
              );
          })
      .catch((err) => {
              console.log('Error saving to camera roll', err);
      });
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
