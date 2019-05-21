import React, { Component, PureComponent} from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Dimensions, PixelRatio } from 'react-native';
import MusicFiles from 'react-native-get-music-files';
import Sound from 'react-native-sound';


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

export default class AudioPlayer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      playerIsPlaying: false,
      tracks: [],
      trackNumber: 0,
    }
    this.track = null;
  }

  async componentDidMount() {
    // scan audio files
    this.scanTracks();
  }
  
  scanTracks = () => {
    MusicFiles.getAll({
      blured : false, // works only when 'cover' is set to true
      artist : false,
      duration : true, //default : true
      cover : false, //default : true,
      genre : false,
      title : false,
      cover : false,
      minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
      fields : ['title','albumTitle','genre','lyrics','artwork','duration'] // for iOs Version
    })
    .then(tracks => {
      // console.log(tracks)
      // const regex = /(\/0\/Music\/)/g
      // const correctTracks = tracks.filter(elm => 
      //   elm.path.match(regex)
      // );
      // console.log(correctTracks)
      this.setState({
        tracks: tracks, //correctTracks,
      });
    })
    .catch(error => {
      console.log(error)
    });
  }

  handlePlayPause = () => {
    this.setState({
      playerIsPlaying: !this.state.playerIsPlaying,
    });
    if(!this.state.playerIsPlaying) {
      this.playTrack();
    } else {
      this.track.stop();
    }
  }

  handleForward = () => {
    const max = this.state.tracks.length - 1;
    if (this.state.trackNumber + 1 > max) {
      this.setState({
        trackNumber: 0,
      }, () => {
        this.playTrack();
      });
    } else {
      this.setState({
        trackNumber: this.state.trackNumber + 1,
      }, () => {
        this.playTrack();
      });
    }
  }

  handleBackward = () => {
    if (this.state.trackNumber - 1 < 0) {
      this.setState({
        trackNumber: this.state.tracks.length - 1,
      }, () => {
        this.playTrack();
      });
    } else {
      this.setState({
        trackNumber: this.state.trackNumber - 1,
      }, () => {
        this.playTrack();
      });
    }
  }

  playTrack() {
    const { tracks, trackNumber } = this.state;
    if(this.track != null) {
      this.track.stop();
    };
    // this.track = new Sound(`/sdcard/Music/${tracks[trackNumber].fileName}`,'',(error) => {
    this.track = new Sound(`${tracks[trackNumber].path}`,'',(error) => {
      if (!error) {
        this.track.play((success) => {
          if (!success) {
            // console.log('Sound did not play')
          }
        })
      }
    });
  }

  render() {
    const { playerIsPlaying } = this.state;
    let icon = null;
    if(!playerIsPlaying){
      icon = require('../assets/play-solid.png');
    } else {
      icon = require('../assets/pause-solid.png');
    }

    return (
      <View style={styles.playerContainer}>
        
        <TouchableHighlight style={styles.playerButtons} onPress={() => this.handleBackward()}>
          <Image style={ styles.playerIcons } source={ require('../assets/step-backward-solid.png') } />
        </TouchableHighlight>

        <TouchableHighlight style={styles.playerButtons} onPress={() => this.handlePlayPause()}>
          <Image style={ styles.playerIcons } source={ icon } />
        </TouchableHighlight>

        <TouchableHighlight style={styles.playerButtons} onPress={() => this.handleForward()}>
          <Image style={ styles.playerIcons } source={ require('../assets/step-forward-solid.png') } />
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  playerButtons: {
    margin: heightPercentageToDP("2%"),
  },
  playerIcons: {
    width: heightPercentageToDP("15%"),
    height: heightPercentageToDP("15%"),
  },
});