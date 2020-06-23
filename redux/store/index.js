import { createStore, combineReducers } from "redux";

import authReducer from "../reducers/authReducer";

const store = createStore(
  combineReducers({
    games: gamesReducer,
    auth: authReducer,
  })
);

export default store;
