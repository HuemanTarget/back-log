import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";

const GameCount = ({ title, count }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 20 }}>{title}</Text>
    <Text>{count}</Text>
  </View>
);

GameCount.propTypes = {
  count: PropTypes.number.isRequired,
  title: PropTypes.string,
};

GameCount.defaultProps = {
  title: "Title",
};

export default GameCount;
