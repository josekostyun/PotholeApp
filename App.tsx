import React, { useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import { loginStyles } from './styles/components/LoginScreenStyles'; // 

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const iconScale = new Animated.Value(1);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(iconScale, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = () => {
    console.log('Login pressed:', { username, password });
    navigation.replace('Home'); // ✅ navigate to HomeScreen
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1A1A" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: keyboardVisible ? 10 : 50,
            paddingBottom: keyboardVisible ? 120 : 50,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Animated Icon */}
          <Animated.View
            style={[
              loginStyles.iconContainer,
              {
                transform: [{ scale: iconScale }],
                marginBottom: keyboardVisible ? 20 : 80,
              },
            ]}
          >
            <View style={loginStyles.iconBackground}>
              <Image
                source={require('./assets/icons/icon-512.png')}
                style={loginStyles.carIcon}
              />
            </View>
          </Animated.View>

          {/* Username Input */}
          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="Username"
              placeholderTextColor="#FFFFFF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={loginStyles.clearButton}
              onPress={() => setUsername('')}
            >
              <Image
                source={require('./assets/icons/close.png')}
                style={loginStyles.clearIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Password Input */}
          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={loginStyles.clearButton}
              onPress={() => setPassword('')}
            >
              <Image
                source={require('./assets/icons/close.png')}
                style={loginStyles.clearIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <View style={loginStyles.loginButtonContainer}>
            <TouchableOpacity
              style={loginStyles.loginButton}
              onPress={handleLogin}
            >
              <Text style={loginStyles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Settings Button */}
      <TouchableOpacity style={loginStyles.settingsContainer}>
        <Image
          source={require('./assets/icons/cog.png')}
          style={loginStyles.settingsIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
