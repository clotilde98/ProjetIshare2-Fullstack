import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Axios from '../../src/service/api.js';

export default function Username(){
    const [fontsLoaded]=useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    })
    const [username, setUsername] = useState(''); 

    if (!fontsLoaded) {
        return <Text>Chargement...</Text>; 
    }

    async function handleSubmit () {
        try {
            if (!username) {
                Alert.alert("Username required");
            } else {
                const res = await Axios.patch("users", {username});
                navigation.navigate('UserAddress');
            }
            
        } catch (err) {
            Alert.alert(err.response.data);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/background2.png')} style={styles.image} resizeMode="cover">
                <View style={styles.textContainer}>
                    <Text style={styles.text1}>What is your</Text>  
                    <Text style={styles.text2}>username ?</Text>  
                    <TextInput placeholder='Username' onChangeText={setUsername} style={styles.input}></TextInput>
                </View>    
                
                <Button onPress={handleSubmit} buttonColor= 'black' textColor="white" labelStyle = {{fontSize:14, fontFamily: 'Poppins_700Bold'}} style={styles.button} >Next</Button>
            </ImageBackground>
            
        
        </View>


    ); 
}

const styles=StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',     
    }, 

    textContainer: {
        marginBottom:20,
        marginLeft: 20
    }, 

    text1: {
        
        marginLeft: 15,  
        fontFamily: 'Poppins_400Regular', 
        fontSize: 55, 
        fontWeight:'bold', 
        letterSpacing:-3
    }, 
    text2 : {
        fontFamily: 'Poppins_400Regular',
        fontSize: 44, 
        marginTop: 1,
        alignSelf: 'flex-start',
        marginLeft: 10  

    },
    
    button: {
        marginLeft:259, 
        width: 102,
        height: 45, 
        borderRadius: 25,  
        justifyContent: 'center', 

    }, 
    input: {
        backgroundColor:'white', 
        marginLeft:20,
        borderRadius: 39,
        width: '80%'
    },

    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },


}


)