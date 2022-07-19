import React from 'react';
import { StyleSheet, Platform, StatusBar,SafeAreaView, ScrollView } from 'react-native';
const globalStyle = require('../../assets/style/globalStyle');



export default function SemiFullPageScreen({children}) {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollView:{
        width:"100%",
        height:"100%"
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    paddingBottom:65
  }
});
