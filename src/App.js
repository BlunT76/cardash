/**
 * MinimalCarDashboard
 * https://github.com/
 *
 */

import React, { PureComponent } from 'react';
import { StatusBar, StyleSheet, View, PermissionsAndroid, Dimensions, PixelRatio, Platform} from 'react-native';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import gpsDataReducer from './store/Reducers';

import KeepAwake from 'react-native-keep-awake';
import Speedometer from './components/Speedometer';
import AudioPlayer from './components/AudioPlayer';
import TimeDisplay from './components/TimeDisplay';
import MaxSpeed from './components/MaxSpeed';
import KilometerCounter from './components/KilometerCounter';

// Set an initial global state directly:
const store = createStore(gpsDataReducer);

//detecte les dimensions de l'écran
const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get("window").width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get("window").height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export { widthPercentageToDP, heightPercentageToDP };


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
    if (Platform.OS === "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ])
      .then((result) => {
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
    const { allowSpeed, allowPlayer } = this.state;

    return (
      <Provider store={ store }>
        <View style={ styles.globalContainer }>

          <StatusBar backgroundColor="#272822" barStyle="light-content" />
          <KeepAwake />

          { allowSpeed &&<KilometerCounter /> }
          { allowSpeed &&<Speedometer allowMS={ this.state.allowMaxSpeed } /> }
          
          <View style={ styles.bottomContainer }>

            { allowSpeed &&<TimeDisplay /> }
            { allowPlayer &&<AudioPlayer/> }
            { allowSpeed &&<MaxSpeed /> }

          </View>
          
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: '#272822',
  },
  speedContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    fontFamily: "digital-7",
    height: heightPercentageToDP("75%"),
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    maxHeight: heightPercentageToDP("19%"),
    elevation: 5,
    backgroundColor: '#272822',
  },
});
