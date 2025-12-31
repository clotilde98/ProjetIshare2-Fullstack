import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useLocation = () => {
    const [locating, setLocating] = useState(false);

    const getCurrentAddress = async () => {
        setLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "L'accès à la localisation a été rejeté.");
                return null;
            }

            // 2. Obtenir les coordonnées
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            // 3. Reverse Geocoding (Lat/Lon -> Adresse)
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                return reverseGeocode[0]; // Retourne l'objet adresse complet
            }
            return null;

        } catch (error) {
            Alert.alert("Erreur", "Impossible de récupérer la position actuelle.");
            return null;
        } finally {
            setLocating(false);
        }
    };

    return { getCurrentAddress, locating };
};

export default () => null;