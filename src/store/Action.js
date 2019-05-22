// src/js/actions/index.js
export const ADD_GPS_DATA = 'ADD_GPS_DATA';
export const addGpsData = payload => ({ type: ADD_GPS_DATA, payload });


export const ADD_OLD_GPS_DATA = 'ADD_OLD_GPS_DATA';
export const addOldGpsData = payload => ({ type: ADD_OLD_GPS_DATA, payload });

export const ADD_TIME = 'ADD_TIME';
export const addTime = payload => ({ type: ADD_TIME, payload });

export const ADD_MAXSPEED = 'ADD_MAXSPEED';
export const addMaxSpeed = payload => ({ type: ADD_MAXSPEED, payload });
