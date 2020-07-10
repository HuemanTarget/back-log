import React from "react";
import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";
import colors from "../assets/colors";


const FormButton = ({ title, buttonType, buttonColor, ...rest }) => (
  
  <Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={{ borderColor: "#aad1e6" }}
    titleStyle={{ color: colors.txtWhite }}
    style={styles.loginButtons}
  />
);

export default FormButton;

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
    // borderWidth: 0.5,
    backgroundColor: "transparent",
    // marginTop: 10,
    width: 200,
  },
});
