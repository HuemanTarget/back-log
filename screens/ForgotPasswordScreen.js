import React, { Component, Fragment } from "react";
import { Text, SafeAreaView, View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import ErrorMessage from "../components/ErrorMessage";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
});

class ForgotPasswordScreen extends Component {
  handlePasswordReset = async (values, actions) => {
    const { email } = values;

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        alert("Please check your email...");
      });
    this.props.navigation.navigate("LoginScreen").catch(function (e) {
      console.log(e);
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgMain }}>
        <View>
          <Text style={styles.text}>Forgot Password?</Text>
        </View>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values, actions) => {
            this.handlePasswordReset(values, actions);
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
            <Fragment>
              <FormInput
                name="email"
                value={values.email}
                onChangeText={handleChange("email")}
                placeholder="Enter email"
                autoCapitalize="none"
                onBlur={handleBlur("email")}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <View
                style={[styles.loginButtons, { borderColor: colors.bgPrimary }]}
              >
                <FormButton
                  buttonType="outline"
                  onPress={handleSubmit}
                  title="Send Email"
                  buttonColor="#039BE5"
                  disabled={!isValid || isSubmitting}
                />
              </View>
              <ErrorMessage errorValue={errors.general} />
            </Fragment>
          )}
        </Formik>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  text: {
    color: colors.txtWhite,
    fontSize: 24,
    marginLeft: 25,
    alignContent: "center",
    justifyContent: "center",
    marginTop: "40%",
    marginLeft: "27%",
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
  buttonContainer: {
    margin: 25,
  },
  loginButtons: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200,
    marginLeft: "25%",
    overflow: "hidden",
  },
});

export default ForgotPasswordScreen;
