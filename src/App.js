/**
 * MinimalCarDashboard
 * https://github.com/
 *
 */

import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, PermissionsAndroid, Dimensions, PixelRatio, Platform} from 'react-native';

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


export default class App extends Component {
  constructor(props) {
    super(props);
    this.watchId = null;
    this.state = {
      allowSpeed: false,
      allowPlayer: false,
      traveled: 0,
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
        console.log(result)
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

  //Calcul de la distance parcourue
  // haversineDistance = (latlngA, latlngB, isMiles) => {
  //   const toRad = x => (x * Math.PI) / 180;
  //   const R = 6371; // km

  //   const dLat = toRad(latlngB[0] - latlngA[0]);
  //   const dLatSin = Math.sin(dLat / 2);
  //   const dLon = toRad(latlngB[1] - latlngA[1]);
  //   const dLonSin = Math.sin(dLon / 2);

  //   // prettier-ignore
  //   const a = dLatSin * dLatSin +Math.cos(toRad(latlngA[1])) * Math.cos(toRad(latlngB[1])) * dLonSin * dLonSin;
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   let distance = R * c;

  //   //if (isMiles) distance /= 1.60934;
  //   if (distance < 1 && this.state.speed > 5) {
  //     this.setState({
  //       traveled: this.state.traveled + distance
  //     });
  //   }
  // };

  render() {
    const { allowSpeed, allowPlayer } = this.state;
    //Affichage de la distance parcourue
    // const travelDisplay = +traveled.toFixed(1);

    return (
      <Provider store={ store }>
        <View style={ styles.globalContainer }>

          <StatusBar backgroundColor="#272822" barStyle="light-content" />
          <KeepAwake />

          <KilometerCounter />
          {/* <Text style={styles.kmCounter}>{travelDisplay} km</Text> */}
          { allowSpeed &&<Speedometer allowMS={ this.state.allowMaxSpeed } />}
          
          <View style={ styles.bottomContainer }>

            <TimeDisplay />

            { allowPlayer &&<AudioPlayer/>}

            <MaxSpeed />

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
  kmCounter: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("8%"),
    color: "white",
    textAlign: 'center',
    backgroundColor: '#272822',
    elevation: 5,
  }
});
