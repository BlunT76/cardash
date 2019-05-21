import React from 'react';
import { StyleSheet, Text, PixelRatio, Dimensions } from 'react-native';

import { connect } from 'react-redux';


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

const mapStateToProps = (state) => {
  const { gpsTime } = state;
  return { gpsTime };
};

const TimeDisplay = (props) => {
    return (
      <Text style={ styles.hour }>{ props.gpsTime || '--:--' }</Text>
    );
}

const styles = StyleSheet.create({
  hour: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("20%"),
    color: "white",
    marginLeft: widthPercentageToDP("2%"),
    textAlign: 'left',
    width: widthPercentageToDP("25%"),
  },
});

export default connect(mapStateToProps)(TimeDisplay);