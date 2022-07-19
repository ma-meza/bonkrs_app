//user flow:
//1st visit: home (trending groups)/search (closed groups) -> signup/signin -> pick interests -> generate feed



import 'react-native-gesture-handler';

//font hooks
import { useFonts } from "@use-expo/font";
import * as Font from "expo-font";

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Tabs from "./app/navigation/Tabs";
import GuestTabs from "./app/navigation/GuestTabs";

import SettingsScreen from "./app/screens/SettingsScreen";
import SearchFullScreen from "./app/screens/SearchFullScreen";
import SubscriptionGroupScreen from "./app/screens/SubscriptionGroupScreen";
import CommunityGroupScreen from "./app/screens/CommunityGroupScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import SigninScreen from './app/screens/SigninScreen';
import SignupScreen from "./app/screens/SignupScreen";
import ProfileOverviewScreen from "./app/screens/ProfileOverview";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react/cjs/react.development';

import { AuthContext } from './app/components/context';

const customFonts = {
  "Aktiv Regular": require("./assets/fonts/AktivGroteskCorp-Regular.ttf"),
  "Aktiv Bold": require("./assets/fonts/AktivGroteskCorp-Bold.ttf"),
  "Larsseit Bold": require("./assets/fonts/Larsseit-ExtraBold.ttf")
};

const Stack = createStackNavigator();


async function _loadFontsAsync(cb) {
  await Font.loadAsync(customFonts);
  cb();
};
if(process.env.NODE_ENV && process.env.NODE_ENV == "development"){
  window.api_prefix = "localhost:8080";
}else{
  window.api_prefix = "https://api.traderz.com";
}



export default function App() {

  const [isFontLoading, setIsFontLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null);
  // const [isAppLoading, setIsAppLoading] = useState(false);

  const initialSigninState = {
    isAppLoading: true,
    userToken: null,
    userName: null
  }
  const signinReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isAppLoading: false
        };
      case "SIGNIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isAppLoading: false
        };
      case "SIGNOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isAppLoading: false
        };
      case "SIGNUP":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isAppLoading: false
        };
    }
  }

  const [signinState, dispatch] = React.useReducer(signinReducer, initialSigninState);

  const authContext = React.useMemo(() => ({
    signIn: async (email, password) => {
      let userToken = null;
      if (email == "email" && password == "password") {
        userToken = "dmkd"
        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch (e) {
          console.log(e);
        }
      }
      dispatch({ type: "SIGNIN", id: email, token: userToken });
      // alert("Signed in");
      // setUserToken("oyooyyo");
      // setIsAppLoading(false);
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "SIGNOUT" });
    },
    signUp: () => {
      setUserToken("eidmeik");
      setIsAppLoading(false);
    }
  }), []);


  _loadFontsAsync(() => {
    setIsFontLoading(false)
  });

  useEffect(() => {
    setTimeout(async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        if (userToken != null) {
          dispatch({ type: "RETRIEVE_TOKEN", token: "dnjsdnj" });
        } else {
          dispatch({ type: "SIGNOUT" });
        }
      } catch (e) {
        console.log(e);
      }
    }, 1000);
  }, []);

  if (isFontLoading) {
    return null;
  }
  if (signinState.isAppLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" translucent={true} />
      <NavigationContainer>
        {
          signinState.userToken != null ? (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                //   cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
                //     const translateX = current.progress.interpolate({
                //         inputRange: [index - 1, index, index + 1],
                //         outputRange: [screen.width, 0, 0],
                //     });

                //     const opacity = next?.progress.interpolate({
                //       inputRange: [
                //         index - 1,
                //         index - 0.99,
                //         index,
                //         index + 0.99,
                //         index + 1
                //     ],
                //     outputRange: [0, 1, 1, 0.3, 0]
                //     });

                //     return {cardStyle: {opacity, transform: [{translateX}]}};
                // },
              }}>
              <Stack.Screen name="tabHome" component={Tabs} />
              <Stack.Screen name="settings" component={SettingsScreen} />
              <Stack.Screen name="searchfullscreen" component={SearchFullScreen} />
              <Stack.Screen name="group_screen" component={SubscriptionGroupScreen} />
              <Stack.Screen name="community_screen" component={CommunityGroupScreen} />
              <Stack.Screen name="profileOverviewScreen" component={ProfileOverviewScreen} />
            </Stack.Navigator>
          )
            :
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                //   cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
                //     const translateX = current.progress.interpolate({
                //         inputRange: [index - 1, index, index + 1],
                //         outputRange: [screen.width, 0, 0],
                //     });

                //     const opacity = next?.progress.interpolate({
                //       inputRange: [
                //         index - 1,
                //         index - 0.99,
                //         index,
                //         index + 0.99,
                //         index + 1
                //     ],
                //     outputRange: [0, 1, 1, 0.3, 0]
                //     });

                //     return {cardStyle: {opacity, transform: [{translateX}]}};
                // },
              }}>
              {/* <Stack.Screen name="welcomeScreen" component={WelcomeScreen} /> */}
              <Stack.Screen name="tabHome" component={GuestTabs} />
              <Stack.Screen name="signinScreen" component={SigninScreen} />
              <Stack.Screen name="signupScreen" component={SignupScreen} />
              <Stack.Screen name="searchfullscreen" component={SearchFullScreen} />
              <Stack.Screen name="profileOverviewScreen" component={ProfileOverviewScreen} />
            </Stack.Navigator>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}