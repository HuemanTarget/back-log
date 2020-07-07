import { useEffect } from "react";
import { useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";

const useAuthenticateUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          dispatch({ type: "SIGN_IN", payload: user });
        } else if(user){
          dispatch({ type: "GOOGLE_SIGN_IN" });
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
        unsubscribe();
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: "SIGN_OUT" });
    }
  }, [dispatch]);
};

export default useAuthenticateUser;
