import { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, Alert, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import avatarProfil from '../../assets/images/avatarProfil.jpg';
import Axios from "../../src/service/api.js";
import { AuthContext } from '../../src/context/authContext.js';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

export default function UserProfil() {

  const navigation = useNavigation();  
  const { t } = useTranslation();  
  const { user } = useContext(AuthContext);
  
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [userImage, setUserImage] = useState(user.photo);
  const [image, setImage] = useState(null);
  const [streetText, setStreetText] = useState(null);
  const [streetNumberText, setStreetNumberText] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hiddenCurrentPassword, setHiddenCurrentPassword] = useState(false);


  const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      PoppinsBold: Poppins_700Bold,
      UITextSF: require('../../assets/fonts/FontsFree-Net-SF-UI-Text-Semibold.ttf'),
      RoadUIRegular: require('../../assets/fonts/RoadUI-Regular.ttf')
    });

  const fetchCities = async () => {
    try {
      const res = await Axios.get("getAllCities/");
      setCities(res.data.map(item => ({
        value: item.id,
        label: `[${item.postal_code}] ${item.city}`
      })));
    } catch (error) {
      Alert.alert(t('error.errorText'), err.response?.data ? err.response.data : err.toString());
    }
  };

  const handleUserUpdate = async (formData) => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      const response = await fetch("http://192.168.0.119:3002/users/", {
        method: "PATCH",
        body: formData,
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      Alert.alert(t('succes.modification'), JSON.stringify(data));
    } catch (err) {
      Alert.alert(t('error.errorText'), err.response?.data ? err.response.data : err.toString());
    }
  };

  const handleSubmit = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert(t('error.errorText'), t('error.notSameInput'));
      return;
    }

    const formData = new FormData();
    if (confirmPassword) formData.append("password", confirmPassword);
    if (currentPassword) formData.append("oldPassword", currentPassword);
    if (username) formData.append("username", username);
    if (streetNumberText && !isNaN(Number(streetNumberText))) formData.append("streetNumber", streetNumberText);
    if (streetText) formData.append("street", streetText);
    if (selectedCity) formData.append("addressID", selectedCity);
    if (image) formData.append("photo", { uri: image, name: "photo.jpg", type: "image/jpeg" });

    handleUserUpdate(formData);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert(t('error.permissionImage'));
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  useEffect(() => { fetchCities() }, []);

  if (!fontsLoaded) {
    return <Text>{t('chargementText')}</Text>;
  }

  return (
    <ImageBackground source={require("../../assets/images/background2.jpg")} style={styles.image} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: -100, }}>
            <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profileTitle')}</Text>
        </View>

        <View style={styles.profileCard}>
          <Avatar.Image source={userImage ? { uri: image } : avatarProfil} size={width * 0.2} />
          <Text style={styles.username}>{user.username}</Text>
          <Pressable style={styles.changePicButton} onPress={pickImage}>
            <Text style={styles.changePicText}>{t('pictureButton')}</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('usernameInput')}</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('NumberInputText')}</Text>
            <TextInput style={styles.input} value={streetNumberText} onChangeText={setStreetNumberText} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('streetInputText')}</Text>
            <TextInput style={styles.input} value={streetText} onChangeText={setStreetText} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('menuCityPostalCode')}</Text>
            <Dropdown
              style={styles.input}
              data={cities}
              labelField="label"
              valueField="value"
              placeholder="Select City and Postal Code"
              value={selectedCity}
              onChange={item => setSelectedCity(item.value)}
              placeholderStyle={{ fontSize: width * 0.03, color: '#888' }}
              selectedTextStyle={{ fontSize: width * 0.03, color: '#000' }}
              renderRightIcon={() => (
                <Image
                  source={require('../../assets/images/ArrowLineUpDown.png')}
                  style={{ width: width * 0.04, height: width * 0.04 }}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('currentPasswordInput')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={hiddenCurrentPassword} />
              <Pressable onPress={() => setHiddenCurrentPassword(!hiddenCurrentPassword)}>
                <Feather name={hiddenCurrentPassword ? 'eye-off' : 'eye'} size={width * 0.05} color="#000" style={{ marginRight: 5 }} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('newPasswordInput')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
              <Feather name="eye-off" size={width * 0.05} color="#000" style={{ marginRight: 5 }} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('confirmPasswordInput')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              <Feather name="eye-off" size={width * 0.05} color="#000" style={{ marginRight: 5 }} />
            </View>
          </View>
        </View>

        <Pressable style={styles.confirmButton} onPress={handleSubmit}>
          <Text style={styles.confirmButtonText}>{t('confirmEditButton')}</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
   header: {
        flexDirection: 'row',
        marginTop: '5%'  
    }, 
  title: {
    fontSize: 40,
    fontWeight: '400',
    marginBottom: 0.02,
    color: '#1c1c1c',
    fontFamily: "Poppins_400Regular", 
  },
  profileCard: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: width * 0.05,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: height * 0.03,
  },
  username: {
    marginTop: height * 0.015,
    fontSize: width * 0.045,
    fontWeight: '700',
  },
  changePicButton: {
    backgroundColor: '#000',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.03,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  changePicText: {
    color: 'white',
    fontSize: width * 0.03,
  },
  inputGroup: {
    width: '100%',
    marginBottom: height * 0.015,
  },
  label: {
    fontWeight: '600',
    marginBottom: height * 0.005,
    color: '#555',
    fontSize: width * 0.03,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1aca6',
    borderRadius: 8,
    paddingHorizontal: width * 0.02,
    height: height * 0.05,
    backgroundColor: '#fce9d8',
    fontSize: width * 0.04,
    paddingBottom: width*0.016
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1aca6',
    borderRadius: 8,
    backgroundColor: '#fce9d8',
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: width * 0.02,
    height: height * 0.05,
    fontSize: width * 0.03,
    paddingBottom: width*0.02
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.05,
    alignSelf: 'center',
    marginBottom: "5%"
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: width * 0.035,
  },
});
