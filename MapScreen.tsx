import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import mapStyles from './styles/components/mapStyles'; // ✅ adjust if your path differs

interface Pothole {
  lat: number;
  lng: number;
  depth: number;
  severity: string;
}

const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/api/potholes')
      .then(res => {
        setPotholes(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log('⚠️ Backend not running — showing map only');
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
      <MapView
        style={mapStyles.map}
        initialRegion={{
          latitude: 28.6024, // UCF coords for testing
          longitude: -81.2001,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsCompass
        zoomControlEnabled={true} // ✅ visible on Android; ignored on iOS safely
      >
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
      </MapView>
    </SafeAreaView>
  );
};

export default MapScreen;
