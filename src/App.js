/**
 * MinimalCarDashboard
 * https://github.com/BlunT76/cardash
 * philippe Pereira
 * huhmiel@free.fr
 */

import React, { PureComponent } from 'react';
import {
  StatusBar, StyleSheet, View, PermissionsAndroid, Platform,
} from 'react-native';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import KeepAwake from 'react-native-keep-awake';
// import devToolsEnhancer from 'remote-redux-devtools'; // usefull while in dev
import gpsDataReducer from './store/Reducers';

import { widthPercentageToDP, heightPercentageToDP } from './util/getDimensions';
import Speedometer from './components/Speedometer';
import AudioPlayer from './components/AudioPlayer';
import TimeDisplay from './components/TimeDisplay';
import MaxSpeed from './components/MaxSpeed';
import KilometerCounter from './components/KilometerCounter';
import TrackTitleDisplay from './components/TrackTitleDisplay';

// Set an initial global state directly: DEV
// const store = createStore(gpsDataReducer, devToolsEnhancer({ realtime: true }));
// Set an initial global state directly: RELEASE
const store = createStore(gpsDataReducer);

const styles = StyleSheet.create({
  globalContainer: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('100%'),
    backgroundColor: '#272822',
  },
  speedContainer: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('75%'),
    maxHeight: heightPercentageToDP('75%'),
    fontFamily: 'digital-7',
  },
  bottomContainer: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('25%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    maxHeight: heightPercentageToDP('25%'),
    elevation: 5,
    backgroundColor: '#272822',
  },
});

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.watchId = null;
    this.state = {
      allowSpeed: false,
      allowPlayer: false,
    };
  }

  componentDidMount() {
    this.GetAllPermissions();
  }

  GetAllPermissions = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]).then((result) => {
        if (result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
          this.setState({
            allowSpeed: true,
          });
        }
        if (result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
          this.setState({
            allowPlayer: true,
          });
        }
      });
    }
  }

  render() {
    const { allowSpeed, allowPlayer, allowMaxSpeed } = this.state;

    return (
      <Provider store={store}>
        <View style={styles.globalContainer}>

          <StatusBar backgroundColor="#272822" barStyle="light-content" />
          <KeepAwake />

          { allowSpeed && <KilometerCounter /> }
          { allowSpeed && <Speedometer allowMS={allowMaxSpeed} /> }
          { allowPlayer && <TrackTitleDisplay />}

          <View style={styles.bottomContainer}>

            { allowSpeed && <TimeDisplay /> }
            { allowPlayer && <AudioPlayer /> }
            { allowSpeed && <MaxSpeed /> }

          </View>

        </View>
      </Provider>
    );
  }
}
