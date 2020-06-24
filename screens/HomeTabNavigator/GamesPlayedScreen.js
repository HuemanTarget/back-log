import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import colors from "../../assets/colors";
import ListItem from "../../components/ListItem";
import { connect } from "react-redux";

class GamesPlayedScreen extends Component {
  renderItem = (item) => {
    return <ListItem item={item} />;
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
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
        <FlatList
          data={this.props.games.gamesPlayed}
          renderItem={({ item }, index) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !this.props.isLoadingGames && (
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: colors.txtWhite }}>
                  You Haven't Played Any Games
                </Text>
              </View>
            )
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.games,
  };
};

export default connect(mapStateToProps)(GamesPlayedScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
