import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewClustering from 'react-native-map-clustering';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import mapStyles from './styles/components/mapStyles';
import { PermissionsAndroid, Platform } from 'react-native';

interface Pothole {
  lat: number;
  lng: number;
  depth: number;
  severity: string;
}

const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Optional location permission request (for blue dot demo)
  useEffect(() => {
    const maybeRequestLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Allow Location Access?',
              message:
                'This helps show your current position on the map. You can deny if not needed.',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            }
          );
        } catch (err) {
          console.warn('Location permission not granted (demo mode)');
        }
      }
    };

    maybeRequestLocation();
  }, []);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/api/potholes')
      .then(res => {
        setPotholes(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log('Backend not running — showing map only');
        setPotholes([]); // no freeze if offline
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF8E8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mapStyles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={mapStyles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={mapStyles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* MapView */}
      <MapViewClustering
        style={mapStyles.map}
        initialRegion={{
          latitude: 28.6024, // UCF coords for testing
          longitude: -81.2001,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsCompass
        zoomControlEnabled={true} //visible on Android; ignored on iOS safely
        clusterColor="#2A9D8F"      // cluster bubble color
        clusterTextColor="#FFFFFF"  // number color inside cluster
        spiralEnabled={true}        // smooth animation when zooming
        animationEnabled={true}
      >
        {/* 🔹 Static test pins */}
        <Marker
          coordinate={{ latitude: 28.6025, longitude: -81.2005 }}
          title="Test Pothole 1"
          description="Depth: 2.5 in"
          pinColor="#F4A261"
        />
        <Marker
          coordinate={{ latitude: 28.6040, longitude: -81.1990 }}
          title="Test Pothole 2"
          description="Depth: 4.0 in"
          pinColor="#E63946"
        />
        <Marker
          coordinate={{ latitude: 28.6010, longitude: -81.2030 }}
          title="Test Pothole 3"
          description="Depth: 1.2 in"
          pinColor="#FFD166"
        />
        {potholes.map((p, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={`Pothole (${p.severity})`}
            description={`Depth: ${p.depth ?? 'N/A'} in`}
            pinColor={
              p.severity === 'minor'
                ? '#FFD166'
                : p.severity === 'moderate'
                  ? '#F4A261'
                  : p.severity === 'severe'
                    ? '#E63946'
                    : '#2A9D8F'
            }
          />
        ))}
      </MapViewClustering>
    </SafeAreaView>
  );
};

export default MapScreen;
