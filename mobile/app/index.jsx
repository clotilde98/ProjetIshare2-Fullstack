/*import {AuthContext, AuthProvider } from '../src/context/authContext';
import A from './components/a.jsx';
import B from './components/b.jsx';
import Login from './components/login.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '1027280401462-sd77d2qaggcilr0q9u3hp87vce2j27aa.apps.googleusercontent.com',
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom tabs (A and B screens)
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="A" component={A} options={{
          tabBarIcon: () => <Ionicons name="home-outline" size={24} color="black" />,
        }} />
      <Tab.Screen name="B" component={B} />
    </Tab.Navigator>
  );
}

// Root navigator
export default function Index() {
  return (
    <AuthProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </AuthProvider>
  );
}
*/


import { AuthProvider, AuthContext } from '../src/context/authContext';
import ressourcesPage from './components/ressourcesPage.jsx';
import createPost from './components/createPost.jsx';
import Login from './components/login.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '1027280401462-sd77d2qaggcilr0q9u3hp87vce2j27aa.apps.googleusercontent.com',
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="CreatePost" component={createPost} />
        <Tab.Screen
        name="RessourcesPage"
        component={ressourcesPage}
        options={{
          tabBarIcon: () => <Ionicons name="home-outline" size={24} color="black" />,
        }}
      />
      
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useContext(AuthContext); 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={Login} initialParams={{ isSignUp: true }}/>
      )}
      <Stack.Screen name="Signup" component={Login} initialParams={{ isSignUp: false }}/>
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
