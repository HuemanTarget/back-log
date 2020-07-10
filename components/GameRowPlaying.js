import React from "react";
import { View, Text } from "react-native";
import Swipeout from "react-native-swipeout";
import colors from "../assets/colors";
import * as ImageHelpers from "../helpers/ImageHelpers";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import { useActionSheet } from "@expo/react-native-action-sheet";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import {
  toggleIsLoadingGames,
  deleteGame,
  markGameAsCompleted,
  updateGameImage,
} from "../redux/actions";

const GameRowPlaying = ({ item, index }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const { showActionSheetWithOptions } = useActionSheet();

  const markAsCompleted = async (selectedGame, index) => {
    try {
      dispatch(toggleIsLoadingGames(true));
      await firebase
        .database()
        .ref("games")
        .child(currentUser.uid)
        .child(selectedGame.key)
        .update({ completed: true });

      dispatch(markGameAsCompleted(selectedGame));
      dispatch(toggleIsLoadingGames(false));
    } catch (error) {
      console.log(error);
      dispatch(toggleIsLoadingGames(false));
    }
  };

  const uploadImage = async (image, selectedGame) => {
    const ref = firebase
      .storage()
      .ref("games")
      .child(currentUser.uid)
      .child(selectedGame.key);

    try {
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("games")
        .child(currentUser.uid)
        .child(selectedGame.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const openImageLibrary = async (selectedGame) => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      dispatch(toggleIsLoadingGames(true));
      const downloadUrl = await uploadImage(result, selectedGame);

      dispatch(updateGameImage({ ...selectedGame, uri: downloadUrl }));
      dispatch(toggleIsLoadingGames(false));
    }
  };

  const openCamera = async (selectedGame) => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      dispatch(toggleIsLoadingGames(true));
      const downloadUrl = await uploadImage(result, selectedGame);

      dispatch(updateGameImage({ ...selectedGame, uri: downloadUrl }));
      dispatch(toggleIsLoadingGames(false));
    }
  };

  const addGameImage = (selectedGame) => {
    const options = ["Select From Photos", "Camera", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          openImageLibrary(selectedGame);
        } else if (buttonIndex == 1) {
          openCamera(selectedGame);
        }
      }
    );
  };

  let swipeoutButtons = [
    {
      text: "Mark Completed",
      component: (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: colors.txtWhite }}>Mark As Completed</Text>
        </View>
      ),
      backgroundColor: colors.bgSuccessDark,
      onPress: () => markAsCompleted(item, index),
    },
  ];

  return (
    <Swipeout
      autoClose={true}
      style={{ marginHorizontal: 5, marginVertical: 5 }}
      backgroundColor={colors.bgMain}
      right={swipeoutButtons}
    >
      <ListItem
        editable={true}
        onPress={() => addGameImage(item)}
        marginVertical={0}
        item={item}
      ></ListItem>
    </Swipeout>
  );
};

export default GameRowPlaying;
