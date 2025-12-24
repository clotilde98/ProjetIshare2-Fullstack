import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import InputComponent from './input.jsx';
import Axios from '../../src/service/api.js';
import * as tokenService from '../../src/service/token.js';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/authContext.js';

import { Poppins_400Regular } from '@expo-google-fonts/poppins';



import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';


export default function Connexion({isSignUp, navigation}) {
    const [fontsLoaded] = useFonts({
        Jaro: require('../../assets/fonts/jaro.ttf'), 
        Poppins: Poppins_400Regular,
    });

    const { user, setUser } = useContext(AuthContext);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');



    const handleGoogleSignIn = async () => {
        
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn(
            {
                prompt: 'select_account'
            }
            );
        if (isSuccessResponse(response)) {
            try {
              const res = await Axios.post("/loginWithGoogle", {
                idToken: response.data.idToken,
              });
              await tokenService.saveToken(res.data.token);
              console.log(res.data.token);
              setUser(res.data.user);
            } catch (err){
              Alert.alert(
                "Erreur backend",
                `\nMessage: ${err.response.data}`
              );
            }
            
        } else {
            alert("Sign in was cancelled by the user")
        }
        } catch (error){
            if (isErrorWithCode(error)) {
                switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    alert("sign in is in progress");
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    alert("play service not available")
                    break;
                
                }
            } else {
                
                // an error that's not related tro google sign in occurred
                Alert.alert("an error that's not related to google sign in occurred");
            }
        }
    }
    

    const handleGoogleSignOut = async () => {
        try {
        await GoogleSignin.signOut();
        tokenService.removeToken();
        setUser(null);
        } catch (error){
          Alert.alert("Failed to log out");
        }
    }


  async function handleSubmit() {
    if (!email || !password) return;

    if (isSignUp){
      if (!secondPassword || secondPassword !== password){
        return alert("Password must match");
      }
    }

    try {
      let res;
      if (isSignUp){
        res = await Axios.post(
          '/users',
          { email, password }
        );
      } else {
        res = await Axios.post(
          '/login',
          { email, password }
        );
      }

        await tokenService.saveToken(res.data.token)
        setUser(res.data.user);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data;

      if (status === 401) {
        Alert.alert(
          "Erreur de connexion", message
        );
      } else {
        Alert.alert(message);
      }
    }
  }


  if (!fontsLoaded) {
    return <Text>Chargement...</Text>; 
  }

  return (
    <View style={styles.container}>    
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={[
            styles.text,
            isSignUp && { fontFamily: 'HachiMaruPop', fontWeight: "bold", fontSize: 35 }
          ]}
        >
          {isSignUp ? "Create an account" : "Welcome !"}
        </Text>
      </View> 



      <View>
        <Text style={styles.loginMode}>{isSignUp ? "Sign up":"Login"}</Text>
        <InputComponent textValue="Email" secureTextEntry={false} secureEye={false} onChangeText={setEmail}/>
        <InputComponent textValue="Password" secureTextEntry={true} secureEye={true} onChangeText={setPassword} />
        {isSignUp ? (<InputComponent textValue="Confirm Password" secureTextEntry={true} secureEye={true} onChangeText={setSecondPassword} />):("")}
        {isSignUp ? (""): (
          <Pressable onPress={handleSubmit}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </Pressable>
          )}
        
      </View>
      
      
      <Button style={styles.button} buttonColor= 'black' textColor="white" contentStyle={{ height: 50 }} onPress={handleSubmit}>Sign {isSignUp ? "Up":"In"}</Button>

      <View style={styles.orLine}>
        <View style={styles.line}></View>
        <Text style={styles.orText}> Or </Text>
        <View style={styles.line}></View>
      </View>

    <Pressable style={styles.singInTextWithGoogle} onPress={handleGoogleSignIn}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/images/google-icon.png')} style={{ width: 24, height: 24, marginRight: 10 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Sign {isSignUp ? "Up":"In"} with Google</Text>
        </View>
    </Pressable>
      
      <View style={{ flexDirection: 'column', alignItems: 'center', margin: 15 }}>
        <Text style={{fontWeight:"bold", margin:15}}>{isSignUp ? "You already have an account?":"Don't have an account?"}</Text>
        
        <Pressable onPress={() => (isSignUp ? navigation.navigate("Signup") : navigation.navigate("Login")) }>
          <Text style={[styles.signUp, { color: "gray" }]}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop:20,
    borderRadius: 12,
    width: '80%',
    height: '75%',
    backgroundColor: '#fff'
  },
  text : {
    marginTop: 35,
    marginBottom: 23,
    fontFamily: 'Jaro', 
    fontSize: 46,
  },

  loginMode : {
    fontFamily: "Poppins",
    fontWeight:"bold",
    fontSize: 24,
    marginBottom: 25,
    marginLeft: 5
  },

  button: {
    width: '80%',
    borderRadius: 6,
    marginBottom: 10,
    marginTop:10,
  },

  forgotText: {
    marginTop: -10,
    marginBottom: 25,
    fontSize: 10,
    color: '#E1ACA0', 
    alignSelf: 'flex-end'
  },

  orLine : {
    marginTop: 20,
    marginBottom: 20,
    flexDirection : 'row',
    justifyContent: 'flex-start'
  },

  orText : {
    color: 'lightgray',
    fontWeight: 900,
    fontSize: 20,
    marginTop: -13,
    marginLeft: 25,
    marginRight: 25
  },

  line : {
    backgroundColor: 'lightgray',
    height: 1,
    width: 75
  },

  singInTextWithGoogle : {
    flexDirection: 'row',
    paddingLeft : 30,
    paddingRight : 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2
  },

  signUp : {
    marginBottom: 35
  }



});