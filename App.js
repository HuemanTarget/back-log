import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

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
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
