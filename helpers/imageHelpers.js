import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const openImageLibrary = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status !== "granted") {
    alert("Sorry We Need Camera Roll Permission To Select An Image");
    return false;
  } else {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    return !result.cancelled ? result : false;
  }
};

export const openCamera = async () => {
  const { status } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA
  );

  if (status !== "granted") {
    alert("Sorry We Need Camera Permission To Use Camera");
    return false;
  } else {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.1,
      base64: true,
      allowsEditing: Platform.OS == "ios" ? false : true,
      aspect: [4, 3],
    });

    return !result.cancelled ? result : false;
  }
};

export const prepareBlob = async (imageUri) => {
  const blob = await new Promise((resolve, reject) => {
    const xml = new XMLHttpRequest();

    xml.onload = function () {
      resolve(xml.response);
    };

    xml.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Image Upload Failed"));
    };

    xml.responseType = "blob";
    xml.open("Get", imageUri, true);
    xml.send();
  });

  return blob;
};
