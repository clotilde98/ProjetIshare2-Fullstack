import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Axios from '../../src/service/api.js';

export default function Reservation({ item, onDelete }) {
  const navigation = useNavigation();
  
  const defaultAvatar = 'https://ui-avatars.com/api/?name=' + (item.ownerName);
  const defaultFood = 'https://via.placeholder.com/150?text=No+Image';
const handleDelete = async () => {
    Alert.alert(
      "Confirmation", 
      "Voulez-vous vraiment annuler cette réservation ?", 
      [
        {
          text: "Non",
          style: "cancel"
        },
        { 
          text: "Oui, annuler", 
          style: "destructive", 
          onPress: async () => {
            try {
              await Axios.delete(`/reservations/${item.id}`);
              Alert.alert("Succès", "Réservation annulée.");
              if (onDelete) onDelete();
            } catch (err) {
              Alert.alert("Erreur", "Impossible d'annuler.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.groupContainer}>
      <View style={styles.userRow}>
        <Image source={{ uri: item.ownerPhoto || defaultAvatar }} style={styles.avatarCircle} />
        <Text style={styles.userName}>{item.ownerName}</Text>
      </View>

      <View style={styles.resItemContainer}>
        <Image source={{ uri: item.image || defaultFood }} style={styles.resImage} />
        
        <View style={styles.resContentWrapper}>
          <Text style={styles.resTitle} numberOfLines={1}>
            {item.postTitle || item.title}
          </Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color="black" />
            <View style={styles.addressTextContainer}>
              <Text style={styles.resSubText}>{item.address}</Text>
              <Text style={styles.resSubText}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate('PostPage', { postData: item })}
            >
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: { marginBottom: 30, backgroundColor: '#fff', paddingHorizontal: 10 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarCircle: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
  userName: { fontSize: 16, fontWeight: '600', color: '#000' },
  resItemContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  resImage: { width: 90, height: 90, borderRadius: 15, marginRight: 15 },
  resContentWrapper: { flex: 1, minHeight: 90, justifyContent: 'space-between' },
  resTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  addressTextContainer: { flex: 1, marginLeft: 4 },
  resSubText: { fontSize: 12, color: '#666' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  seeMoreButton: { backgroundColor: '#000', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  seeMoreText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  cancelButton: { borderWidth: 1.5, borderColor: '#FF4D4D', paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20 },
  cancelButtonText: { color: '#FF4D4D', fontWeight: 'bold', fontSize: 13 },
});