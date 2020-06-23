import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import * as ImageHelpers from "../helpers/ImageHelpers";

import GameCount from "../components/GameCount";
import CustomActionButton from "../components/CustomActionButton";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import ListItem from "../components/ListItem";
import Swipeout from "react-native-swipeout";

import { Ionicons } from "@expo/vector-icons";

import colors from "../assets/colors";

import * as firebase from "firebase/app";
import "firebase/storage";

import * as Animatable from "react-native-animatable";
import games from "../redux/reducers/GamesReducer";

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: {},
      totalCount: 0,
      playingCount: 0,
      playedCount: 0,
      isAddNewGameVisible: false,
      textInputData: "",
      games: [],
      gamesPlaying: [],
      gamesPlayed: [],
    };
    console.log("constructor");
    this.textInputRef = null;
  }

  componentDidMount = async () => {
    const user = this.props.currentUser;

    const currentUserData = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    const games = await firebase
      .database()
      .ref("games")
      .child(user.uid)
      .once("value");

    const gamesArray = snapshotToArray(games);

    this.setState({
      currentUser: currentUserData.val(),
    });

    this.props.loadGames(gamesArray.reverse());
    this.props.toggleIsLoadingGames(false);
  };

  showAddNewGame = () => {
    this.setState({ isAddNewGameVisible: true });
  };

  hideAddNewGame = () => {
    this.setState({ isAddNewGameVisible: false });
  };

  addGame = async (game) => {
    this.setState({ textInputData: "" });
    this.textInputRef.setNativeProps({ text: "" });
    try {
      this.props.toggleIsLoadingGames(true);
      const snapshot = await firebase
        .database()
        .ref("games")
        .child(this.state.currentUser.uid)
        .orderByChild("name")
        .equalTo(game)
        .once("value");

      if (snapshot.exists()) {
        alert("Unable to add. Game already exists.");
      } else {
        const key = await firebase
          .database()
          .ref("games")
          .child(this.state.currentUser.uid)
          .push().key;

        const response = await firebase
          .database()
          .ref("games")
          .child(this.state.currentUser.uid)
          .child(key)
          .set({ name: game, played: false });

        this.props.addGame({ name: game, played: false, key: key });
        this.props.toggleIsLoadingGames(false);
      }
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingGames(false);
    }
  };

  markAsPlayed = async (selectedGame, index) => {
    try {
      this.props.toggleIsLoadingGames(true);
      await firebase
        .database()
        .ref("games")
        .child(this.state.currentUser.uid)
        .child(selectedGame.key)
        .update({ played: true });

      let games = this.state.games.map((game) => {
        if (game.name == selectedGame.name) {
          return { ...game, played: true };
        }
        return game;
      });
      let gamesPlaying = this.state.gamesPlaying.filter(
        (game) => game.name !== selectedGame.name
      );
      this.setState((prevState) => ({
        games: games,
        gamesPlaying: gamesPlaying,
        gamesPlayed: [
          ...prevState.gamesPlayed,
          { name: selectedGame.name, played: true },
        ],
      }));

      this.props.markGameAsPlayed(selectedGame);
      this.props.toggleIsLoadingGames(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingGames(false);
    }
  };

  markAsUnplayed = async (selectedGame, index) => {
    try {
      this.props.toggleIsLoadingGames(true);
      await firebase
        .database()
        .ref("games")
        .child(this.state.currentUser.uid)
        .child(selectedGame.key)
        .update({ played: false });
      this.props.markGameAsUnplayed(selectedGame);
      this.props.toggleIsLoadingGames(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingGames(false);
    }
  };

  deleteGame = async (selectedGame, index) => {
    try {
      this.props.toggleIsLoadingGames(true);
      await firebase
        .database()
        .ref("games")
        .child(this.state.currentUser.uid)
        .child(selectedGame.key)
        .remove();

      this.props.deleteGame(selectedGame);
      this.props.toggleIsLoadingGames(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingGames(false);
    }
  };

  uploadImage = async (image, selectedGame) => {
    const ref = firebase
      .storage()
      .ref("games")
      .child(this.state.currentUser.uid)
      .child(selectedGame.key);

    try {
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("games")
        .child(this.state.currentUser.uid)
        .child(selectedGame.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  openImageLibrary = async (selectedGame) => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      this.props.toggleIsLoadingGames(true);
      const downloadUrl = await this.uploadImage(result, selectedGame);

      this.props.updateGameImage({ ...selectedGame, uri: downloadUrl });
      this.props.toggleIsLoadingGames(false);
    }
  };

  openCamera = async (selectedGame) => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      this.props.toggleIsLoadingGames(true);
      const downloadUrl = await this.uploadImage(result, selectedGame);

      this.props.updateGameImage({ ...selectedGame, uri: downloadUrl });
      this.props.toggleIsLoadingGames(false);
    }
  };

  addGameImage = (selectedGame) => {
    const options = ["Select From Photos", "Camera", "Cancel"];
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          this.openImageLibrary(selectedGame);
        } else if (buttonIndex == 1) {
          this.openCamera(selectedGame);
        }
      }
    );
  };

  renderItem = (item, index) => {
    let swipeoutButtons = [
      {
        text: "Delete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => this.deleteGame(item, index),
      },
    ];

    if (!item.played) {
      swipeoutButtons.unshift({
        text: "Mark Played",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark As Played</Text>
          </View>
        ),
        backgroundColor: colors.bgSuccessDark,
        onPress: () => this.markAsPlayed(item, index),
      });
    } else {
      swipeoutButtons.unshift({
        text: "Mark Unplayed",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.txtWhite }}>Mark Unplayed</Text>
          </View>
        ),
        backgroundColor: colors.bgUnread,
        onPress: () => this.markAsUnplayed(item, index),
      });
    }

    return (
      <Swipeout
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
      >
        <ListItem
          editable={true}
          onPress={() => this.addGameImage(item)}
          marginVertical={0}
          item={item}
        >
          {item.played && (
            <Ionicons
              style={{ marginRight: 10 }}
              name="ios-checkmark"
              color={colors.logoColor}
              size={30}
            />
          )}
        </ListItem>
      </Swipeout>
    );
  };

  render() {
    console.log("render");
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
        <SafeAreaView />

        <View style={{ flex: 1 }}>
          {this.props.games.isLoadingGames && (
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
              onChangeText={(text) => this.setState({ textInputData: text })}
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
              ref={(component) => {
                this.textInputRef = component;
              }}
            />
          </View>

          <FlatList
            data={this.props.games.games}
            renderItem={({ item }, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              !this.props.isLoadingGames && (
                <View style={{ marginTop: 50, alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", color: colors.txtWhite }}>
                    Not Playing Any Games
                  </Text>
                </View>
              )
            }
          />

          <Animatable.View
            animation={
              this.state.textInputData.length > 0
                ? "slideInRight"
                : "slideOutRight"
            }
          >
            <CustomActionButton
              position="right"
              style={{ backgroundColor: colors.bgPrimary, borderRadius: 25 }}
              onPress={() => this.addGame(this.state.textInputData)}
            >
              <Text style={{ color: "white", fontSize: 30 }}>+</Text>
            </CustomActionButton>
          </Animatable.View>
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.games,
    currentUser: state.auth.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadGames: (games) =>
      dispatch({ type: "LOAD_GAMES_FROM_SERVER", payload: games }),
    addGame: (game) => dispatch({ type: "ADD_GAME", payload: game }),
    markGameAsPlayed: (game) =>
      dispatch({ type: "MARK_GAME_AS_PLAYED", payload: game }),
    markGameAsUnplayed: (game) =>
      dispatch({ type: "MARK_GAME_AS_UNPLAYED", payload: game }),
    toggleIsLoadingGames: (bool) =>
      dispatch({ type: "TOGGLE_IS_LOADING_GAMES", payload: bool }),
    deleteGame: (game) => dispatch({ type: "DELETE_GAME", payload: game }),
    updateGameImage: (game) =>
      dispatch({ type: "UPDATE_GAME_IMAGE", payload: game }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(HomeScreen);

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
