import { AuthContext } from '../components/context';
import React, {useState} from 'react';
import { StyleSheet, Text, View,TextInput, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import CustomButton from "../components/button";
const globalStyle = require('../../assets/style/globalStyle');



export default function FullPageScreen({navigation, route, pageName, children}) {
    const {signIn} = React.useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorText, setErrorText] = useState("");

    const [isEmailActive, setEmailActive] = useState(false);
    const [isPasswordActive, setPasswordActive] = useState(false);
    const handleLogin = (email, pass) => {
        if(email.length>0 && password.length>0){
            signIn(email, pass);
        }else{
            setErrorText("Please fill in your email and password.");
        }
    };
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate('tabHome', {})}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={globalStyle.title1}>Sign in</Text>
        </View>
        <View style={styles.contentContainer}>
            {errorText.length>0? <Text style={[globalStyle.errorText, {marginBottom:15}]}>{errorText}</Text>:null}
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Email</Text>
            <TextInput blurOnSubmit={true} style={[styles.inputText, globalStyle.regularText, {backgroundColor:isEmailActive?"#fff":"#e1e1e1", borderWidth:isEmailActive?1:null, borderColor:isEmailActive?"#000":null}]} value={email} onBlur={()=>{setEmailActive(false)}} onFocus={()=>{setEmailActive(true)}} onChangeText={setEmail}/>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}>Password</Text>
            <TextInput blurOnSubmit={true} style={[styles.inputText, globalStyle.regularText, {backgroundColor:isPasswordActive?"#fff":"#e1e1e1", borderWidth:isPasswordActive?1:null, borderColor:isPasswordActive?"#000":null}]} value={password} onBlur={()=>{setPasswordActive(false)}} onFocus={()=>{setPasswordActive(true)}} onChangeText={setPassword}/>
            <TouchableWithoutFeedback onPress={()=>{navigation.navigate('signupScreen')}}>
                <Text style={[globalStyle.regularTextBold, {marginBottom:30, textDecorationLine:"underline"}]}>Don't have an account?</Text>
            </TouchableWithoutFeedback>
            <CustomButton title="Continue" onPress={()=>{handleLogin(email, password)}}/>
        </View>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    width:"100%",
    backgroundColor:"#fff",
    top:0,
    height:80,
    justifyContent:"flex-start",
    alignItems:"center",
    paddingLeft:15,
    flexDirection:"row"
  },
  arrowImage:{
      height:40,
      width:40,
      marginRight:10
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      backgroundColor:"#fff",
      alignSelf:"stretch",
      flex:1,
      paddingLeft:15,
      paddingRight:15
  },
  inputText:{
    borderRadius:10,
    height:55,
    marginBottom:15,
    paddingLeft:10,
    paddingRight:10
  },
  activeInput:{
      borderColor:"#000",
      borderWidth:1
  },
  button:{
      backgroundColor:"#00cc99",
      justifyContent:"center",
      borderRadius:10,
      alignItems:"center",
      height:55
  }
});
