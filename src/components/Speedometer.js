import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Dimensions, PixelRatio } from 'react-native';

import { connect } from 'react-redux';
import { addGpsData, addTime } from '../store/Action';


const mapStateToProps = (state) => {
  const { gpsData, gpsTime, maxspeed } = state;
  return { gpsData, gpsTime, maxspeed }
};

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

class Speedometer extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      allowSpeed: true,
      speed: 0,
    };
    this.watchId = null;
  }

  async componentDidMount() {
    // launch speed detection
    this.getPosition();
  }

  componentWillUnmount() {
    this.watchId = null;
  }

  getPosition() {
    this.watchId = navigator.geolocation.watchPosition(position => {
      if (this.props.allowMS === true) {
        this.props.dispatch(addGpsData(position.coords));
      }
      this.props.dispatch(addTime(position.timestamp));
      this.props.dispatch(addGpsData(position.coords));
      this.setState({
        speed: Math.round(position.coords.speed * 3.6),
      });
    },
    error =>{
      // console.log(error);
    }, options);
  }
  
  render() {
    const { speed } = this.state;
    const { maxspeed } = this.props;
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
    if (maxspeed != 0) {
      if (speed > maxspeed + 5) {
        speedColor = "red";
      } else if (speed > maxspeed) {
        speedColor = "orange";
      } else {
        speedColor = "green";
      }
    } else {
      speedColor = "green";
    }
    
    return (
      <View style={ styles.speed }>
        <Text style={ [styles.speedUnit, { color: speedColor }] }>{ displayC }</Text>
        <Text style={ [styles.speedUnit, { color: speedColor }] }>{ displayD }</Text>
        <Text style={ [styles.speedUnit, { color: speedColor }] }>{ displayU }</Text>
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
  speedUnit: {
    fontSize: heightPercentageToDP("75%"),
    textAlign: 'justify',
    margin: 10,
    fontFamily: "digital-7",
  },
});

export default connect(mapStateToProps)(Speedometer);