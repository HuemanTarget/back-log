import { createStore, combineReducers } from "redux";
import GamesReducer from "../reducers/GamesReducer";
import AuthReducer from "../reducers/AuthReducer";

const store = createStore(
  combineReducers({
    games: GamesReducer,
    auth: AuthReducer,
  })
);

export default store;
