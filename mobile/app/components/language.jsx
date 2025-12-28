import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ImageBackground, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import i18next, { languageResources } from '../../src/service/i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Language(){


    const navigation = useNavigation();

    const {t} = useTranslation(); 

    const changeLanguage = (lng) => {
        i18next.changeLanguage(lng);
    }

    

    const [fontsLoaded] = useFonts({
        PoppinsRegular: Poppins_400Regular,
        PoppinsBold: Poppins_700Bold,
    });


  if (!fontsLoaded) {
    return <Text>{t('loadingText')}</Text>;
  }

    return (

        <ImageBackground source={require("../../assets/images/background2.jpg")} style={styles.image} resizeMode="cover">
         

         <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrow-left" size={24} color="black" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>{t('setting')}</Text>
        
         </View> 
         
         
         <View style={styles.container}> 
            
            <View style={styles.languagesList}>
            <FlatList data={Object.keys(languageResources)}   keyExtractor={(item) => item} renderItem={({item}) => (
                <TouchableOpacity style={styles.languageButton} onPress= {() => changeLanguage(item)}>
                <Text style={styles.lngName}>{t(item)}</Text>
                </TouchableOpacity> )} 
            />
            </View>
            
        
         </View>

        
        </ImageBackground>

    ); 

}

const styles = StyleSheet.create({
    image: {
    flex: 1,
    },
    header: {
        marginTop: 40, 
        flexDirection: 'row',
        paddingHorizontal: "1%",
        marginBottom: "5%", 
        alignItems: 'center',     
    }, 
    headerTitle: {
        fontSize: 22,
        fontFamily: 'PoppinsBold',
        marginLeft: "2%",
        paddingTop:"1%"
    }, 
    container: {
        backgroundColor: "white",
        flex: 1, 
        alignItems: 'center',   
        marginLeft: '5%', 
        marginRight: '5%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        
    }, 
    languagesList: {
        width: '85%',  
        flex: 1, 
        justifyContent: 'center', 
        padding: 10,
    
    }, 
    languageButton: {
        padding: 10, 
        borderBottomColor:'black', 
        borderBottomWidth: 1
    }, 
    lngName: {
        fontSize: 16, 
        fontFamily: 'PoppinsRegular'

    }
})
