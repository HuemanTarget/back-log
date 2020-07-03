import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../assets/colors";
import ListItem from "../../components/ListItem";
import { Ionicons } from "@expo/vector-icons";
import GameRowCompleted from "../../components/GameRowCompleted";

const GamesCompletedScreen = () => {
  const { isLoadingGames, gamesCompleted } = useSelector(
    (state) => state.games
  );

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
      // onPress: () => handleDeleteGame(item, index),
    },
  ];

  // if (!item.completed) {
  //   swipeoutButtons.unshift({
  //     text: "Mark Completed",
  //     component: (
  //       <View
  //         style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //       >
  //         <Text style={{ color: colors.txtWhite }}>Mark As Completed</Text>
  //       </View>
  //     ),
  //     backgroundColor: colors.bgSuccessDark,
  //     // onPress: () => markAsCompleted(item, index),
  //   });
  // } else {
  //   swipeoutButtons.unshift({
  //     text: "Mark Unplayed",
  //     component: (
  //       <View
  //         style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //       >
  //         <Text style={{ color: colors.txtWhite }}>Mark As Unplayed</Text>
  //       </View>
  //     ),
  //     backgroundColor: colors.bgUnread,
  //     // onPress: () => markAsUnplayed(item, index),
  //   });
  // }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
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
        data={gamesCompleted}
        renderItem={({ item }, index) => (
          <GameRowCompleted item={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          !isLoadingGames && (
            <View style={{ marginTop: 50, alignItems: "center" }}>
              <Text style={{ fontWeight: "700", color: "white" }}>
                No Games In Library
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default GamesCompletedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
