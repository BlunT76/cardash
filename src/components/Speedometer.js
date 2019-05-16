import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, PixelRatio } from 'react-native';

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

const options = {
  timeout: 1000,
  maximumAge: 100,
  enableHighAccuracy: true,
  distanceFilter: 0,
  useSignificantChanges: false,
};

export default class Speedometer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      allowSpeed: true,
      speed: 50,
      // maxspeed: null,
      speedColor: 'green',
    }
    this.watchId = null;
  }

  async componentDidMount() {
    // launch speed detection
    this.getPosition();
    console.log('speedometer mounted')
    
  }

  componentWillUnmount() {
    this.watchId = null;
  }

  getPosition() {
    const { getloc, allowMS, getTime } = this.props;
    this.watchId = navigator.geolocation.watchPosition(position => {
      getTime(position.timestamp);
      if (this.props.allowMS === true) {
        getloc(position.coords.latitude, position.coords.longitude);
      }
      this.setState({
        speed: Math.round(position.coords.speed * 3.6),
      });
    },
    error =>{
      console.log(error);
    }, options);
  }
  
  render() {
    const { speed, time, maxspeed } = this.state;
    let speedColor = 'green';
    //Séparation et affichage des caractères de la vitesse
    displayU = speed % 10;
    if (speed > 10) {
      displayD = Math.floor((speed % 100) / 10);
    } else {
      displayD = "";
    }
    if (speed >= 100) {
      displayC = Math.floor(speed / 100);
    } else {
      displayC = "";
    }

    //Couleur des caractéres de la vitesse en fonction de la vitesse maxi
    if (speed > maxspeed + 5 && maxspeed != null) {
      speedColor = "red";
    } else if (speed > maxspeed && maxspeed != null) {
      speedColor = "orange";
    } else {
      speedColor = "green";
    }

    return (
      <View style={ styles.speed }>
        <Text style={ [styles.welcome, { color: speedColor }] }>{ displayC }</Text>
        <Text style={ [styles.welcome, { color: speedColor }] }>{ displayD }</Text>
        <Text style={ [styles.welcome, { color: speedColor }] }>{ displayU }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  speed: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    fontFamily: "digital-7",
    height: heightPercentageToDP("75%"),
  },
  welcome: {
    fontSize: heightPercentageToDP("75%"),
    textAlign: 'justify',
    margin: 10,
    fontFamily: "digital-7",
    color: 'green',
  },
});