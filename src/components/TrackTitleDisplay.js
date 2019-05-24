import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { widthPercentageToDP, heightPercentageToDP } from '../util/getDimensions';


const styles = StyleSheet.create({
  title: {
    fontFamily: 'digital-7',
    fontSize: heightPercentageToDP('5%'),
    color: 'white',
    marginLeft: widthPercentageToDP('2%'),
    marginBottom: heightPercentageToDP('1%'),
    textAlign: 'left',
    width: widthPercentageToDP('100%'),
  },
});

const mapStateToProps = (state) => {
  const { trackName } = state;
  return { trackName };
};

const TrackTitleDisplay = (props) => {
  const { trackName } = props;
  return (
    <Text style={styles.title}>{ trackName || '' }</Text>
  );
};

TrackTitleDisplay.propTypes = {
  trackName: PropTypes.string,
};

TrackTitleDisplay.defaultProps = {
  trackName: '',
};

export default connect(mapStateToProps)(TrackTitleDisplay);
