import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";
import CustomActionButton from "../../components/CustomActionButton";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "@expo-google-fonts/dev";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    "Dead-Cert": require("../../assets/fonts/deadcrt.regular.ttf"),
    "P-C": require("../../assets/fonts/pc-senior.regular.ttf"),
  });

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
          style={{ marginTop: 70 }}
        />
        <Text
          style={{
            fontFamily: "Dead-Cert",
            fontSize: 40,
            fontWeight: "500",
            color: "white",
            marginBottom: 10,
          }}
        >
          Back Log
        </Text>
        <Text
          style={{
            fontFamily: "P-C",
            fontSize: 12,
            fontWeight: "300",
            color: "white",
            marginTop: 20,
          }}
        >
          A Simple Place To Keep Track
        </Text>
        <Text
          style={{
            fontFamily: "P-C",
            fontSize: 12,
            fontWeight: "300",
            color: "white",
            marginTop: 10,
          }}
        >
          Of Your Video Game Library
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
