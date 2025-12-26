import { Avatar } from '@kolking/react-native-avatar';
import { View, Text, StyleSheet } from 'react-native';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';

export default function Comment({ imgSource, imgSize, username=null, content, isCurrentUser=false }) {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <Avatar source={{ uri: imgSource }} size={imgSize} />

            <View style={styles.textContainer}>
                {username && (
                    <Text style={[styles.username]}>
                        {username}
                    </Text>
                )}

                <Text style={[styles.content, { fontFamily: isCurrentUser ? '' : 'Poppins_400Regular', fontWeight : isCurrentUser ? '300': '100' }]}>
                    {content}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 2,
    },
    content: {
        fontSize: 15,
        flexWrap: 'wrap',
        marginRight: 10,
    },
});
