import { useEffect, useState, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { View, Text, Alert, Image, ImageBackground, StyleSheet, Dimensions } from "react-native";
import Axios from "../../src/service/api.js";
import { AuthContext } from '../../src/context/authContext.js';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as tokenService from "../../src/service/token.js";
import { Pressable } from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { height, width } = Dimensions.get('window');

export default function Setting() {

  const { t } = useTranslation();
  const { user, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userAddress, setUserAddress] = useState(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    PoppinsBold: Poppins_700Bold,
    UITextSF: require('../../assets/fonts/FontsFree-Net-SF-UI-Text-Semibold.ttf'),
    RoadUIRegular: require('../../assets/fonts/RoadUI-Regular.ttf')
  });

  async function fetchUserAddress() {
    try {
      const res = await Axios.get(`/getAllCities/`);
      setUserAddress(res.data);
       let iCity=0
       while(iCity < res.data.length && res.data[iCity].id!= user.address_id){
        iCity++; 
       }
       setUserAddress(res.data[iCity]); 
    

    } catch (err) {
      Alert.alert(t('error'), t("retrieveAdress"));
    }
  }

  async function deleteUserFromApi() {
    try {
      await Axios.delete('/users/');
      setUser(null);
    } catch (err) {
      Alert.alert(t('error'), t('deleteAccount'));
    }
  }

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      tokenService.removeToken();
      setUser(null);
    } catch {
      Alert.alert(t('error'), t("logOut"));
    }
  };

  useEffect(() => {
    if (user && user.address_id) {
      fetchUserAddress();
    }
  }, [user.address_id]);

  if (!fontsLoaded) {
    return <Text>{t('chargementText')}</Text>;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background2.jpg")}
      style={styles.image}
      resizeMode="cover"
    >

      <View style={styles.titleProfileContainer}>
        <Text style={styles.title}>{t('profileTitle')}</Text>
      </View>

      <View style={styles.container}>

        {/* PROFILE */}
        <View style={styles.profileContainer}>
          <Avatar.Image source={{ uri: user.photo }} size={width * 0.35} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* ADDRESS */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>{t('address')}</Text>
          <Text style={styles.addressText}>
            {userAddress
              ? `${user.street}, ${user.street_number}, ${userAddress.postal_code}, ${userAddress.city}`
              : t('informationsAddress')}
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.containerRows}>

          <Pressable onPress={() => navigation.navigate('UserProfil')} style={({pressed}) => [styles.row,   pressed && styles.buttonPressed] }>
            <View style={styles.rowLeft}>
              <MaterialIcons name="edit" size={width * 0.06} />
              <Text style={styles.rowText}>{t('editProfile')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={width * 0.08} />
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Language')}  style={({pressed}) => [styles.row,   pressed && styles.buttonPressed] }>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="flag-outline" size={width * 0.06} />
              <Text style={styles.rowText}>{t('languageText')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={width * 0.08} />
          </Pressable>

          <Pressable onPress={handleGoogleSignOut}  style={({pressed}) => [styles.row,   pressed && styles.buttonPressed] }>
            <View style={styles.rowLeft}>
              <Image source={require('../../assets/images/chip_extraction.png')} style={styles.iconImage} />
              <Text style={styles.rowText}>{t('deconnectButton')}</Text>
            </View>
          </Pressable>

          <Pressable onPress={deleteUserFromApi}  style={({pressed}) => [styles.row,   pressed && styles.buttonPressed] }>
            <View style={styles.rowLeft}>
              <Feather name="trash-2" size={width * 0.06} color="#E1ACA6" />
              <Text style={[styles.rowText, { color: "#E1ACA6" }]}>
                {t('deleteAccount')}
              </Text>
            </View>
          </Pressable>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.1,
  },

  titleProfileContainer: {
    position: 'absolute',
    top: height * 0.04,
  },

  title: {
    fontFamily: 'Poppins_400Regular',
    fontSize: width * 0.1,
  },

  container: {
    width: width * 0.85,
    maxHeight: height * 0.85,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: height * 0.03,
    marginTop: height * 0.02,
    paddingBottom: height * 0.02
  },

  profileContainer: {
    alignItems: 'center',
    marginBottom: height * 0.01,
  },

  username: {
    marginTop: height * 0.015,
    fontSize: width * 0.06,
    fontFamily: 'PoppinsBold',
  },

  email: {
    fontSize: width * 0.04,
    color: "#E1ACA6",
    fontFamily: 'Poppins_400Regular',
  },

  addressContainer: {
    width: '90%',
    marginBottom: height * 0.03,
  },

  addressTitle: {
    fontFamily: 'UITextSF',
    fontSize: width * 0.045,
  },

  addressText: {
    marginTop: height * 0.01,
    fontFamily: 'RoadUIRegular',
    fontSize: width * 0.04,
  },

  containerRows: {
    width: '90%',
    gap: height * 0.025,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowText: {
    marginLeft: width * 0.03,
    fontSize: width * 0.040,
    fontFamily: 'PoppinsBold',
  },

  iconImage: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  buttonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  }
});
