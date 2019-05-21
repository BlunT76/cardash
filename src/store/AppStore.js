// src/js/store/index.js
import { createStore } from "redux";
import rootReducer from "./Reducers";
const store = createStore(rootReducer);
export default store;