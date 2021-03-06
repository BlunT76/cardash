import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Image, TouchableHighlight, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import MusicFiles from 'react-native-get-music-files';
import Sound from 'react-native-sound';
import { connect } from 'react-redux';
import { addTrackName } from '../store/Action';
import { heightPercentageToDP } from '../util/getDimensions';

const mapStateToProps = (state) => {
  const { trackName } = state;
  return { trackName };
};

const stopIcon = require('../assets/pause-solid.png');
const playIcon = require('../assets/play-solid.png');
const backwardIcon = require('../assets/step-backward-solid.png');
const forwardIcon = require('../assets/step-forward-solid.png');

const styles = StyleSheet.create({
  playerContainer: {
    width: heightPercentageToDP('20%'),
    height: heightPercentageToDP('25%'),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightPercentageToDP('1%'),
  },
  playerButtons: {
    // margin: heightPercentageToDP('2%'),
  },
  playerIcons: {
    width: heightPercentageToDP('15%'),
    height: heightPercentageToDP('15%'),
  },
});

class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playerIsPlaying: false,
      tracks: [],
      trackNumber: 0,
      playerIsReady: false,
    };
    this.track = null;
  }

  async componentDidMount() {
    // scan audio files
    this.scanTracks();
  }

  scanTracks = () => {
    MusicFiles.getAll({
      blured: false, // works only when 'cover' is set to true
      artist: true,
      duration: true, // default : true
      cover: false, // default : true,
      genre: false,
      title: true,
      minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
      fields: ['title', 'albumTitle', 'genre', 'lyrics', 'artwork', 'duration'], // for iOs Version
    }).then(listtracks => this.setState({
      tracks: listtracks,
      playerIsReady: true,
    }))
      .catch((error) => {});
  }

  handlePlayPause = () => {
    const { playerIsPlaying } = this.state;
    this.setState({
      playerIsPlaying: !playerIsPlaying,
    });
    if (!playerIsPlaying) {
      this.playTrack();
    } else {
      this.track.stop();
    }
  }

  handleForward = () => {
    const { tracks, trackNumber } = this.state;
    const max = tracks.length - 1;
    if (trackNumber + 1 > max) {
      this.setState({
        trackNumber: 0,
      }, () => {
        this.playTrack();
      });
    } else {
      this.setState({
        trackNumber: trackNumber + 1,
      }, () => {
        this.playTrack();
      });
    }
  }

  handleBackward = () => {
    const { tracks, trackNumber } = this.state;
    if (trackNumber - 1 < 0) {
      this.setState({
        trackNumber: tracks.length - 1,
      }, () => {
        this.playTrack();
      });
    } else {
      this.setState({
        trackNumber: trackNumber - 1,
      }, () => {
        this.playTrack();
      });
    }
  }

  playTrack() {
    const { tracks, trackNumber } = this.state;
    const { dispatch } = this.props;
    if (this.track != null) {
      this.track.stop();
    }
    this.track = new Sound(`${tracks[trackNumber].path}`, '', (error) => {
      if (!error) {
        const arr = tracks[trackNumber].path.split('/');
        const title = arr[arr.length - 1];
        dispatch(addTrackName(title));
        this.track.play((success) => {
          if (!success) {
            // console.log('Sound did not play')
          }
        });
      }
    });
  }

  render() {
    const { playerIsPlaying, playerIsReady } = this.state;
    let icon = null;
    if (!playerIsPlaying) {
      icon = playIcon; // require('../assets/play-solid.png');
    } else {
      icon = stopIcon; // require('../assets/pause-solid.png');
    }

    return (
      playerIsReady ? (
        <View style={styles.playerContainer}>
          <TouchableHighlight style={styles.playerButtons} onPress={() => this.handleBackward()}>
            <Image style={styles.playerIcons} source={backwardIcon} />
          </TouchableHighlight>

          <TouchableHighlight style={styles.playerButtons} onPress={() => this.handlePlayPause()}>
            <Image style={styles.playerIcons} source={icon} />
          </TouchableHighlight>

          <TouchableHighlight style={styles.playerButtons} onPress={() => this.handleForward()}>
            <Image style={styles.playerIcons} source={forwardIcon} />
          </TouchableHighlight>
        </View>
      ) : (
        <View style={styles.playerContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )
    );
  }
}

AudioPlayer.propTypes = {
  dispatch: PropTypes.func,
};

AudioPlayer.defaultProps = {
  dispatch: () => {},
};

export default connect(mapStateToProps)(AudioPlayer);
