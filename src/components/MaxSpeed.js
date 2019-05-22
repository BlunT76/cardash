import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addMaxSpeed } from '../store/Action';
import { widthPercentageToDP, heightPercentageToDP } from '../util/getDimensions';
import { fetchNominatimOsmID, fetchOverpassMaxSpeed } from '../api/apiRequest';

const mapStateToProps = (state) => {
  const { lat, lng, maxspeed } = state;
  return { lat, lng, maxspeed };
};

const styles = StyleSheet.create({
  maxSpeed: {
    fontFamily: 'digital-7',
    fontSize: heightPercentageToDP('20%'),
    color: 'white',
    marginRight: widthPercentageToDP('2%'),
    textAlign: 'right',
    width: widthPercentageToDP('40%'),
  },
});

class MaxSpeed extends PureComponent {
  constructor() {
    super();
    this.watchId = null;
    this.state = {
      allowMaxSpeed: false,
      maxSpeedColor: 'white',
      maxSpeedIsFetching: null,
    };
  }

  // toggle on/off the max speed fonctionnality
  getMaxSpeed = () => {
    const { allowMaxSpeed, maxSpeedIsFetching } = this.state;
    const { dispatch } = this.props;
    if (allowMaxSpeed === false) {
      // start maxspeed detection
      dispatch(addMaxSpeed(0));
      this.setState({
        allowMaxSpeed: true,
        maxSpeedColor: 'green',
        maxSpeedIsFetching: setInterval(this.fetchMaxSpeed, 5000),
      });
    } else {
      // stop maxspeed detection
      dispatch(addMaxSpeed(0));
      this.setState({
        allowMaxSpeed: false,
        maxSpeedColor: 'white',
        maxSpeedIsFetching: clearInterval(maxSpeedIsFetching),
      });
    }
  }

  // Request max speed on overpass api
  fetchMaxSpeed = () => {
    const { lat, lng } = this.props;
    const { dispatch } = this.props;
    if ((lat !== 0) && (lng !== 0)) {
      fetchNominatimOsmID(lat, lng)
        .then((response) => {
          fetchOverpassMaxSpeed(response)
            .then((maxspeed) => {
              dispatch(addMaxSpeed(maxspeed));
            })
            .catch(error => 0);
        })
        .catch(error => 0);
    }
  }

  render() {
    const { maxSpeedColor, allowMaxSpeed } = this.state;
    const { maxspeed } = this.props;
    let maxspeedDisplay = `${maxspeed}`;

    if (maxspeed === 0) {
      if (!allowMaxSpeed) {
        maxspeedDisplay = 'off';
      }
      if (allowMaxSpeed) {
        maxspeedDisplay = '---';
      }
    }

    return (
      <TouchableHighlight onPress={() => this.getMaxSpeed()}>
        <Text style={[styles.maxSpeed, { color: maxSpeedColor }]}>
          Max:
          { maxspeedDisplay }
        </Text>
      </TouchableHighlight>
    );
  }
}

MaxSpeed.propTypes = {
  dispatch: PropTypes.func,
  lat: PropTypes.number,
  lng: PropTypes.number,
  maxspeed: PropTypes.number,
};

MaxSpeed.defaultProps = {
  dispatch: () => {},
  lat: 0,
  lng: 0,
  maxspeed: 0,
};

export default connect(mapStateToProps)(MaxSpeed);
