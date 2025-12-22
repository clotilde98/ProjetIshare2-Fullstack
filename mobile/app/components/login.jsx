import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Connexion from './connexion.jsx';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/authContext.js';
import { useEffect } from 'react';



export default function Login({route, navigation}){
    
    const {user, setUser} = useContext(AuthContext);
    const {isSignUp} = route.params;


    useEffect(() => {
        alert("User courant : " + JSON.stringify(user, null, 2));
        if (user){
            navigation.navigate("Main")
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/background1.jpg')} style ={styles.image}>
            <Text style={styles.title}>iShare</Text>
            <Connexion isSignUp={isSignUp} navigation={navigation} ></Connexion>
            </ImageBackground>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {    
        flex:1,    
        justifyContent: 'center', 
        backgroundColor: '#fff',  
    },
    image : {          
        flex:1,    
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    title : {
        fontFamily: 'Jaro', 
        fontSize: 64,
        fontWeight: 500
    }
})