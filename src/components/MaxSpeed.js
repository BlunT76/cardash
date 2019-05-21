import React, { Component} from 'react';
import { StyleSheet, Text, TouchableHighlight, PixelRatio, Dimensions } from 'react-native';

import { connect } from 'react-redux';
import { addMaxSpeed } from '../store/Action';

const nominatim = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=18&limit=1&"

// detecte les dimensions de l'écran
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
  const { lat, lng, maxspeed } = state;
  return { lat, lng, maxspeed };
};

class MaxSpeed extends Component {
  constructor() {
    super()
    this.watchId = null;
    this.state = {
      allowMaxSpeed: false,
      maxSpeedColor: 'white',
      maxSpeedIsFetching: null,
    }
  }

  //toggle on/off the max speed fonctionnality
  getMaxSpeed = () => {
    if (this.state.allowMaxSpeed === false) {
      // start maxspeed detection
      this.props.dispatch(addMaxSpeed(0));
      this.setState({
        allowMaxSpeed: true,
        maxSpeedColor: 'green',
        maxSpeedIsFetching: setInterval(this.fetchMaxSpeed, 5000)
      });
    } else {
      // stop maxspeed detection
      this.props.dispatch(addMaxSpeed(0));
      this.setState({
        allowMaxSpeed: false,
        maxSpeedColor: 'white',
        maxSpeedIsFetching: clearInterval(this.state.maxSpeedIsFetching)
      });
    }
  }

  //Request max speed on overpass api
  fetchMaxSpeed = () => {
    const { lat, lng } = this.props;
    if ((lat != 0) & (lng != 0)) {
      // request the osm_id
      fetch(`${nominatim}lat=${lat}&lon=${lng}`,
        {
          method: "GET"
        }
      )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.osm_type === "way" && responseJson.osm_id) {
          // request the maxspeed with the osm_id
          fetch(`http://overpass-api.de/api/interpreter?data=[out:json];way(${responseJson.osm_id});out;`,
            {
              method: "GET"
            }
          )
          .then(resp =>resp.json())
          .then(respJson => {
            if(respJson.elements[0].tags.maxspeed) {
              this.props.dispatch(addMaxSpeed(+respJson.elements[0].tags.maxspeed));
            }
          })
          .catch(error => {
            this.props.dispatch(addMaxSpeed(0));
          });
        }
      })
      .catch(error => {
        this.props.dispatch(addMaxSpeed(0));
      });
    }
  }

  render() {
    const { maxSpeedColor, allowMaxSpeed } = this.state;
    const { maxspeed } = this.props;
    let maxspeedDisplay = `${maxspeed}`;

    if ( maxspeed === 0) {
      if (!allowMaxSpeed) {
        maxspeedDisplay = 'off';
      }
      if (allowMaxSpeed) {
        maxspeedDisplay = '---';
      }
    }

    return (
      <TouchableHighlight  onPress={() => this.getMaxSpeed()}>
        <Text style={ [styles.maxSpeed, { color: maxSpeedColor }]}>Max: { maxspeedDisplay }</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  maxSpeed: {
    fontFamily: "digital-7",
    fontSize: heightPercentageToDP("20%"),
    color: "white",
    marginRight: widthPercentageToDP("2%"),
    textAlign: 'right',
    width: widthPercentageToDP("35%"),
  },
});

export default connect(mapStateToProps)(MaxSpeed);