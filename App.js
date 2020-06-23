import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Provider } from "react-redux";

import LoginScreen from "./screens/LoginScreen";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

class App extends Component {
  constructor() {
    super();
    this.initializeFirebase();
  }

  initializeFirebase = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  };

  render() {
    return (
      <View>
        <LoginScreen />
      </View>
    );
  }
}

export default App;
