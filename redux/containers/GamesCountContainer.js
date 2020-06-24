import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";
import colors from "../../assets/colors";
import PropTypes from "prop-types";

const GamesCountContainer = ({ color, type, ...props }) => (
  <View>
    <Text style={{ color: color }}>{props.books[type].length || 0}</Text>
  </View>
);

const mapStateToProps = (state) => {
  return {
    games: state.games,
  };
};

GamesCountContainer.defaultProps = {
  color: colors.txtPlaceholder,
};

GamesCountContainer.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(GamesCountContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
