import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import colors from "../../assets/colors";
import { useSelector } from "react-redux";
import GameRowPlaying from "../../components/GameRowPlaying";

const GamesPlayingScreen = () => {
  const { isLoadingGames, gamesPlaying } = useSelector((state) => state.games);

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
        data={gamesPlaying}
        renderItem={({ item }, index) => (
          <GameRowPlaying item={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          !isLoadingGames && (
            <View style={{ marginTop: 50, alignItems: "center" }}>
              <Text style={{ fontWeight: "700", color: colors.txtWhite }}>
                Not Currently Playing Any Games
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default GamesPlayingScreen;
