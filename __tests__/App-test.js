import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';
// import AudioPlayer from '../src/components/AudioPlayer';
import * as actions from '../src/store/Action';
import gpsDataReducer from '../src/store/Reducers';

jest.mock('react-native-sound', () => '');
jest.mock('react-native-keep-awake', () => 'KeepAwake');
jest.mock('react-native-get-music-files', () => '');

// Components snapshot tests
describe('Snapshots tests', () => {
  it('App renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // need to mock store
  // it('AudioPlayer renders correctly', () => {
  //   const tree = renderer.create(<AudioPlayer />).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});

// Redux Action tests
describe('actions tests', () => {
  it('should create an action to add a gps data', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_GPS_DATA,
      payload,
    };
    expect(actions.addGpsData(payload)).toEqual(expectedAction);
  });

  it('should create an action to add a old gps data', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_OLD_GPS_DATA,
      payload,
    };
    expect(actions.addOldGpsData(payload)).toEqual(expectedAction);
  });

  it('should create an action to add time', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_TIME,
      payload,
    };
    expect(actions.addTime(payload)).toEqual(expectedAction);
  });

  it('should create an action to add maxspeed', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_MAXSPEED,
      payload,
    };
    expect(actions.addMaxSpeed(payload)).toEqual(expectedAction);
  });
});

// Redux reducers tests
describe('reducers tests', () => {
  it('should return the initial state', () => {
    expect(gpsDataReducer(undefined, {})).toEqual(
      {
        lat: 0,
        lng: 0,
        oldlat: 0,
        oldlng: 0,
        speed: 0,
        maxspeed: 0,
        gpsTime: '',
        trackName: '',
      },
    );
  });

  it('should handle ADD_GPS_DATA', () => {
    const payload = { latitude: 0.44, longitude: 0.44 };
    const action = { type: 'ADD_GPS_DATA', payload };
    expect(gpsDataReducer(undefined, action)).toEqual(
      {
        lat: 0.44,
        lng: 0.44,
        oldlat: 0,
        oldlng: 0,
        speed: 0,
        maxspeed: 0,
        gpsTime: '',
        trackName: '',
      },
    );
  });

  it('should handle ADD_OLD_GPS_DATA', () => {
    const payload = { latitude: 0.44, longitude: 0.44 };
    const action = { type: 'ADD_OLD_GPS_DATA', payload };
    expect(gpsDataReducer(undefined, action)).toEqual(
      {
        lat: 0,
        lng: 0,
        oldlat: 0.44,
        oldlng: 0.44,
        speed: 0,
        maxspeed: 0,
        gpsTime: '',
        trackName: '',
      },
    );
  });

  // disabled while no locale detection
  // it('should handle ADD_TIME', () => {
  //   const payload = 1558450230;
  //   const action = { type: 'ADD_TIME', payload };
  //   expect(gpsDataReducer(undefined, action)).toEqual(
  //     {
  //       lat: 0,
  //       lng: 0,
  //       oldlat: 0,
  //       oldlng: 0,
  //       speed: 0,
  //       maxspeed: 0,
  //       gpsTime: '01:54',
  //     },
  //   );
  // });

  it('should handle ADD_MAXSPEED', () => {
    const payload = 50;
    const action = { type: 'ADD_MAXSPEED', payload };
    expect(gpsDataReducer(undefined, action)).toEqual(
      {
        lat: 0,
        lng: 0,
        oldlat: 0,
        oldlng: 0,
        speed: 0,
        maxspeed: 50,
        gpsTime: '',
        trackName: '',
      },
    );
  });
});
