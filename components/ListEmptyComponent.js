import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import colors from "../assets/colors";

const ListEmptyComponent = ({ text }) => {
  <View style={{ marginTop: 50, alignItems: "center" }}>
    <Text style={{ fontWeight: "bold", color: colors.txtWhite }}>{text}</Text>
  </View>;
};

ListEmptyComponent.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ListEmptyComponent;
