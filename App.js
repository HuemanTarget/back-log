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
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import store from "./redux/store";
import BackLog from "./BackLog";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen";
import GamesPlayingScreen from "./screens/HomeTabNavigator/GamesPlayingScreen";
import GamesPlayedScreen from "./screens/HomeTabNavigator/GamesPlayedScreen";

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
} from "react-navigation";

import { Ionicons } from "@expo/vector-icons";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent";
import colors from "./assets/colors";
import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

import GamesCountContainer from "./redux/containers/GamesCountContainer";

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
      <Provider store={store}>
        <BackLog />
      </Provider>
    );
  }
}

export default App;
