import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import BackLog from "./BackLog";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const App = () => {
  return (
    <Provider store={store}>
      <BackLog />
    </Provider>
  );
};

export default App;
