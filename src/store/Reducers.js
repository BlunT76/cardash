import { ADD_GPS_DATA } from './Action';


const initialState = {
  lat: 0,
  lng: 0,
  oldlat: 0,
  oldlng: 0,
  gpsTime: '',
};

const gpsDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_GPS_DATA':
      return Object.assign({}, state, {
        lat: action.payload.latitude,
        lng: action.payload.longitude,
      });
    case 'ADD_OLD_GPS_DATA':
      return Object.assign({}, state, {
        oldlat: action.payload.latitude,
        oldlng: action.payload.longitude,
      });
    case 'ADD_TIME':
      let hour = new Date(action.payload).toLocaleTimeString("fr-FR");
      // hour = hour.substring(0, hour.length - 3);
      return Object.assign({}, state, {
        gpsTime: hour.substring(0, hour.length - 3)
      });

    default:
      return state;
  }
};
export default gpsDataReducer;
