import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addOldGpsData } from '../store/Action';
import { heightPercentageToDP } from '../util/getDimensions';
import { getHaversineDistance } from '../util/getHaversineDistance';

const mapStateToProps = (state) => {
  const {
    lat, lng, oldlat, oldlng, speed,
  } = state;
  return {
    lat, lng, oldlat, oldlng, speed,
  };
};

const styles = StyleSheet.create({
  kmCounter: {
    fontFamily: 'digital-7',
    fontSize: heightPercentageToDP('8%'),
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#272822',
    elevation: 5,
  },
});

class KilometerCounter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      traveled: 0,
    };
  }

  componentWillUpdate() {
    this.haversineDistance();
  }

  // Calcul de la distance parcourue
  haversineDistance = () => {
    const {
      dispatch, lat, lng, oldlat, oldlng, speed,
    } = this.props;

    if (speed < 7) {
      return;
    }
    const { traveled } = this.state;
    if (oldlat === 0 && oldlng === 0) {
      dispatch(addOldGpsData({ latitude: lat, longitude: lng }));
      return;
    }
    const distance = getHaversineDistance(lat, lng, oldlat, oldlng);
    if (distance > 0.05) {
      this.setState({
        traveled: traveled + distance,
      });
      dispatch(addOldGpsData({ latitude: lat, longitude: lng }));
    }
  };

  render() {
    const { traveled } = this.state;
    const travelDisplay = +traveled.toFixed(1);
    return (
      <Text style={styles.kmCounter}>{travelDisplay} km</Text>
    );
  }
}

KilometerCounter.propTypes = {
  dispatch: PropTypes.func,
  lat: PropTypes.number,
  lng: PropTypes.number,
  oldlat: PropTypes.number,
  oldlng: PropTypes.number,
  speed: PropTypes.number,
};

KilometerCounter.defaultProps = {
  dispatch: () => {},
  lat: 0,
  lng: 0,
  oldlat: 0,
  oldlng: 0,
  speed: 0,
};

export default connect(mapStateToProps)(KilometerCounter);
