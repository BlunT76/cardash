import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { widthPercentageToDP, heightPercentageToDP } from '../util/getDimensions';

const styles = StyleSheet.create({
  hour: {
    fontFamily: 'digital-7',
    fontSize: heightPercentageToDP('20%'),
    color: 'white',
    marginLeft: widthPercentageToDP('2%'),
    marginBottom: heightPercentageToDP('1%'),
    textAlign: 'left',
    width: widthPercentageToDP('25%'),
  },
});

const mapStateToProps = (state) => {
  const { gpsTime } = state;
  return { gpsTime };
};

const TimeDisplay = (props) => {
  const { gpsTime } = props;
  return (
    <Text style={styles.hour}>{ gpsTime || '--:--' }</Text>
  );
};

TimeDisplay.propTypes = {
  gpsTime: PropTypes.number,
};

TimeDisplay.defaultProps = {
  gpsTime: 0,
};

export default connect(mapStateToProps)(TimeDisplay);
