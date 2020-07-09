import React from "react";
import { StyleSheet } from "react-native";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import LogoutScreen from "./screens/LogoutScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import GamesPlayingScreen from "./screens/HomeTabNavigator/GamesPlayingScreen";
import GamesCompletedScreen from "./screens/HomeTabNavigator/GamesCompletedScreen";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "./assets/colors";
import "firebase/auth";
import { useSelector } from "react-redux";
import SplashScreen from "./screens/SplashScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import GamesCountCountainer from "./redux/containers/GamesCountCountainer";
import { Ionicons } from "@expo/vector-icons";
import useAuthenticateUser from "./hooks/useAuthenticateUser";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BackLog = () => {
  useAuthenticateUser();

  const auth = useSelector((state) => state.auth);

  if (auth.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!auth.isSignedIn ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.bgMain,
            },
            headerTintColor: "white",
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
            options={{ headerBackTitleVisible: false, title: "Login" }}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{
              headerBackTitleVisible: false,
              title: "Forgot Password",
            }}
          />
        </Stack.Navigator>
      ) : (
        <ActionSheetProvider>
          <AppDrawerNavigator />
        </ActionSheetProvider>
      )}
    </NavigationContainer>
  );
};

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
          case "GamesCompleted":
            return <GamesCountCountainer color={color} type="gamesCompleted" />;
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
      name="GamesCompleted"
      component={GamesCompletedScreen}
    />
  </Tab.Navigator>
);

const getHeaderTitle = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : "Home";

  switch (routeName) {
    case "Home":
      return "Games Library";
    case "GamesPlaying":
      return "Games Playing";
    case "GamesCompleted":
      return "Games Completed";
  }
};

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
    <Stack.Screen
      options={({ route }) => ({
        title: getHeaderTitle(route),
      })}
      name="Games"
      component={HomeTabNavigator}
    />
  </Stack.Navigator>
);

const AppDrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerComponent {...props} />}
  >
    <Drawer.Screen
      options={{ drawerIcon: () => <Ionicons name="ios-home" size={24} /> }}
      name="Home"
      component={HomeStackNavigator}
    />
    <Drawer.Screen
      options={{ drawerIcon: () => <Ionicons name="ios-log-out" size={24} /> }}
      name="Log Out"
      component={LogoutScreen}
    />
  </Drawer.Navigator>
);

export default BackLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
