import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Font from "expo-font";
import { AppLoading } from "expo";

import colors from "../assets/colors";

const fetchFonts = () => {
  return Font.loadAsync({
    "Dead-Cert": require("../assets/fonts/deadcrt.regular.ttf"),
    "P-C": require("../assets/fonts/pc-senior.regular.ttf"),
  });
};

const ListItem = ({
  item,
  children,
  marginVertical,
  editable,
  onPress,
  fontsLoaded,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }

  return (
    <View
      style={{
        minHeight: 100,
        flexDirection: "row",
        backgroundColor: colors.listItemBg,
        alignItems: "center",
      }}
    >
      <View style={{ height: 70, width: 70, marginLeft: 10 }}>
        <TouchableOpacity
          disabled={!editable}
          style={{ flex: 1 }}
          onPress={() => onPress(item)}
        >
          {item.image ? (
            <NetworkImage
              source={{ uri: item.image }}
              style={{ flex: 1, height: null, width: null, borderRadius: 35 }}
              imageStyle={{ borderRadius: 35 }}
              indicator={() => (
                <AnimatedCircularProgress
                  size={70}
                  width={5}
                  fill={100}
                  tintColor={colors.logoColor}
                  backgroundColor={colors.bgMain}
                />
              )}
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: colors.logoColor,
                unfilledColor: "rgba(200,200,200,0.2)",
              }}
            />
          ) : (
            <Image
              source={require("../assets/iconThree.png")}
              style={{ flex: 1, height: null, width: null }}
            />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#EAF0F1",
            fontWeight: "bold",
            marginLeft: 10,
            fontFamily: "Dead-Cert",
            marginBottom: 5,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: "#EAF0F1",
            fontWeight: "bold",
            marginLeft: 10,
            fontFamily: "P-C",
          }}
        >
          {item.system}
        </Text>
      </View>
      {children}
    </View>
  );
};

ListItem.defaultProps = {
  marginVertical: 5,
  editable: false,
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
