// src/js/actions/index.js
export const ADD_GPS_DATA = 'ADD_GPS_DATA';
export const addGpsData = (payload) => {
  return { type: ADD_GPS_DATA, payload }
};

export const ADD_OLD_GPS_DATA = 'ADD_OLD_GPS_DATA';
export const addOldGpsData = (payload) => {
  return { type: ADD_OLD_GPS_DATA, payload }
};

export const ADD_TIME = 'ADD_TIME';
export const addTime = (payload) => {
  return { type: ADD_TIME, payload }
};

export const ADD_MAXSPEED = 'ADD_MAXSPEED';
export const addMaxSpeed = (payload) => {
  return { type: ADD_MAXSPEED, payload }
};
