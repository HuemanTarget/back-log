import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";
import CustomActionButton from "../../components/CustomActionButton";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="logo-game-controller-b"
          size={150}
          color={colors.logoColor}
        />
        <Text style={{ fontSize: 50, fontWeight: "400", color: "white" }}>
          Back Log
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "250",
            color: "white",
            marginTop: 10,
          }}
        >
          A Place To Keep Track Of Your Video Game Library
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <CustomActionButton
          style={{
            width: 200,
            backgroundColor: "transparent",
            borderWidth: 0.5,
            borderColor: colors.bgPrimary,
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={{ fontWeight: "600", color: "white" }}>Login</Text>
        </CustomActionButton>
      </View>
    </View>
  );
};

export default WelcomeScreen;
