/**
 * MinimalCarDashboard
 * https://github.com/
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StatusBar, StyleSheet, Text, View, PermissionsAndroid, Dimensions, PixelRatio, TouchableHighlight} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Speedometer from './components/Speedometer';
import AudioPlayer from './components/AudioPlayer';
import { genericTypeAnnotation } from '@babel/types';
// import fetchMaxSpeed from './api/fetchMaxSpeed';

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

// lien overpass pour vitesse maxi sur la route
const overpass = "https://overpass-api.de/api/interpreter?data=[out:json];way[maxspeed]";



export default class App extends Component {
  constructor(props) {
    super(props);
    this.watchId = null;
    this.state = {
      allowSpeed: true,
      allowMaxSpeed: false,
      maxSpeedIsFetching: null,
      maxSpeedColor: 'white',
      speed: 50,
      maxSpeed: null,
      speedColor: 'green',
      lat: null,
      lng: null,
      traveled: 0,
      time: null,
      playerIsPlaying: false,
    };
  }
  async componentDidMount() {
    // ask geolocations permissions
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location service needed',
          message:
            'MinimalCarDashboard App needs access to your GPS ' +
            'so you can read the car speed.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(granted);
        console.log('gps permission granted');
        geolocation.setRNConfiguration({skipPermissionRequests: true});
        geolocation.requestAuthorization();
      }
    } catch (err) {
      console.warn(err);
    }
    // ask camera permissions for music library access
    
  }

  getTime = (receivedTime) => {
    let t = new Date(receivedTime).toLocaleTimeString("fr-FR");
    t = t.substring(0, t.length - 3);
    this.setState({
      time: t,
    });
  }

  //toggle on/off the max speed fonctionnality
  getMaxSpeed = () => {
    if (this.state.allowMaxSpeed === false) {
      this.setState({
        allowMaxSpeed: true,
        maxSpeedColor: 'green',
        maxSpeed: '---',
        maxSpeedIsFetching: setInterval(this.fetchMaxSpeed, 5000)
      });
      // console.log("requete vitesse limite max activée");
      
    } else {
      this.setState({
        allowMaxSpeed: false,
        maxSpeedColor: 'white',
        maxSpeed: 'off',
        maxSpeedIsFetching: clearInterval(this.state.maxSpeedIsFetching)
      });
      // console.log("requete vitesse limite max désactivée");
    }
  }

  // get geolocation for requesting max speed
  getLocation = (lat, lng) => {
    //Appel de la fonction pour le comptage kilometrique
    this.haversineDistance(
      [this.state.lat, this.state.lng],
      [lat, lng],
      false
    );
    this.setState({
      lat: lat,
      lng: lng,
    });
  }

  //Request max speed on overpass api
  fetchMaxSpeed = () => {
    // console.log("requete vitesse maxi !!!");
    if ((this.state.lat != null) & (this.state.lng != null)) {
      // prettier-ignore
      fetch(`${overpass}(around:2.0,${this.state.latitude},${this.state.longitude});out%20tags;`,
        {
          method: "GET"
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson.elements[0].tags.maxspeed);
          if (responseJson.elements[0].tags.maxspeed != null) {
            this.setState({
              maxSpeed: responseJson.elements[0].tags.maxspeed
            });
            console.log("MAXSPEED", this.state.maxSpeed);
          } else {
            this.setState({
              maxSpeed: '---'
            });
            console.log("no result");
          }
        })
        .catch(error => {
          this.setState({
            maxSpeed: '---'
          });
        });
    }
  };

  //Calcul de la distance parcourue
  haversineDistance = (latlngA, latlngB, isMiles) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // km

    const dLat = toRad(latlngB[0] - latlngA[0]);
    const dLatSin = Math.sin(dLat / 2);
    const dLon = toRad(latlngB[1] - latlngA[1]);
    const dLonSin = Math.sin(dLon / 2);

    // prettier-ignore
    const a = dLatSin * dLatSin +Math.cos(toRad(latlngA[1])) * Math.cos(toRad(latlngB[1])) * dLonSin * dLonSin;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    //if (isMiles) distance /= 1.60934;
    if (distance < 1 && this.state.speed > 5) {
      this.setState({
        traveled: this.state.traveled + distance
      });
    }
    console.log("DISTANCE: ", +this.state.traveled.toFixed(1), distance);
  };

  render() {
    const { time, maxSpeed, traveled } = this.state;
    //Affichage de la distance parcourue
    const travelDisplay = +traveled.toFixed(1);
    return (
      <View style={ styles.globalContainer }>

        <StatusBar style={styles.statusBar} backgroundColor="#272822" barStyle="light-content" />
        <KeepAwake />

        <Text style={styles.kmCounter}>{travelDisplay} km</Text>
        <Speedometer getTime={ this.getTime } allowMS={ this.state.allowMaxSpeed } getloc={ this.getLocation } />
        
        <View style={ styles.bottomContainer }>

          <Text style={ styles.hour }>{ time || '--:--'}</Text>

          <AudioPlayer/>

          <TouchableHighlight onPress={() => this.getMaxSpeed()}>
            <Text style={ [styles.maxSpeed, { color: this.state.maxSpeedColor }]}>Max: { maxSpeed || 'off' }</Text>
          </TouchableHighlight>

        </View>
        
      </View>
      
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
  statusBar:{
    elevation: 0,
  },
  welcome: {
    fontSize: heightPercentageToDP("75%"),
    textAlign: 'justify',
    margin: 10,
    fontFamily: "digital-7",
    color: 'green',
  },
  hour: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("20%"),
    color: "white",
    marginLeft: widthPercentageToDP("2%"),
    textAlign: 'left',
    width: widthPercentageToDP("25%"),
  },
  maxSpeed: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("20%"),
    color: "white",
    marginRight: widthPercentageToDP("2%"),
    textAlign: 'right',
    width: widthPercentageToDP("35%"),
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
