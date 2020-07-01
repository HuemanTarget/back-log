import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/actions";

const LogoutScreen = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      dispatch(signOut());
    } catch (error) {
      alert("Unable to sign out right now.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomActionButton
        style={{
          width: 200,
          backgroundColor: "transparent",
          borderWidth: 0.5,
          borderColor: colors.bgError,
        }}
        title="Signup"
        onPress={handleSignOut}
      >
        <Text style={{ fontWeight: "500", color: "white" }}>Log Out</Text>
      </CustomActionButton>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain,
  },
});
