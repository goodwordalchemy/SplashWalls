/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class SplashWallsComponent extends Component<{}> {
  constructor(props) {
      super(props);

      this.state = {
          wallsJSON: [],
          isLoading: true
      };
  }

  fetchWallsJSON() {
    var url = 'https://unsplash.it/list';

    console.log('fetching from  ' + url);
    
    fetch(url)
       .then(response => response.json())
       .then(jsonData => {
          console.log(jsonData); 

          this.setState({isLoading: false });
       })
    .catch(error => console.log('Fetch error ' + error));

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
      return (
          <View>
            <Text>Data Loaded</Text>
          </View>
      );
  }

  // Lifecycle Methods
  componentDidMount() {
      this.fetchWallsJSON();
  }

  render() {
      var {isLoading} = this.state;

      if (isLoading)
          return this.renderLoadingMessage();
      else
          return this.renderResults();
  }
}

export default class App extends Component<{}> {
    render() {
        return (<SplashWallsComponent />);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
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
});
