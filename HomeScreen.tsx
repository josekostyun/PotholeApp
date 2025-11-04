import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import homeScreenStyles from './styles/components/homeScreenStyles'; // 

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleStartRoute = (): void => {
    console.log('Start Route pressed');
    navigation.navigate('Map'); // 
  };

  const handleReviewReports = (): void => {
    console.log('Review Reports pressed');
    navigation.navigate('Potholes');
  };

  const handleReportProblem = (): void => {
    console.log('Report a Problem pressed');
    navigation.navigate("BleTest");
  };

  const handleLogOut = (): void => {
    console.log('Log Out pressed');
    navigation.replace('Login'); //
  };

  return (
    <SafeAreaView style={homeScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1A1A" />

      <View style={homeScreenStyles.content}>
        {/* Start Route */}
        <TouchableOpacity
          style={[homeScreenStyles.button, homeScreenStyles.activeButton]}
          onPress={handleStartRoute}
          activeOpacity={0.8}
        >
          <Text style={homeScreenStyles.buttonText}>Start Route</Text>
        </TouchableOpacity>

        {/* Review Reports */}
        <TouchableOpacity
          style={homeScreenStyles.button}
          onPress={handleReviewReports}
          activeOpacity={0.8}
        >
          <Text style={homeScreenStyles.buttonText}>Review Reports</Text>
        </TouchableOpacity>

        {/* Report a Problem */}
        <TouchableOpacity
          style={homeScreenStyles.button}
          onPress={handleReportProblem}
          activeOpacity={0.8}
        >
          <Text style={homeScreenStyles.buttonText}>Report a Problem</Text>
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          style={homeScreenStyles.button}
          onPress={handleLogOut}
          activeOpacity={0.8}
        >
          <Text style={homeScreenStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
