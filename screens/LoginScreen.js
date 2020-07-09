import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import LoadingScreen from "./AppSwitchNavigator/LoadingScreen";

import colors from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-google-app-auth";

import {
  FACEBOOK_APP_ID,
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
} from "react-native-dotenv";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onSignIn = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          setIsLoading(false);
          dispatch({ type: "SIGN_IN", payload: response.user });
        }
      } catch (error) {
        setIsLoading(false);
        switch (error.code) {
          case "auth/user-not-found":
            alert("A user with that email does not exist. Try signing up.");
            break;
          case "auth/invalid-email":
            alert("Please enter a valid email address");
            break;
          default:
            alert(error.code);
        }
      }
    } else {
      alert("Please enter email and password.");
    }
  };

  const onSignUp = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        if (response) {
          setIsLoading(false);
          const user = await firebase
            .database()
            .ref("users/")
            .child(response.user.uid)
            .set({ email: response.user.email, uid: response.user.uid });
          dispatch({ type: "SIGN_IN", payload: response.user });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.code == "auth/email-already-in-use") {
          alert("User already exists. Try logging in.");
        }
      }
    } else {
      alert("Please enter email and password.");
    }
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await Google.logInAsync({
  //       iosClientId: IOS_CLIENT_ID,
  //       androidClientId: ANDROID_CLIENT_ID,
  //       scopes: ["profile", "email"],
  //     });
  //     if (result.type === "success") {
  //       // console.log("LoginScreen.js.js 21 | ", result.user);
  //       setIsLoading(false);
  //       const user = await firebase
  //         .database()
  //         .ref("users/")
  //         .child(result.user.id)
  //         .set({ email: result.user.email, uid: result.user.id });
  //       // user.uid = result.user.email;
  //       dispatch({ type: "SIGN_IN", payload: result.user });
  //       // dispatch({ type: "GOOGLE_SIGN_IN", payload: result.user.id }); //after Google login redirect to Profile
  //       return result.accessToken;
  //     } else {
  //       return { cancelled: true };
  //     }
  //   } catch (e) {
  //     console.log("LoginScreen.js.js 30 | Error with login", e);
  //     return { error: true };
  //   }
  // };

  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await Google.logInAsync({
  //       iosClientId: IOS_CLIENT_ID,
  //       // androidClientId: ANDROID_CLIENT_ID,
  //       scopes: ["profile", "email"],
  //     });

  //     if (result.type === "success") {
  //       console.log("LoginScreen.js.js 21 | ", result.user.givenName);
  //       // dispatch({ type: "SIGN_IN", payload: result.user });
  //       navigation.navigate("HomeScreen", {
  //         screen: "HomeScreen",
  //         params: { user: result.user.email },
  //       });
  //       // <LoadingScreen />;
  //       //after Google login redirect to Profile
  //       return result.accessToken;
  //     } else {
  //       return { cancelled: true };
  //     }
  //   } catch (e) {
  //     console.log("LoginScreen.js.js 30 | Error with login", e);
  //     return { error: true };
  //   }
  // };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000,
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.logoColor} />
        </View>
      ) : null}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          style={styles.textInput}
          placeholder="abc@example.com"
          placeholderTextColor="#b6b6b6"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="enter password [8 letters - numbers long]"
          placeholderTextColor="#b6b6b6"
          autoCapitalize="none"
          secureTextEntry
          onChangeText={(password) => setPassWord(password)}
        />
        <View style={{ alignItems: "center" }}>
          <CustomActionButton
            onPress={onSignIn}
            style={[styles.loginButtons, { borderColor: colors.bgPrimary }]}
          >
            <Text style={{ color: colors.txtWhite, fontWeight: "600" }}>Login</Text>
          </CustomActionButton>
          <CustomActionButton
            onPress={onSignUp}
            style={[styles.loginButtons, { borderColor: colors.bgError }]}
          >
            <Text style={{ color: colors.txtWhite, fontWeight: "600" }}>Sign Up</Text>
          </CustomActionButton>
          <CustomActionButton
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
            style={[styles.loginButtons, { borderColor: colors.logoColor }]}
          >
            <Text style={{ color: colors.txtWhite, fontWeight: "600" }}>
              Forgot Password
            </Text>
          </CustomActionButton>
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.txtWhite,
    paddingHorizontal: 10,
  },
  loginButtons: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200,
  },
});
