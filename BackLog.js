import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen";
import GamesPlayingScreen from "./screens/HomeTabNavigator/GamesPlayingScreen";
import GamesPlayedScreen from "./screens/HomeTabNavigator/GamesPlayedScreen";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackActions } from "react-navigation";
import colors from "./assets/colors";

import * as firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
import SplashScreen from "./screens/SplashScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import GamesCountCountainer from "./redux/containers/GamesCountContainer";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

class BackLog extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    let unsubscribe;
    try {
      unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.props.signIn(user);
        } else {
          console.log("No User Signed In");
          this.props.signOut();
        }
        unsubscribe();
      });
    } catch (error) {
      console.log(error);
      this.props.signOut();
    }
  };

  render() {
    if (this.props.auth.isLoading) {
      return <SplashScreen />;
    }

    return (
      <NavigationContainer>
        {!this.props.auth.isSignedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.bgMain,
              },
            }}
          >
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerBackTitleVisible: false }}
            />
          </Stack.Navigator>
        ) : (
          <ActionSheetProvider>
            <AppDrawerNavigator />
          </ActionSheetProvider>
        )}
      </NavigationContainer>
    );
  }
}

const HomeTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      style: {
        backgroundColor: colors.bgMain,
      },
      activeTintColor: colors.logoColor,
      inactiveTintColor: colors.bgTextInput,
    }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        switch (route.name) {
          case "Games":
            return <GamesCountCountainer color={color} type="games" />;
          case "GamesPlaying":
            return <GamesCountCountainer color={color} type="gamesPlaying" />;
          case "GamesPlayed":
            return <GamesCountCountainer color={color} type="gamesPlayed" />;
        }
      },
    })}
  >
    <Tab.Screen name="Games" component={HomeScreen} />
    <Tab.Screen
      options={{ tabBarLabel: "Games Playing" }}
      name="GamesPlaying"
      component={GamesPlayingScreen}
    />
    <Tab.Screen
      options={{ tabBarLabel: "Games Completed" }}
      name="GamesPlayed"
      component={GamesPlayedScreen}
    />
  </Tab.Navigator>
);

const HomeStackNavigator = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.bgMain },
      headerTintColor: "white",
      headerLeft: () => (
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="ios-menu"
          size={30}
          color="white"
          style={{ marginLeft: 10 }}
        />
      ),
    }}
  >
    <Stack.Screen name="Home Tab Navigator" component={HomeTabNavigator} />
  </Stack.Navigator>
);

const AppDrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeStackNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (user) => dispatch({ type: "SIGN_IN", payload: user }),
    signOut: () => dispatch({ type: "SIGN_OUT" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BackLog);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
