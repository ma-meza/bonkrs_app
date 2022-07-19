import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';



export default function WelcomeScreen({navigation, route}) {
  return (
      <SafeAreaView style={styles.container}>
      <Text>Welcome!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
