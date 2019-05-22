import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGpsData, addTime } from '../store/Action';
import { heightPercentageToDP } from '../util/getDimensions';


const mapStateToProps = (state) => {
  const { gpsData, gpsTime, maxspeed } = state;
  return { gpsData, gpsTime, maxspeed };
};

const styles = StyleSheet.create({
  speed: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'digital-7',
    height: heightPercentageToDP('72%'),
  },
  speedUnit: {
    fontSize: heightPercentageToDP('75%'),
    textAlign: 'justify',
    marginLeft: 10,
    fontFamily: 'digital-7',
  },
});

const options = {
  timeout: 1000,
  maximumAge: 100,
  enableHighAccuracy: true,
  distanceFilter: 0,
  useSignificantChanges: false,
};

class Speedometer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      speed: 0,
    };
    this.watchId = null;
  }

  async componentDidMount() {
    // launch gps watch
    this.getPosition();
  }

  componentWillUnmount() {
    this.watchId = null;
  }

  getPosition() {
    const { dispatch, allowMS } = this.props;
    this.watchId = navigator.geolocation.watchPosition((position) => {
      if (allowMS === true) {
        dispatch(addGpsData(position.coords));
      }
      dispatch(addTime(position.timestamp));
      dispatch(addGpsData(position.coords));
      this.setState({
        speed: Math.round(position.coords.speed * 3.6),
      });
    },
    (error) => {}, options);
  }

  render() {
    const { speed } = this.state;
    const { maxspeed } = this.props;
    let speedColor = 'green';
    // Séparation et affichage des caractères de la vitesse
    const displayU = speed % 10;
    let displayD = null;
    let displayC = null;
    if (speed > 10) {
      displayD = Math.floor((speed % 100) / 10);
    } else {
      displayD = '';
    }
    if (speed >= 100) {
      displayC = Math.floor(speed / 100);
    } else {
      displayC = '';
    }

    // Couleur des caractéres de la vitesse en fonction de la vitesse maxi
    if (maxspeed !== 0) {
      if (speed > maxspeed + 5) {
        speedColor = 'red';
      } else if (speed > maxspeed) {
        speedColor = 'orange';
      } else {
        speedColor = 'green';
      }
    } else {
      speedColor = 'green';
    }

    return (
      <View style={styles.speed}>
        <Text style={[styles.speedUnit, { color: speedColor }]}>{ displayC }</Text>
        <Text style={[styles.speedUnit, { color: speedColor }]}>{ displayD }</Text>
        <Text style={[styles.speedUnit, { color: speedColor }]}>{ displayU }</Text>
      </View>
    );
  }
}

Speedometer.propTypes = {
  dispatch: PropTypes.func,
  maxspeed: PropTypes.number,
  allowMS: PropTypes.bool,
};

Speedometer.defaultProps = {
  dispatch: () => {},
  maxspeed: 0,
  allowMS: false,
};

export default connect(mapStateToProps)(Speedometer);
