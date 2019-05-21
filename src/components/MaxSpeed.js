import React, { Component} from 'react';
import { StyleSheet, Text, TouchableHighlight, PixelRatio, Dimensions } from 'react-native';

import { connect } from 'react-redux';

const nominatim = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=18&limit=1&"
// lat=43.0976337&lon=0.7122893
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
  const { lat, lng } = state;
  return { lat, lng };
};

class MaxSpeed extends Component {
  constructor() {
    super()
    this.watchId = null;
    this.state = {
      allowMaxSpeed: false,
      maxSpeedColor: 'white',
      maxSpeed: 'off',
      maxSpeedIsFetching: null,
    }
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
      console.log("requete vitesse limite max activée");
      
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

  //Request max speed on overpass api
  fetchMaxSpeed = () => {
    const { lat, lng } = this.props;
    // console.log("requete vitesse maxi !!!", this.props);
    if ((lat != null) & (lng != null)) {
      // const over = "http://overpass-api.de/api/interpreter?data=[out:json];way(26355387);out;"
      // prettier-ignore
      // fetch(`${overpass}(around:2.0,${lat},${lng});out%20tags;`,

      // lat=43.0976337&lon=0.7122893
      fetch(`${nominatim}lat=${lat}&lon=${lng}`,
        {
          method: "GET"
        }
      )
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson)
        if (responseJson.osm_type === "way" && responseJson.osm_id) {
          
          // const over = `http://overpass-api.de/api/interpreter?data=[out:json];way(${responseJson.osm_id});out;`;
          fetch(`http://overpass-api.de/api/interpreter?data=[out:json];way(${responseJson.osm_id});out;`,
            {
              method: "GET"
            }
          )
          .then(resp =>resp.json())
          .then(respJson => {
            // console.log(respJson)
            if(respJson.elements[0].tags.maxspeed) {
              this.setState({
                maxSpeed: respJson.elements[0].tags.maxspeed,
              });
            }
          })
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({
          maxSpeed: '---'
        });
      });
    }
  }

  render() {
    const { maxSpeed, maxSpeedColor } = this.state;
    return (
      <TouchableHighlight  onPress={() => this.getMaxSpeed()}>
        <Text style={ [styles.maxSpeed, { color: maxSpeedColor }]}>Max: { maxSpeed || 'off' }</Text>
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