import React, { PureComponent } from 'react';
import { Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';

import { connect } from 'react-redux';
import { addOldGpsData } from '../store/Action';

const mapStateToProps = (state) => {
  const { lat, lng, oldlat, oldlng } = state;
  return { lat, lng, oldlat, oldlng };
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

class KilometerCounter extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      traveled: 0,
    };
  }

  componentWillUpdate() {
    this.haversineDistance();
  }
    
  //Calcul de la distance parcourue
  haversineDistance = () => {
    const { lat, lng } = this.props;
    let { oldlat, oldlng } = this.props;
    if (oldlat === 0 && oldlng === 0) {
      this.props.dispatch(addOldGpsData({latitude: lat, longitude: lng}));
      return;
    }
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // km

    const dLat = toRad(oldlat - lat);
    const dLatSin = Math.sin(dLat / 2);
    const dLon = toRad(oldlng - lng);
    const dLonSin = Math.sin(dLon / 2);

    // prettier-ignore
    const a = dLatSin * dLatSin +Math.cos(toRad(oldlng)) * Math.cos(toRad(oldlng)) * dLonSin * dLonSin;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    // console.log('distance: ',distance)

    //if (isMiles) distance /= 1.60934;
    if (distance > 0.03) {
      this.setState({
        traveled: this.state.traveled + distance
      });
      this.props.dispatch(addOldGpsData({latitude: lat, longitude: lng}));
    }
  };
  
  render() {
    const { traveled } = this.state;
    const travelDisplay = +traveled.toFixed(1);
    return (
      <Text style={ styles.kmCounter }>{ travelDisplay } km</Text>
    );
  }
}

const styles = StyleSheet.create({
  kmCounter: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("8%"),
    color: "white",
    textAlign: 'center',
    backgroundColor: '#272822',
    elevation: 5,
  }
});

export default connect(mapStateToProps)(KilometerCounter);