import { AuthProvider, AuthContext } from '../src/context/authContext';
import ressourcesPage from './components/ressourcesPage.jsx';
import createPost from './components/createPost.jsx';
import Login from './components/login.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useContext } from 'react';
import Language from './components/language.jsx'
import Notifications  from './components/notification.jsx';
import Accueil from './components/accueil.jsx';
import UserProfil from './components/userProfil.jsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import Setting from './components/setting.jsx'; 
import username from './components/username.jsx';
import PostPage from './components/postPage.jsx';



GoogleSignin.configure({
  webClientId: '1027280401462-sd77d2qaggcilr0q9u3hp87vce2j27aa.apps.googleusercontent.com',
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();







function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Language" component={Language} />
      <Tab.Screen name="Accueil" component={Accueil} />
      <Tab.Screen name="CreatePost" component={createPost} />
      <Tab.Screen name="Setting" component={Setting}/>
        <Tab.Screen
        name="RessourcesPage" component={ressourcesPage}
        options={{
          tabBarIcon: () => <AntDesign name="copy" size={24} color="black" />,
        }}
      />
      <Tab.Screen name="Create Post" options={{ tabBarIcon: () => <AntDesign name="plus" size={24} color="black" />,}} component={createPost} />

      
    </Tab.Navigator>
    
  );
}


function RootNavigator() {
  const { user } = useContext(AuthContext); 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} initialParams={{ isSignUp: true }}/>
      <Stack.Screen name="PostPage" component={PostPage}/>
      <Stack.Screen name="Signup" component={Login} initialParams={{ isSignUp: false }}/>
      <Stack.Screen 
        name="UserProfil" 
        component={UserProfil} 
        options={{ title: 'UserProfil' }} 
      />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      <Stack.Screen name="Username" component={username} />
      
    </Stack.Navigator>
  );
}




export default function Index() {
  return (

    <AuthProvider>
      <RootNavigator />
      <Toast />
    </AuthProvider>

  );
}
