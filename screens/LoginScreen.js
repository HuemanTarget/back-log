import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";

import colors from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { AppLoading } from "expo";

const fetchFonts = () => {
  return Font.loadAsync({
    "Dead-Cert": require("../assets/fonts/deadcrt.regular.ttf"),
    "P-C": require("../assets/fonts/pc-senior.regular.ttf"),
  });
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }

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
            <Text
              style={{
                fontFamily: "P-C",
                color: colors.txtWhite,
                fontWeight: "600",
              }}
            >
              Login
            </Text>
          </CustomActionButton>
          <CustomActionButton
            onPress={onSignUp}
            style={[styles.loginButtons, { borderColor: colors.bgError }]}
          >
            <Text
              style={{
                fontFamily: "P-C",
                color: colors.txtWhite,
                fontWeight: "600",
              }}
            >
              Sign Up
            </Text>
          </CustomActionButton>
          <CustomActionButton
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
            style={[styles.loginButtons, { borderColor: colors.logoColor }]}
          >
            <Text
              style={{
                fontFamily: "P-C",
                color: colors.txtWhite,
                fontWeight: "600",
              }}
            >
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
