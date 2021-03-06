import {
  ADD_GPS_DATA, ADD_OLD_GPS_DATA, ADD_TIME, ADD_MAXSPEED, ADD_TRACK_NAME,
} from './Action';

const initialState = {
  lat: 0,
  lng: 0,
  oldlat: 0,
  oldlng: 0,
  speed: 0,
  maxspeed: 0,
  gpsTime: '',
  trackName: '',
};

const gpsDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GPS_DATA: {
      const speedKmS = Math.round(action.payload.speed * 3.6);
      return {
        ...state,
        lat: action.payload.latitude || 0,
        lng: action.payload.longitude || 0,
        speed: speedKmS || 0,
      };
    }
    case ADD_OLD_GPS_DATA:
      return {
        ...state,
        oldlat: action.payload.latitude,
        oldlng: action.payload.longitude,
      };
    case ADD_TIME: {
      const hour = new Date(action.payload).toLocaleTimeString('fr-FR');
      return {
        ...state,
        gpsTime: hour.substring(0, hour.length - 3),
      };
    }
    case ADD_MAXSPEED:
      return {
        ...state,
        maxspeed: action.payload,
      };
    case ADD_TRACK_NAME:
      return {
        ...state,
        trackName: action.payload,
      };

    default:
      return state;
  }
};
export default gpsDataReducer;
