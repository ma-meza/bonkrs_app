import React from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";
import globalStyle from "../../assets/style/globalStyle"

export default function Button({onPress, title, style}){
    return (
        <TouchableHighlight underlayColor="#00a37a" style={[styles.button, style]} onPress={onPress}>
                <Text style={[globalStyle.regularTextBold, {color:"white"}]}>{title}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:"#00cc99",
        justifyContent:"center",
        borderRadius:10,
        alignItems:"center",
        height:55
    }
});