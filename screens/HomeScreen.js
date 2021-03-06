import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  Picker,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import GameRow from "../components/GameRow";
import { loadGames, toggleIsLoadingGames, addGame } from "../redux/actions";
import ActionButton from "react-native-action-button";
import { Dropdown } from "react-native-material-dropdown";

const HomeScreen = () => {
  const [textInputData, setTextInputData] = useState("");
  const [systemInputData, setSystemInputData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const textInputRef = useRef();
  const systemInputRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);

  let data = [
    {
      value: "Banana",
    },
    {
      value: "Mango",
    },
    {
      value: "Pear",
    },
  ];

  useEffect(() => {
    const fetchGames = async () => {
      const games = await firebase
        .database()
        .ref("games")
        .child(user.uid)
        .once("value");

      const gamesArray = snapshotToArray(games);

      dispatch(loadGames(gamesArray.reverse()));
      dispatch(toggleIsLoadingGames(false));
    };

    fetchGames();
  }, [dispatch, user]);

  const { isLoadingGames, games } = useSelector((state) => state.games);

  const handleAddGame = async (game, system) => {
    if (game && system) {
      setTextInputData("");
      setSystemInputData("");
      textInputRef.current.setNativeProps({ text: "" });
      systemInputRef.current.setNativeProps({ text: "" });
      try {
        const snapshot = await firebase
          .database()
          .ref("games")
          .child(user.uid)
          .orderByChild("name")
          .equalTo(game)
          .once("value");

        if (snapshot.exists()) {
          alert("Unable to add. Game already exists.");
        } else {
          const key = await firebase
            .database()
            .ref("games")
            .child(user.uid)
            .push().key;

          const response = await firebase
            .database()
            .ref("games")
            .child(user.uid)
            .child(key)
            .set({
              name: game,
              system: system,
              completed: false,
              platinum: false,
            });

          dispatch(
            addGame({
              name: game,
              system: system,
              completed: false,
              platinum: false,
              key: key,
            })
          );
          setModalVisible(!modalVisible);
        }
      } catch (error) {
        console.log(error);
        dispatch(isLoadingGames(false));
      }
    } else {
      alert("Please Enter A Game And System.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
      <SafeAreaView />

      <View style={{ flex: 1 }}>
        {isLoadingGames && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000,
            }}
          >
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        )}

        <FlatList
          data={games}
          renderItem={({ item }, index) => (
            <GameRow item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !isLoadingGames && (
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text style={{ fontWeight: "700", color: colors.txtWhite }}>
                  No Games In Library
                </Text>
              </View>
            )
          }
        />

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ height: 50, flexDirection: "row", margin: 5 }}>
                  <TextInput
                    onChangeText={(text) => setTextInputData(text)}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      paddingLeft: 5,
                      borderColor: colors.listItemBg,
                      borderBottomWidth: 5,
                      fontSize: 22,
                      fontWeight: "200",
                      color: "blue",
                    }}
                    placeholder="Enter Game Name"
                    placeholderTextColor={"blue"}
                    ref={textInputRef}
                  />
                </View>
                <View style={{ height: 50, flexDirection: "row", margin: 5 }}>
                  <TextInput
                    onChangeText={(text) => setSystemInputData(text)}
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      paddingLeft: 5,
                      borderColor: colors.listItemBg,
                      borderBottomWidth: 5,
                      fontSize: 22,
                      fontWeight: "200",
                      color: "blue",
                    }}
                    placeholder="Which System"
                    placeholderTextColor={"blue"}
                    ref={systemInputRef}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: colors.listItemBg,
                    }}
                    onPress={() =>
                      handleAddGame(textInputData, systemInputData)
                    }
                  >
                    <Text style={styles.textStyle}>Add Game</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: colors.bgDelete,
                      marginLeft: 15,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => setModalVisible(true)}
        ></ActionButton>
      </View>
      <SafeAreaView />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: 50,
    width: 50,
    backgroundColor: "red",
  },
  text: {
    textAlign: "center",
    justifyContent: "center",
    color: colors.txtWhite,
    fontSize: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.txtWhite,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: colors.txtWhite,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});
