import { ADD_GPS_DATA } from './Action';

const initialState = {
  lat: 0,
  lng: 0,
  oldlat: 0,
  oldlng: 0,
  maxspeed: 0,
  gpsTime: '',
};

const gpsDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GPS_DATA:
      return {
        ...state,
        lat: action.payload.latitude || 0,
        lng: action.payload.longitude || 0,
      };
    case 'ADD_OLD_GPS_DATA':
      return {
        ...state,
        oldlat: action.payload.latitude,
        oldlng: action.payload.longitude,
      };
    case 'ADD_TIME': {
      const hour = new Date(action.payload).toLocaleTimeString('fr-FR');
      return {
        ...state,
        gpsTime: hour.substring(0, hour.length - 3),
      };
    }
    case 'ADD_MAXSPEED':
      return {
        ...state,
        maxspeed: action.payload,
      };

    default:
      return state;
  }
};
export default gpsDataReducer;
