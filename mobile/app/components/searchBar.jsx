import { Image, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

 


export default function SearchBar({textValue, onChangeText, style, handleIconPress= null}){

    const {t} = useTranslation(); 
    
    return(
        
        <View >
         <TextInput placeholder={t('searchBarText')}
         value={textValue}
         onChangeText={onChangeText}
         style={[styles.searchInput, style]}
        placeholderTextColor="#999"
        right= {
            <TextInput.Icon 
                onPress={handleIconPress}
                icon={() => (
                   <Image
                        source={require('../../assets/images/page_info.jpg')}
                    style={styles.iconImage}
                    />

                )}
            />
        }
        />

        </View>

    ); 

}


const styles=StyleSheet.create({
    searchInput:{
        backgroundColor: '#fff',
        borderRadius: 8,
        fontSize: 14,
        paddingVertical: 0,
        height: 39
        


    },
    iconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    }
})