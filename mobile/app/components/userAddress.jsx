import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import Axios from "../../src/service/api.js";
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';


export default function UserAddress (){

    const { t } = useTranslation();

    const [fontsLoaded]=useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    })

    const [street, setStreet] = useState(""); 
    const [number, setNumber]= useState(""); 
    
    const [cities, setCities]=useState([]);
    const [city, setCity] = useState("");
    
    const [postalCode, setPostalCode] = useState(""); 
    const [postalCodes, setPostalCodes]=useState([]); 

    const [errorMessage, setErrorMessage] = useState('');


    

    
async function getAllCitiesFromApi() {

  try {
    const response = await Axios.get("/getAllCities/");

    const data = response.data;

      const tabCities = data.map(c => ({
        label: c.city,
        value: c.city
      }));
      const tabPostalCodes = data.map(c => ({
        label: c.postal_code,
        value: c.postal_code
      }));

      setCities(tabCities);
      setPostalCodes(tabPostalCodes);
      setErrorMessage('');

  } catch (error) {
      Alert.alert(t('error.errorText'), err.response? `${message}\n\nStatus: ${err.response?.status}` : err.response?.data ? err.response.data : err.toString()); 
  }
}



useEffect(() => {
  getAllCitiesFromApi();
}, []);


    if (!fontsLoaded) {
    return <Text>{t('chargementText')}</Text>; 
    }

    return(

        <View style={styles.container}>
            
        <View style={styles.textContainer}>
        <Text style={styles.text1}>{t('questionpart1')}</Text>
        <Text style={styles.text2}>{t('textAddress')}</Text>   

        <Button  textColor="black" labelStyle = {{fontSize:14, fontFamily: 'Poppins_700Bold'}} style={[styles.button, styles.buttonLocation]} icon={() => (
            <Image source={require('../../assets/images/location_searching.png')} style={styles.icon} resizeMode="contain"/>
        )}>Locate me</Button> 
        
        <View style={styles.row}>
          <TextInput
            placeholder={t('streetInputText')}
            style={[styles.input, styles.street]}
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            placeholder={t('NumberInputText')}
            style={[styles.input, styles.number]}
            value={number}
            onChangeText={setNumber}
          />
        </View>

        <View style={styles.row}>
          <Dropdown
            style={[styles.input, styles.dropdownCity]}
            data={cities}
            labelField="label"
            valueField="value"
            placeholder={t('CityMenuText')}
            value={city}
            onChange={item => setCity(item.value)}
            placeholderStyle={{ fontSize: 16, color: '#888' }} 
            selectedTextStyle={{ fontSize: 16, color: '#000' }} 
            renderRightIcon={() => ( <Image source={require('../../assets/images/ArrowLineUpDown.png')} style={{ width: 18, height: 18 }}/>)}
          />

          <Dropdown
            style={[styles.input, styles.postal]}
            data={postalCodes}
            labelField="label"
            valueField="value"
            placeholder={t('PostalCodeMenuText')}
            value={postalCode}
            onChange={item => setPostalCode(item.value)}
            placeholderStyle={{ fontSize: 16, color: '#888' }} 
            selectedTextStyle={{ fontSize: 16, color: '#000' }} 
            renderRightIcon={() => ( <Image source={require('../../assets/images/ArrowLineUpDown.png')} style={{ width: 18, height: 18 }}/>)}
          />
        </View>
      </View>

      <View style={styles.bottomButtons}>
        <Button
          buttonColor="#E1ACA6"
          textColor="black"
          style={[styles.button, styles.buttonSkip]}
        >
          {t('skipButtonText')}
        </Button>
        <Button
          buttonColor="black"
          textColor="white"
          labelStyle={{ fontFamily: 'Poppins_700Bold', fontSize: 14 }}
          style={styles.button}
        > 
          {t('submitButtonText')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20
  },

  textContainer: {
    paddingHorizontal: 16,
  },

  text1: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 48,
    fontWeight: 'bold',
  },

  text2: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 40,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },

  input: {
    height: 36,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  dropdownCity: {
      width: 156, 
      height: 36
  },
  
  street: {
  width: 212, 
  height: 36
  },

  number: {
    width: 106,
    height:36, 
  },

  postal: {
    width: 161, 
    height: 36
  },

  button: {
    width: 102,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
  },

  buttonLocation: {
    width: 145,
    borderWidth: 2,
    borderColor: 'black',
    marginVertical: 12,
    marginBottom: 20
  },

  buttonSkip: {
    borderWidth: 2,
    borderColor: 'black',
  },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginRight: 30
  },
});


