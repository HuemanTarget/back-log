import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CustomActionButton from "../components/CustomActionButton";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import * as Animatable from "react-native-animatable";
import GameRow from "../components/GameRow";
import { loadGames, toggleIsLoadingGames, addGame } from "../redux/actions";

const HomeScreen = () => {
  const [textInputData, setTextInputData] = useState("");
  const textInputRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);

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

  const handleAddGame = async (game) => {
    setTextInputData("");
    textInputRef.current.setNativeProps({ text: "" });
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
          .set({ name: game, completed: false });

        dispatch(addGame({ name: game, completed: false, key: key }));
      }
    } catch (error) {
      console.log(error);
      dispatch(isLoadingGames(false));
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
              color: colors.txtWhite,
            }}
            placeholder="Enter Game Name"
            placeholderTextColor={colors.txtWhite}
            ref={textInputRef}
          />
        </View>

        <FlatList
          data={games}
          renderItem={({ item }, index) => (
            <GameRow item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !isLoadingGames && (
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: 'colors.txtWhite' }}>
                  No Games In Library
                </Text>
              </View>
            )
          }
        />

        <Animatable.View
          animation={
            textInputData.length > 0 ? "slideInRight" : "slideOutRight"
          }
        >
          <CustomActionButton
            position="right"
            style={{ backgroundColor: colors.bgPrimary, borderRadius: 25 }}
            onPress={() => handleAddGame(textInputData)}
          >
            <Text style={{ color: "white", fontSize: 30 }}>+</Text>
          </CustomActionButton>
        </Animatable.View>
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
    color: "white",
    fontSize: 50,
  },
});
