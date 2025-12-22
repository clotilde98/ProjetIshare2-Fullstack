import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Connexion from './connexion.jsx';




export default function Login({navigation}){

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/background1.jpg')} style ={styles.image}>
            <Text style={styles.title}>iShare</Text>
            <Connexion></Connexion>
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