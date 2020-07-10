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
import GameRowCompleted from "../../components/GameRowCompleted";

const GamesCompletedScreen = () => {
  const { isLoadingGames, gamesCompleted } = useSelector(
    (state) => state.games
  );

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
              <Text style={{ fontWeight: "700", color: colors.txtWhite }}>
                No Games Completed
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
