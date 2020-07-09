import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import colors from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerItemList } from "@react-navigation/drawer";

const CustomDrawerComponent = (props) => {
  return (
    <ScrollView>
      <SafeAreaView style={{ backgroundColor: colors.bgMain }} />
      <View
        style={{
          height: 150,
          backgroundColor: colors.bgMain,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: Platform.OS == "android" ? 20 : 0,
        }}
      >
        <Ionicons
          name="logo-game-controller-b"
          size={100}
          color={colors.logoColor}
        />
        <Text style={{ fontSize: 24, color: colors.txtWhite, fontWeight: "100" }}>
          Back Log
        </Text>
      </View>
      <DrawerItemList {...props} />
    </ScrollView>
  );
};

export default CustomDrawerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
