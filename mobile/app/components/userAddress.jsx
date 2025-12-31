import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Axios from '../../src/service/api.js';
import { useLocation } from '../_hook/useLocation.jsx';

export default function UserAddress() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [addressId, setAddressId] = useState(null); 
    const [combinedCitiesData, setCombinedCitiesData] = useState([]); 
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { getCurrentAddress, locating } = useLocation();

    async function getAllCitiesFromApi() {
        setLoading(true);
        try {
            const response = await Axios.get("/getAllCities/");
            const data = response.data;
            if (Array.isArray(data)) {
                const formattedData = data.map(item => ({
                    label: `${item.postal_code} - ${item.city}`, 
                    value: item.id 
                }));
                setCombinedCitiesData(formattedData);
            }
        } catch (error) {
            setErrorMessage("Failed to load location data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCitiesFromApi();
    }, []);

    const handleSubmit = async () => {
        if (!street.trim() || !number.trim() || !addressId) {
            Alert.alert("Champs manquants", "Merci de remplir l'adresse complète.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                street: street.trim(),
                streetNumber: parseInt(number, 10), 
                addressID: addressId
            };

            await Axios.patch(`/users`, payload);

            Alert.alert(
                "Succès", 
                "Adresse enregistrée avec succès !",
                [{ text: "OK", onPress: () => router.replace('/components/home') }]
            );

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Une erreur est survenue lors de la mise à jour.";
            Alert.alert("Erreur", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleLocateMe = async () => {
        const address = await getCurrentAddress();
        
        if (address) {
            setStreet(address.street || "");
            setNumber(address.streetNumber || "");

            if (address.city || address.postalCode) {
                const foundCity = combinedCitiesData.find(c => 
                    c.label.toLowerCase().includes(address.city?.toLowerCase()) || 
                    c.label.includes(address.postalCode)
                );
                if (foundCity) {
                    setAddressId(foundCity.value);
                }
            }
        }
    };

    if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../../assets/images/background2.png')} 
                style={styles.backgroundImage} 
                resizeMode="cover"
            >
                <View style={styles.textContainer}>
                    <Text style={styles.text1}>What is your</Text>
                    <Text style={styles.text2}>address ?</Text>

                   

                    <View style={styles.row}>
                        <TextInput
                            placeholder="Street"
                            style={[styles.input, styles.street]}
                            value={street}
                            onChangeText={setStreet}
                        />
                        <TextInput
                            placeholder="No."
                            style={[styles.input, styles.number]}
                            value={number}
                            keyboardType="numeric"
                            onChangeText={setNumber}
                        />
                    </View>

                    <View style={styles.row}>
                        <Dropdown
                            style={[styles.input, styles.dropdownFull]}
                            data={combinedCitiesData}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Postal Code - City"
                            value={addressId}
                            onChange={item => setAddressId(item.value)}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                        />
                    </View>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                     <Button
                        textColor="black"
                        labelStyle={{ fontSize: 14, fontFamily: 'Poppins_700Bold' }}
                        style={[styles.button, styles.buttonLocation]}
                        onPress={handleLocateMe}
                        loading={locating || loading}
                        icon={() => (
                            <Image source={require('../../assets/images/location_searching.png')} style={styles.icon} resizeMode="contain" />
                        )}
                    >
                        Locate me
                    </Button>
                </View>

                <View style={styles.bottomButtons}>
                    <Button 
                        buttonColor="#E1ACA6" 
                        textColor="black" 
                        style={[styles.button, styles.buttonSkip]}
                        onPress={() => router.replace('/components/home')}
                    >
                        Skip
                    </Button>
                    <Button
                        buttonColor="black"
                        textColor="white"
                        loading={loading}
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        Submit
                    </Button>
                </View>
            </ImageBackground> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, justifyContent: 'center', paddingLeft: 20 },
    textContainer: { paddingHorizontal: 16 },
    text1: { fontFamily: 'Poppins_700Bold', fontSize: 48 },
    text2: { fontFamily: 'Poppins_400Regular', fontSize: 40, marginBottom: 12 },
    row: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    input: { height: 40, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 10 },
    street: { width: 220 },
    number: { width: 80 },
    dropdownFull: { width: 308 },
    placeholderStyle: { fontSize: 14, color: '#888' },
    selectedTextStyle: { fontSize: 14, color: '#000' },
    button: { width: 110, height: 48, borderRadius: 8, justifyContent: 'center' },
    buttonLocation: { width: 160, borderWidth: 1.5, borderColor: 'black', marginVertical: 15 },
    buttonSkip: { borderWidth: 1.5, borderColor: 'black' },
    bottomButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginRight: 20 },
    errorText: { color: 'red', fontSize: 12, marginTop: 5 },
    icon: { width: 18, height: 18 }
});